const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let purchasedCOURSES = [];
let adminCounter = 0;
let userCounter = 0;
let purchasedId = 0;

//middlewares for authentication
const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const foundAdmin = ADMINS.find(
    (admin) => username === admin.username && password === admin.password
  );

  if (foundAdmin) next();
  else res.send({ message: "Admin authentication failed" });
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const foundUser = USERS.find(
    (user) => username === user.username && password === user.password
  );

  if (foundUser) {
    req.user = userfound;
    next();
  } else {
    res.send({ message: "User authentication failed" });
  }
};
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const alreadyExists = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  const newAdmin = {
    id: adminCounter++,
    username,
    password,
  };
  if (!alreadyExists) {
    ADMINS.push(newAdmin);
    res.send({ message: "admin created successfully" });
  } else {
    res.status(403).send({ message: "Admin already exists" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.send({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course

  const course = req.body;

  const newCourse = { ...course, id: Date.now() };
  COURSES.push(newCourse);
  res.send({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  const updatedCourse = req.body;
  const foundCourse = COURSES.find((course) => course.id === id);
  if (foundCourse) {
    Object.assign(foundCourse, updatedCourse);
    res.send({ message: "course updated successfully" });
  } else {
    res.status(404).send("course not found");
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.send({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const newUser = {
    id: userCounter++,
    username,
    password,
  };
  USERS.push(newUser);
  res.send({ message: "user created successfully" });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;

  const foundUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (foundUser) res.send({ message: "Logged in successfully" });
  else res.status(404).send({ message: "user not found" });
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  const { username, password } = req.headers;
  const foundUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (foundUser) res.send({ courses: COURSES });
  else req.send({ message: "user not found" });
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const userfound = USERS.find(
    (user) => user.username === username && user.password === password
  );

  const coursefound = COURSES.find((course) => course.id == id);

  if (userfound && coursefound) {
    const coursePurchased = { ...coursefound, id: purchasedId++ };
    purchasedCOURSES.push(coursePurchased);
    res.send({ message: "Course purchased successfully" });
  }
  if (!coursefound) {
    res.send({ message: "no course found" });
  }
  if (!userfound) {
    res.send({ message: "no user found" });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;

  const userfound = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (userfound) res.send({ purchasedCourses: purchasedCOURSES });
  else res.send({ message: "User not found" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
