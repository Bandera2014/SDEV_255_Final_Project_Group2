 // set up node module requirements
const express = require('express');

// express app (sets "app" to be used with express)
const app = express(); 

 //register view engine
 app.set('view engine', 'ejs');

 // listen for requests
 app.listen(3000);

 // function to search for "index" as an ejs type
 app.get('/',(req,res) => {
    res.render('index', { title: 'Login' }); // creates variable title = Login
 });

 // route any other sites here


 /* keep this file on bottom
 if site cannot find any of the above 
 then default to this 404 page.
 Also sets the error status to 404*/
 app.use((req,res) => {
    res.status(404).render('404', { title: '404' });// creates variable title = 404
  });