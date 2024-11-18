const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./mockData.json");
const fs = require("fs");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: false }));
//Db connection
mongoose
  .connect(
    "mongodb+srv://farhandazzler1999:DHaqzXC3KP7aw0LC@backenddb.aw3vz5r.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB err", err));
app.use((req, res, next) => {
  console.log("Middleware started");
});

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
app.post("/users", (req, res) => {
  const body = req.body;
  console.log(body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./mockData.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`Server is connected and running at PORT:${PORT}`);
});
