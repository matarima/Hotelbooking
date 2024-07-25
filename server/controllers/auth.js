const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "3c3fc1b1e539065c81d4febfb47a6eaf6f7e2a381d6b5e5d4f0848e8c91a5606a537272a6f1b567c744d6b4ba1c2e7ab6de200fb2db6a5e2bdb5fc0eb3456d0b";

exports.registerUser = function (req, res) {
  const { username, password, fullName, phoneNumber, email } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Hash password failed" });
        }

        const newUser = new User({
          username: username,
          password: hashedPassword,
          fullName: fullName,
          phoneNumber: phoneNumber,
          email: email,
        });

        newUser
          .save()
          .then(() =>
            res.status(201).json({ message: "User registered successfully" })
          )
          .catch((error) =>
            res.status(500).json({ message: "Server Error", error })
          );
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error", err });
    });
};

exports.loginUser = function (req, res) {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare hashed passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Comparison error" });
        }

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({ token });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error", err });
    });
};

exports.findUser = function (req, res) {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error", err });
    });
};

exports.logoutUser = function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(400).send("Unable to log out");
    }
    res.send("Logout successful");
  });
};

exports.loginAdmin = function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  User.findOne({ username: username })
    .then((user) => {
      if (!user || !user.isAdmin) {
        return res
          .status(400)
          .json({ message: "Invalid credentials or not an Admin" });
      }

      // Compare hashed passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Comparison error" });
        }

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({ token });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error", err });
    });
};

exports.logoutAdmin = function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.checkSession = function (req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, not an admin" });
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

exports.adminAuth = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, not an admin" });
  }
};
