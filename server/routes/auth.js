const express = require("express");
const {registerUser, loginUser, logoutUser,loginAdmin,logoutAdmin ,authenticateToken, adminAuth, findUser} = require("../controllers/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/loginAdmin", loginAdmin);
router.post("/logoutAdmin", logoutAdmin);

router.use(authenticateToken);
router.get("/user", authenticateToken, findUser);
router.get('/protected-route', (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.use(adminAuth);
router.get('/admin-route', (req, res) => {
  res.json({ message: "This is an admin route", user: req.user });
});

module.exports = router;