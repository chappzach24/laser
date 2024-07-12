const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas URI
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Importing routes
const userRouter = require('./routes/user.routes');
const productRouter = require('./routes/product.routes');
const cartRouter = require('./routes/cart.routes');

// Using routes
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
