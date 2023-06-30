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
    req.user = foundUser;
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
    purchasedCourses: [],
  };

  const alreadyUser = USERS.find((user) => user.username === username);

  if (!alreadyUser) {
    USERS.push(newUser);
    res.send({ message: "user created successfully" });
  } else {
    res.send({ message: "already a user" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.send({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  let publishedCourse = [];
  COURSES.map((course) => {
    if (course.published) publishedCourse.push(course);
  });

  res.send({ courses: publishedCourse });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);

  const coursefound = COURSES.find(
    (course) => course.id == id && course.published
  );

  if (coursefound) {
    req.user.purchasedCourses.push(id);
    res.send({ message: "Course purchased successfully" });
  } else {
    res.send({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((course) =>
    req.user.purchasedCourses.includes(course.id)
  );
  res.send({ purchasedCourses: purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
