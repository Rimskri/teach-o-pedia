const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connecting to mongoDB Atlas through mongoose

mongoose.connect("mongodb+srv://abhishek8621:Abhishek1234@cluster1.hbohest.mongodb.net/userDB", { useNewUrlParser: true });


// Connecting to mongoDB server (local) through mongoose

// mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = {
  profile: String,
  email: String,
  password: String,
  name: String,
  mobile: Number,
  subject: String,
  class: Number,
  school: String,
  board: String,
  classesTaken: Array,
  address: String,
  day: Array,
  schedule: Array,
  booking: Array
};

const User = new mongoose.model("User", userSchema);

let today = date.getNumericTodayDate();
let future = date.getNumericFutureDate();
let tomorrow = date.getNumericTomoDate();
let stsCode = "";
let loginErrorCode = "";

app.get("/", (req, res) => {
  res.render("signin", {});
});

app.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      const err_message = "Email id already exists";
      res.render("signin", { message: err_message });
    } else {
      const newUser = new User({
        profile: req.body.type,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        mobile: req.body.mobile,
        subject: req.body.subject,
        class: req.body.class,
      });
      newUser.save((err) => {
        if (err) {
          console.log(err);
        } else {
          if (newUser.profile === "Teacher") {
            User.find({profile: "Student"}, (err , users) => {
              // console.log(users);
              let bookingArray = newUser.schedule;
              let sortedBookingArray = ()=> {
                let emptyArray = [];
                for (item of bookingArray){
                  if(item.date === today){
                    emptyArray.push(item);
                  }
                }
                return emptyArray;
              }
              res.render("dashboard-t", { user: newUser , usersList : users, today: today , bookingArray: sortedBookingArray() });
            });
          } else {
            User.find({profile: "Teacher"}, (err , users) => {
              res.render("dashboard-s", { user: newUser , usersList : users , stsCode: stsCode });
            });
          }
        }
      });
    }
  });
});

app.get("/dashboard/:profileType/:id", (req, res) => {
  const profileType = req.params.profileType;
  const id = req.params.id;
  User.findOne({_id: id}, function(err, user){
    if(profileType === "Teacher"){
      User.find({profile: "Student"}, (err , users) => {
        // console.log(users);
        let bookingArray = user.schedule;
        let sortedBookingArray = ()=> {
          let emptyArray = [];
          for (item of bookingArray){
            if(item.date === today){
              emptyArray.push(item);
            }
          }
          return emptyArray;
        }
        res.render("dashboard-t", { user: user , usersList : users, today: today , bookingArray: sortedBookingArray() });
      });
    } else {
      User.find({profile: "Teacher"}, (err , users) => {
        // console.log(users);
        stsCode = "";
        res.render("dashboard-s", { user: user , usersList : users , stsCode: stsCode});
      });
    }
  })

});


app.get("/login", (req, res) => {
  res.render("login" , { errorCode: loginErrorCode });
});

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email: userName }, (err, foundUser) => {
    if (!foundUser) {
      loginErrorCode = '404';
      res.redirect('/login');
      // console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          if (foundUser.profile === "Teacher") {
            User.find({profile: "Student"}, (err , users) => {
              // console.log(users);
              let bookingArray = foundUser.schedule;
              let sortedBookingArray = ()=> {
                let emptyArray = [];
                for (item of bookingArray){
                  if(item.date === today){
                    emptyArray.push(item);
                  }
                }
                return emptyArray;
              }
              // console.log(sortedBookingArray());
              res.render("dashboard-t", { user: foundUser , usersList : users, today: today , bookingArray: sortedBookingArray() });
            });
          } else {
            User.find({profile: "Teacher"}, (err , users) => {
              res.render("dashboard-s", { user: foundUser , usersList : users , stsCode: stsCode});
            })
          }
        } else {
          loginErrorCode = '404';
          res.redirect('/login');
        }
      }
    }
  });
});

app.get("/profile/:profileType/:id", (req, res) => {
  const profileType = req.params.profileType;
  const id = req.params.id;
  User.findOne({_id: id}, function(err, user){
    if(profileType === "Teacher"){
      res.render("profile-t", { user: user });
    } else {
      res.render("profile-s" , { user: user });
    }
  })

});

app.post("/updateTeacher", (req, res) => {
  const query = { email: req.body.email };
  const newValues = {$set:   {
    name: req.body.name,
    mobile: req.body.mobile,
    subject: req.body.specialize,
    classesTaken: req.body.class,
    address: req.body.address,
    day: req.body.day,
    time: {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    }
  } } ;
  User.updateOne(
    query, newValues,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    }
  );
});

app.post("/updateStudent", (req, res) => {
  const query = { email: req.body.email };
  const newValues = {$set:   {
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.address,
    school: req.body.school,
    class: req.body.class,
    board: req.body.board
  } } ;
  User.updateOne(
    query, newValues,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    }
  );
});

app.get("/profile-pop/s/:sid/t/:tid", (req, res) => {
  const s_id = req.params.sid;
  const t_id = req.params.tid;
  User.findOne({_id: t_id}, function(err, teacher){
    User.findOne({_id: s_id}, function(err, student){
      // console.log(teacher , student);
      res.render("profile-popper" , { user: student , item: teacher , userList: User , tomorrow: tomorrow, future: future});
    })
  })

});

app.get("/booking/:profileType/:id", (req, res) => {
  const profileType = req.params.profileType;
  const id = req.params.id;
  User.findOne({_id: id}, function(err, user){
    if(profileType === "Teacher"){
      User.find({profile: "Student"}, (err , users) => {
        // console.log(users);
        res.render("dashboard-t", { user: user , usersList : users });
      });
    } else {
      User.find({profile: "Teacher"}, (err , users) => {
        // console.log(users);
        let bookingArray = user.booking;
        let sortedBookingArray = ()=> {
          let emptyArray = [];
          let currentDay = new Date();
          for (item of bookingArray){
            let itemDay = new Date(item.date);
            if(itemDay > currentDay || item.date === today){
              emptyArray.push(item);
            }
          }
          return emptyArray;
        }
        // console.log(sortedBookingArray());
        res.render("bookings", { user: user , usersList : users , today: today , bookingArray: sortedBookingArray()});
      });
    }
  })

});

app.post("/booknow" , (req , res) => {
  const st_id = req.body.studentId;
  const te_id = req.body.teacherId;
  const te_email = req.body.teacherEmail;
  const st_email = req.body.studentEmail;
  const book_date = req.body.date;
  User.findOneAndUpdate({_id: te_id}, {$push: { schedule: { date: book_date, userId: st_id, email: st_email } }}, (err, teacher) => {
    if (!err) {
      User.findOneAndUpdate({_id: st_id}, {$push: { booking: { date: book_date, userId: te_id, email: te_email } }}, (err, student) => {
        if(!err) {
          User.find({profile: "Teacher"}, (err , users) => {
            stsCode = "200";
            res.render("dashboard-s", { user: student , usersList : users , stsCode: stsCode });
          })
        }
      })
    }
  })
})


app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running fine");
});
