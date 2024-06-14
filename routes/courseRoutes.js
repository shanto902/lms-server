const express = require("express");
const {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByEmail,
  getEnrolledCourses,
} = require("../controllers/courseController");
const verifyToken = require("../middleware/auth");
const verifyOwner = require("../middleware/verifyOwner");

const router = express.Router();

router.post("/add-course", verifyToken, addCourse);
router.get("/all-courses", getAllCourses);
router.get("/course/:id", verifyToken, getCourseById);
router.get("/my-courses/:email", verifyToken, getCoursesByEmail);
router.get("/enrolled-courses/:email", verifyToken, getEnrolledCourses);
router.patch("/course/:id/:email", verifyToken, verifyOwner, updateCourse);
router.delete("/course/:id/:email", verifyToken, verifyOwner, deleteCourse);

module.exports = router;
