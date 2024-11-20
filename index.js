const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./mockData.json");
const fs = require("fs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Db connection
mongoose
  .connect(
    "mongodb+srv://farhandazzler1999:78nM0wfkvwSjxBWj@cluster0.eb9l4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB ERR", err));
app.use((req, res, next) => {
  console.log("Middleware started");
  next();
});
//schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
});
const User = new mongoose.model("user", userSchema);
//creating a log file
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.method}:${req.path}`,
    (err, data) => {
      next();
    }
  );
}),
  app.get("/", function (req, res) {
    res.setHeader("X-MyName", "Mohammad Farhan");
    res.send("Hello World");

    //   res.return("Port is running");
  });

app.get("/api/users", (req, res) => {
  return res.json(users);
});
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.firstName}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/users/api/:id", (req, res) => {
  const userID = users.find((user) => Number(req.params.id) === user.id);
  return res.json(userID);
});
app.get("/users/:id", (req, res) => {
  const userID = users.find((user) => Number(req.params.id) === user.id);
  const html = `
    <ul>
     <li>First Name: ${userID.firstName}</li>
     <li>Last Name : ${userID.lastName}</li>
     <li>Age : ${userID.age}</li>
     <li>Phone Number : ${userID.phone}</li>
    </ul>
    `;
  return res.send(html);
  //   return res.json(userID);
});
app.post("/users", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    //   users.push({ ...body, id: users.length + 1 });
    //   fs.writeFile("./mockData.json", JSON.stringify(users), (err, data) => {
    //     return res
    //       .json({ status: "success", id: users.length })
    //       .catch((err) => console.log("Err", err));
    //   });

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      gender: body.gender,
      email: body.email,
    });
    console.log(user);
    return res.status(201).json({ msg: "success" });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is connected and running at PORT:${PORT}`);
});
