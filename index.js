const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4040;

var cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("abc server on!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bmhisx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const users = client.db("abc_LC").collection("users");
    const courses = client.db("abc_LC").collection("abc");
    const selected_course = client.db("abc_LC").collection("selected_course");

    //users
    app.get("/users", async (req, res) => {
      const cursor = users.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const usersData = req.body;
      const query = { email: usersData.email };
      const existingUser = await users.findOne(query);

      if (existingUser) {
        res.send("user already exists");
      } else {
        const resp = await users.insertOne(usersData);
        res.send(resp);
      }
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: id };
      const result = await users.findOne(query);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { email: id };

      const result = await users.updateOne(filter, { $set: updatedUser });
      res.send(result);
    });

    //courses
    app.get("/courses", async (req, res) => {
      const cursor = courses.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/courses", (req, res) => {
      const coursesData = req.body;
      const resp = courses.insertOne(coursesData);
      res.send(resp);
    });

    // course data by id

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await courses.findOne(query);

      res.send(result);
    });

    //selected_course
    app.post("/selected_course", async (req, res) => {
      const selected_course_Data = req.body;
      const query = { course_uid: selected_course_Data.course_uid };
      const existingUser = await selected_course.findOne(query);

      if (existingUser) {
        res.send("course already exists");
      } else {
        const resp = await selected_course.insertOne(selected_course_Data);
        res.send(resp);
      }
    });

    app.get("/selected_course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { my_email: id };
      const results = await selected_course.find(query).toArray();
      res.send(results);
    });

    app.delete("/selected_course/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await selected_course.deleteOne(query);
      res.send(result);
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//ports.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
