const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
const axios = require("axios");
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/posts", async (req, res) => {
  //Generating a 4bytes random id to assign to the post
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  //Event schema: Type(of the event) & Data
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.status(203).send(posts[id]);
});
app.post("/events", (req, res) => {
  console.log("Received Event of type:", req.body.type);
  res.send({});
});
app.listen(4000, () => {
  console.log("v2");
  console.log("Listening on port 4000...");
});
