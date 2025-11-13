// This is a script to import or destroy sample data in MongoDB
// To run:
// node seeder.js -i   (to import data)
// node seeder.js -d   (to destroy data)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const { products } = require('./data/products.js');
const Product = require('./models/productModel.js');
const connectDB = require('./config/db.js');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear out old data first
    await Product.deleteMany();

    // Insert the new sample data
    await Product.insertMany(products);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all product data
    await Product.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit(1);
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check for command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-i') {
  importData();
} else {
  console.log(
    'Invalid command. Use -i to import data or -d to destroy data.'
  );
  process.exit(1);
}

