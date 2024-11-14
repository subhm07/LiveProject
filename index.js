const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./mockData.json");
app.get("/", function (req, res) {
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
  res.send(html);
  return res.json(userID);
});
app.listen(PORT, () => {
  console.log(`Server is connected and running at PORT:${PORT}`);
});
