import { Router, Request, Response } from 'express';
import pool from '../config/database';
import nodemailer from 'nodemailer';

const router = Router();

// In-memory OTP store (use Redis in production)
const otpStore: Map<string, { code: string; expires: number; businessData: Record<string, unknown> }> = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/register/send-otp - Send OTP to email
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, categoryId, state, city, description, website, latitude, longitude } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !categoryId || !state || !city) {
      return res.status(400).json({ error: 'Name, phone, email, category, state, and city are required' });
    }

    // Validate phone format (Australian mobile)
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^(\+?61|0)4\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid Australian mobile number (04XX XXX XXX)' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with business data
    otpStore.set(email.toLowerCase(), {
      code: otp,
      expires,
      businessData: { name, phone: cleanPhone, email, categoryId, state, city, description, website, latitude, longitude },
    });

    // Send email
    await transporter.sendMail({
      from: `"OzNepal" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'OzNepal - Verify Your Business Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc143c;">🇳🇵 OzNepal Verification</h2>
          <p>Hi there,</p>
          <p>Your verification code to register <strong>${name}</strong> on OzNepal is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${otp}</span>
          </div>
          <p>This code is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">OzNepal - All Nepali Oz Businesses in One Place</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
  }
});

// POST /api/register/verify - Verify OTP and register business
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
    }

    if (stored.code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // OTP verified — register the business
    const { name, phone, categoryId, state, city, description, website, latitude, longitude } = stored.businessData;

    const result = await pool.query(
      `INSERT INTO businesses (name, category_id, state, city, phone, email, description, website, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [name, categoryId, state, city, phone, email, description || null, website || null, latitude || null, longitude || null]
    );

    // Clean up OTP
    otpStore.delete(email.toLowerCase());

    res.json({
      success: true,
      message: 'Business registered successfully!',
      businessId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to register business. Please try again.' });
  }
});

export default router;
