const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// for unique ids
let adminCounter = 0;
let userCounter = 0;

//Authentication
const secretKey = process.env.SECRET_KEY;
const generatejwt = (admin) => {
  const payload = { username: admin.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const authenticatejwt = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (authheader) {
    const token = authheader.split(" ")[1];
    jwt.verify(token, secretKey, (err, admin) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes

app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const newAdmin = { ...req.body, id: adminCounter++ };

  const foundAdmin = ADMINS.find(
    (admin) => admin.username === username && password === admin.password
  );
  if (foundAdmin) res.send({ message: "admin already exists" });
  else {
    const token = generatejwt(newAdmin);
    ADMINS.push(newAdmin);
    res.send({ message: "admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find(
    (admin) => username === admin.username && password === admin.password
  );

  if (foundAdmin) {
    const token = generatejwt(foundAdmin);
    res.send({ message: "LoggedIn successfully", token });
  } else {
    res.status(403).send({ message: "Admin authentiacation failed" });
  }
});

app.post("/admin/courses", authenticatejwt, (req, res) => {
  // logic to create a course

  const newcourse = { ...req.body, id: Date.now() };
  COURSES.push(newcourse);
  res.send({ message: "course created successfully", courseId: newcourse.id });
});

app.put("/admin/courses/:courseId", authenticatejwt, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  const course = req.body;
  const foundCourse = COURSES.find((course) => id === course.id);
  if (foundCourse) {
    Object.assign(foundCourse, course);

    res.send({ message: "Course updated successfully" });
  } else {
    res.status(404).send({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticatejwt, (req, res) => {
  // logic to get all courses
  res.send({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
