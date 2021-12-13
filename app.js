 // set up node module requirements
const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const UserModel = require('./models/User');
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


 // function to search for "index" as an ejs type
 app.get('/',(req,res) => {
   res.render('index', { title: 'Login' }); // creates variable title = Login
});

 // function to search for "catalog" as an ejs type
 app.get('/catalog',(req,res) => {
   res.render('catalog', { title: 'Catalog' }); // creates variable title = Catalog
});

// function to search for "home" as an ejs type
app.get('/home',(req,res) => {
   res.render('index', { title: 'Welcome' }); // creates variable title = Home
});

 // function to search for "Register" as an ejs type
 app.get('/register',(req,res) => {
  res.render('register', { title: 'Register for an Account' }); // creates variable title = Register
});
app.post('/register', async (req, res) => {
    console.log("post register")
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var options = req.body.classification;
    
    let user = await UserModel.findOne({email});
    console.log("user findone")
    if (user) {
      console.log("in the conditional")
      return res.redirect('/register');
    }
    user = new UserModel({
      firstName,
      lastName,
      email,
      password,
      options
    });
    console.log(user._id)
    await user.save();
    console.log("below save")
    res.redirect('/')
})
app.post('/login',async(req,res)=>{
  console.log("begin login route")
  var em = req.body.email;
  var pw = req.body.password;
  var opt = req.body.classification;
  console.log(req.body.classification)
  
  
  let user = await UserModel.findOne({
    firstName:"larry",                    //Need to hard code 
    lastName:"boy",                       //Need to hard code
    email:req.body.email,
    password:req.body.password,
    options:req.body.classification,
  });
  // let user = await UserModel.findById("61b69fc07ec0f6b83288e906")
  console.log(user)
  
  if (user){
    console.log(user.firstName)
    return res.render('home', { user: user, title: 'Home Page'})
  }
  res.redirect('/login')
  console.log("end of login")

})

 // route any other sites here


 /* keep this file on bottom
 if site cannot find any of the above 
 then default to this 404 page.
 Also sets the error status to 404*/
 app.use((req,res) => {
    res.status(404).render('404', { title: '404' });// creates variable title = 404
  });