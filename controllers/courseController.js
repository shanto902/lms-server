const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");
let courseCollection;

let paymentCollection;

async function setCourseCollection(client) {
  const courseDB = client.db("courseDB");
  courseCollection = courseDB.collection("courseCollection");
}

const addCourse = async (req, res) => {
  const courseData = req.body;
  const result = await courseCollection.insertOne(courseData);
  res.send(result);
};

const getAllCourses = async (req, res) => {
  const courses = courseCollection.find();
  const result = await courses.toArray();
  res.send(result);
};

const getCourseById = async (req, res) => {
  const id = req.params.id;
  const courseData = await courseCollection.findOne({ _id: new ObjectId(id) });
  res.send(courseData);
};

const getEnrolledCourses = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);

    const client = await connectDB();
    const paymentDB = client.db("paymentDB");
    const paymentCollection = paymentDB.collection("paymentCollection");
    const courseDB = client.db("courseDB");
    const courseCollection = courseDB.collection("courseCollection");

    const paidCourses = await paymentCollection
      .find({ email: email })
      .toArray();

    const enrolledCourses = [];

    for (const paidCourse of paidCourses) {
      const courseId = paidCourse.courseId;

      const courseData = await courseCollection.findOne({
        _id: new ObjectId(courseId),
      });

      if (courseData) {
        enrolledCourses.push(courseData);
      }
    }

    res.json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).send("An error occurred while fetching enrolled courses");
  }
};

const getCoursesByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const courses = await courseCollection
      .find({ ownerEmail: email })
      .toArray();
    res.send(courses);
  } catch (error) {
    console.error("Error fetching courses by email:", error);
    res.status(500).send("An error occurred while fetching courses");
  }
};

const updateCourse = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await courseCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );
  res.send(result);
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;
  const result = await courseCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};

module.exports = {
  setCourseCollection,
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  getCoursesByEmail,
  deleteCourse,
  getEnrolledCourses,
  courseCollection,
};
