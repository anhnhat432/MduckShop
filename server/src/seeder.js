require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const products = require("./data/products");

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});

    const insertedProducts = await Product.insertMany(products);

    console.log(`${insertedProducts.length} products inserted successfully`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed products:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedProducts();
