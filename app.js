 // set up node module requirements
 const express = require('express');
 const bcrypt = require('bcryptjs');
 const session = require('express-session');
 const MongoDBSession = require('connect-mongodb-session')(session);
 const mongoose = require('mongoose');
 const UserModel = require('./models/User');
 const CourseModel = require('./models/Course');
 // const CourseModel = require('./models/Course')
 // const CourseLoader = require('./models/LoadCourses')
 const mongoURI = 'mongodb+srv://GeeksInSneaks:SDEV255@cluster0.a4h2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
 
 // Connect to database
 mongoose.connect(mongoURI);
 
 // create sessions database
 const store = new MongoDBSession({
   uri: mongoURI,
   collection: 'mySessions',
 })
 
 // createCourse()
 
 
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
    const user = await UserModel.findById(req.session.userid)
    const courses = await CourseModel
    res.render('catalog', { title: 'Catalog', user, courses }); // creates variable title = Catalog
  });
 
// function to search for "home" as an ejs type
 app.get('/home', isAuth, async (req,res) => {
    const user = await UserModel.findById(req.session.userid)
    res.render('home', { title: 'Welcome', user }); // creates variable title = Home
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
  const user = await UserModel.findById(req.session.userid)
  res.render('add', { title: 'Add Course', user });
});
app.post('/add', async (req, res) => {
  // save form to var
  var title = req.body.title;
  var teacher = req.body.teacher;
  var description = req.body.description;
  // save vars to schema
  course = new CourseModel ({title, teacher, description});
  await course.save();
  res.redirect('/home')
})

  // route any other sites here

 
  /* keep this file on bottom
  if site cannot find any of the above 
  then default to this 404 page.
  Also sets the error status to 404*/
  app.use((req,res) => {
     res.status(404).render('404', { title: '404' });// creates variable title = 404
   });