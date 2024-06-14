const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
let userCollection;

async function setUserCollection(client) {
  const userDB = client.db("userDB");
  userCollection = userDB.collection("userCollection");
}

function createToken(user) {
  const token = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );
  return token;
}

const createUser = async (req, res) => {
  const user = req.body;
  const token = createToken(user);
  const isUserExist = await userCollection.findOne({ email: user?.email });
  if (isUserExist?._id) {
    return res.send({ status: "success", message: "Login success", token });
  }
  await userCollection.insertOne(user);
  res.send({ token });
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const result = await userCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};

const getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const result = await userCollection.findOne({ email });
  res.send(result);
};

const updateUserByEmail = async (req, res) => {
  const email = req.params.email;
  const userData = req.body;
  const result = await userCollection.updateOne(
    { email },
    { $set: userData },
    { upsert: true }
  );
  res.send(result);
};

module.exports = {
  setUserCollection,
  createUser,
  getUserById,
  getUserByEmail,
  updateUserByEmail,
};
