import pool from '../config/database';

const migrate = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Drop existing tables to rebuild with new structure
    await client.query('DROP TABLE IF EXISTS businesses CASCADE');
    await client.query('DROP TABLE IF EXISTS categories CASCADE');

    // Create categories table with parent_id for hierarchy
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50),
        description TEXT,
        parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for parent lookup
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
    `);

    // Create businesses table with lat/lng for geolocation
    await client.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        state VARCHAR(3) NOT NULL,
        city VARCHAR(100),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_state ON businesses(state);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_state_category ON businesses(state, category_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
