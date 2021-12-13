 // set up node module requirements
const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const mongoURI = 'mongodb+srv://admin:pass1234@finalproject.hdvyl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

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
  User.find()
    .then((result) => {
      res.render('home', { title: 'Welcome', User: result });
    })
    .catch((err) => {
      console.log(err);
    })
  });

 // function to search for "Register" as an ejs type
 app.get('/register',(req,res) => {
  res.render('register', { title: 'Register for an Account' }); // creates variable title = Register
});
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password} = req.body;
  let user = await UserModel.findOne({email});
  if (user) {
    return res.redirect('/register');
  }
user = new UserModel({
  firstName,
  lastName,
  email,
  password
});
await user.save();
res.redirect('/')
})

 // route any other sites here


 /* keep this file on bottom
 if site cannot find any of the above 
 then default to this 404 page.
 Also sets the error status to 404*/
 app.use((req,res) => {
    res.status(404).render('404', { title: '404' });// creates variable title = 404
  });