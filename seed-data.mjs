import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Insert categories
const categories = [
  { name: 'Luxury Watches', slug: 'luxury-watches', description: 'Premium timepieces for the discerning collector' },
  { name: 'Fine Jewelry', slug: 'fine-jewelry', description: 'Exquisite jewelry crafted with precision' },
  { name: 'Accessories', slug: 'accessories', description: 'Elegant accessories to complete your style' },
];

for (const cat of categories) {
  await connection.execute(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [cat.name, cat.slug, cat.description]
  );
}

// Get category IDs
const [categoryRows] = await connection.execute('SELECT id, slug FROM categories');
const categoryMap = {};
categoryRows.forEach(row => {
  categoryMap[row.slug] = row.id;
});

// Insert products
const products = [
  {
    categoryId: categoryMap['luxury-watches'],
    name: 'Midnight Chronograph',
    description: 'A sophisticated automatic chronograph with Swiss precision engineering',
    price: 2450.00,
    stock: 8,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop'
  },
  {
    categoryId: categoryMap['fine-jewelry'],
    name: 'Diamond Elegance Ring',
    description: 'Handcrafted 18K gold ring featuring a 2.5 carat diamond',
    price: 8900.00,
    stock: 5,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop'
  },
  {
    categoryId: categoryMap['luxury-watches'],
    name: 'Pearl Dive Watch',
    description: 'Water-resistant to 300m with mother-of-pearl dial',
    price: 3200.00,
    stock: 6,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop'
  },
  {
    categoryId: categoryMap['accessories'],
    name: 'Silk Scarf Collection',
    description: 'Premium Italian silk scarves with artistic patterns',
    price: 385.00,
    stock: 15,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1547949003-eb76f4a4d241?w=500&h=500&fit=crop'
  },
  {
    categoryId: categoryMap['fine-jewelry'],
    name: 'Pearl Necklace',
    description: 'Strand of South Sea pearls with 14K white gold clasp',
    price: 5600.00,
    stock: 4,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop'
  }
];

for (const prod of products) {
  await connection.execute(
    'INSERT INTO products (categoryId, name, description, price, stock, featured, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [prod.categoryId, prod.name, prod.description, prod.price.toString(), prod.stock, prod.featured, prod.imageUrl]
  );
}

console.log('✅ Database seeded with 3 categories and 5 products');
await connection.end();
