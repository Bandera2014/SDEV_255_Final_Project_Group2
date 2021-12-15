 // set up node module requirements
 const express = require('express');
 const bcrypt = require('bcryptjs');
 const session = require('express-session');
 const MongoDBSession = require('connect-mongodb-session')(session);
 const mongoose = require('mongoose');
 const UserModel = require('./models/User');
 const CourseModel = require('./models/Course');
 const mongoURI = 'mongodb+srv://GeeksInSneaks:SDEV255@cluster0.a4h2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
 
 // Connect to database
 mongoose.connect(mongoURI);
 
// create sessions database
const store = new MongoDBSession({
  uri: mongoURI,
  collection: 'mySessions',
})
  
// express app (sets "app" to be used with express)
const app = express(); 

//register view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));

// session stuff
app.use(
  session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: false,
  store: store,
}))
 
// listen for requests
app.listen(3000);
 
// middleware & static files
app.use(express.static('public'));
  const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
      next()
    } else {
      console.log('not authenticated')
      res.redirect('/login');
    }
}
 
// Login routes
app.get('/login',(req,res) => {
  res.render('login', { title: 'Login' }); // creates variable title = Login
});
app.get('/',(req,res) => {
  res.redirect('/login')
});
app.post('/login' , async (req,res) => {
  // saver user input to variables
  const { email, password } = req.body;
  // search for email and see if its in the DB
  const user = await UserModel.findOne({email});
  if(!user) {
    console.log('email doesnt exsist in database')
    return res.redirect('/login')
  }
  // compare user password with database pass
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    console.log('incorrect password')
    return res.redirect('/login');
  }
  // sets user authentication to true
  req.session.isAuth = true;
  req.session.userid = user.id;
  console.log('logged in')
  res.redirect('/home')
})
 
// Catalog routes
app.get('/catalog', isAuth, async (req,res) => {
  const courses = await CourseModel.find()
  const user = await UserModel.findById(req.session.userid)
  .populate('courses')
  console.log(user.courses)
  res.render('catalog', { title: 'Catalog', user, courses });
});
 
// function to search for "home" as an ejs type
app.get('/home', isAuth, async (req,res) => {
  const courses = await CourseModel.find()
  const user = await UserModel.findById(req.session.userid)
  .populate('courses')
  console.log(user.courses)
  user.save()
    res.render('home', { title: 'Welcome', user, courses }); // creates variable title = Home
});

// register routes
app.get('/register', (req,res) => {
  res.render('register', { title: 'Register for an Account' }); // creates variable title = Register
});
app.post('/register', async (req, res) => {
  console.log("post register")
  // save form to var
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var options = req.body.classification;
  // check to see email already exsists
  let user = await UserModel.findOne({email});
  if (user) {
    console.log("email already exsists");
    return res.redirect('/register');
  }
  //password encrypt
  const hashedPsw = await bcrypt.hash (password, 12);
  // save vars to schema
  user = new UserModel ({firstName, lastName, email, password: hashedPsw, options});
  await user.save();
  res.redirect('/login')
})
// Logout button
app.post('/logout', (req,res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect('/');
  })
})
// Add course route
app.get('/add', isAuth, async (req,res) => {
  const courses = await CourseModel.find()
  const user = await UserModel.findById(req.session.userid)
  res.render('add', { title: 'Add Course', user, courses });
});
app.post('/add', async (req, res) => {
  // save form to var
  var title = req.body.title;
  var teacher = req.body.teacher;
  var description = req.body.description;
  var subject = req.body.subject;
  var credits = req.body.credits;
  // save vars to schema
  course = new CourseModel ({title, teacher, description, subject, credits});
  await course.save();
  res.redirect('/add')
})

app.post('/:id', async(req,res) => {
  var addedcourse = req.body.coursebtn
  const courses = await CourseModel.find()
  await UserModel.update (
    { _id: req.session.userid }, 
    { $addToSet: { courses: addedcourse } }
  )
  res.redirect('/home')
});

app.post('/del/:id', async(req,res) => {
  var deletecourse = req.body.deletebtn
  await CourseModel.deleteOne ({ _id: deletecourse })
  res.redirect('/add')
});

app.get("/unenroll/:id", async(req,res) => {
  console.log("unenrolling")
  const user = await UserModel.findById(req.session.userid)
  const course = await CourseModel.findById(req.params.id)
  user.courses.remove(course)
  await user.save()
  console.log(user.courses)

  res.redirect('/home')
})

app.get("/courseDelete/:id", async(req, res) => {
  console.log("began delete process")
  await CourseModel.findByIdAndDelete(req.params.id)
    .then(result => {
      res.redirect('/home')
    })
    .catch(err => {
      console.log(err);
    });
});

app.use((req,res) => {
    res.status(404).render('404', { title: '404' });// creates variable title = 404
  });