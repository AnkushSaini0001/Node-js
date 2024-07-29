const express = require("express");
const { SignUp, login } = require("../controllers/loginController");

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", login);

module.exports = router;
