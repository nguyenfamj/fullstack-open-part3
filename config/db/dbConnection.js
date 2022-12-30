const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@phonebook.vpiohgj.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = () =>
  mongoose
    .connect(mongoUri)
    .then((result) => {
      console.log('MongoDB cluster connected successfully');
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });

module.exports = { connectDB };
