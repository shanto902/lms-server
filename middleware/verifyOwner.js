const connectDB = require("../config/db");

let courseCollection;

// Middleware to verify owner
async function verifyOwner(req, res, next) {
  const userEmail = req.params.email;

  // Ensure courseCollection is initialized
  if (!courseCollection) {
    try {
      const client = await connectDB(); // Connect to the database
      const courseDB = client.db("courseDB");
      courseCollection = courseDB.collection("courseCollection");
    } catch (err) {
      console.error("Failed to initialize database", err);
      return res.status(500).send("Failed to initialize database");
    }
  }

  try {
    const course = await courseCollection.findOne({ ownerEmail: userEmail });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    if (course.ownerEmail !== userEmail) {
      return res
        .status(403)
        .send("You are not authorized to perform this action");
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = verifyOwner;
