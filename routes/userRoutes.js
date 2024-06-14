const express = require("express");
const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserByEmail,
} = require("../controllers/userController");

const router = express.Router();

router.post("/user", createUser);
router.get("/user/get/:id", getUserById);
router.get("/user/:email", getUserByEmail);
router.patch("/user/:email", updateUserByEmail);

module.exports = router;
