import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/categories - Get all parent categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug/subcategories - Get subcategories for a parent
router.get('/:slug/subcategories', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Find the parent category
    const parentResult = await pool.query(
      'SELECT id FROM categories WHERE slug = $1 AND parent_id IS NULL',
      [slug]
    );

    if (parentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Parent category not found' });
    }

    const parentId = parentResult.rows[0].id;

    const result = await pool.query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY name ASC',
      [parentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// GET /api/categories/:slug - Get a single category by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
