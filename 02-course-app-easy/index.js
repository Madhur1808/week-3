const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());

let ADMINS = [
  {
    id: 0,
    username: "admin0",
    password: "pass0",
  },
  {
    id: 1,
    username: "admin1",
    password: "pass1",
  },
];
let USERS = [];
let COURSES = [
  {
    id: 0,
    title: "course1",
    description: "this is course1",
    imageLink: "this is a image",
    price: "100",
    published: "true",
  },
  {
    id: 1,
    title: "course2",
    description: "this is course2",
    imageLink: "this is a image2",
    price: "102",
    published: "true",
  },
];
let counter = 0;
let counter2 = 2;
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const newAdmin = {
    id: counter++,
    username,
    password,
  };
  ADMINS.push(newAdmin);
  res.send({ message: "admin created successfully" });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  // console.log(username, password);
  const found = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (!found) {
    res.status(404).send("Invalid credentials");
  } else {
    res.send("logged in successfully");
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const { title, description, price, imageLink, published } = req.body;

  const newCourse = {
    id: counter2++,
    title,
    description,
    price,
    imageLink,
    published,
  };

  const found = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  if (found) {
    COURSES.push(newCourse);
    res.send({
      message: "course created successfully",
      courseId: newCourse.id,
    });
  } else {
    res.status(404).send("you are not admin");
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  console.log(id);
  const { username, password } = req.headers;
  const { title, description, price, imageLink, published } = req.body;
  const foundCourse = COURSES.findIndex((course) => course.id === id);
  if (foundCourse !== -1) {
    COURSES[foundCourse].description = description;
    COURSES[foundCourse].title = title;
    COURSES[foundCourse].price = price;
    COURSES[foundCourse].imageLink = imageLink;
    COURSES[foundCourse].published = published;

    res.send({ message: "course updated successfully" });
  } else {
    res.status(404).send("course not found");
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;

  const foundAdmin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (foundAdmin) {
    res.send({ courses: COURSES });
  } else {
    res.status(404).send("not a admin");
  }
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
