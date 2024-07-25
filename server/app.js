const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require('morgan');

const authRoutes = require("./routes/auth");
const homepageRoute = require('./routes/hotel');
const transactionRoute = require('./routes/transaction');
const adminRoute = require('./routes/admin');

const app = express();
const PORT = 5000;

// Middleware CORS
const corsOptions = {
  origin:  ['http://localhost:3000', 'http://localhost:3001'], // Đây là URL của frontend
  credentials: true
};
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors(corsOptions));


app.use(session({
  secret: 'admin',  // Thay 'your-secret-key' bằng một khóa bí mật của bạn
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Thiết lập false để dùng HTTP (không phải HTTPS)
}));

app.use("/api/auth", authRoutes);
app.use('/api', homepageRoute);
app.use('/api', transactionRoute);
app.use('/api/admin', adminRoute);


mongoose
  .connect(
    "mongodb+srv://thinhmx:admin@cluster0.eksxo77.mongodb.net/hotel?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT);
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});
