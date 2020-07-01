// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

var bodyparser = require('body-parser');


// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/public"); 

app.use(bodyparser.urlencoded({
   extended: false 
  }))
// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================
app.get('/', function(request, response){
  console.log('user wants to see the index page ... so a request was made');
  response.sendFile(__dirname + '/public/home.html');
});

app.get('/survey', function(request, response){
  console.log('user wants to see the survey page ... so a request was made on /survey.');
  response.sendFile(__dirname + '/public/testsurvey.html');
});

app.post('/surveyresponse', function(req,res){
  console.log('user hit the submit button on the survey. we will now send them the json data.');
  
  console.log("this is what you entered for your name: " + req.body.yourName);
  
  var fullname = req.body.yourName;

  var q1 = Number(req.body.question1);
  var q2 = Number(req.body.question2);
  var q3 = Number(req.body.question3);
  var q4 = Number(req.body.question4);
  var q5 = Number(req.body.question5);
  var q6 = Number(req.body.question6);
  var q7 = Number(req.body.question7);
  var q8 = Number(req.body.question8);
  var q9 = Number(req.body.question9);
  var q10 = Number(req.body.question10);
  
  var formObject = {
    name: fullname,
   questions: [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10]
 };

 console.log(formObject.name);

 var textdb = fs.readFileSync('db.json', 'utf8');
 console.log('read thefile');
 console.log(textdb);

 var freshjson = JSON.parse(textdb);

 console.log('parsed the file into json' + typeof freshjson)

var allnumbers = [];
var added = [];

var currentnumbers = formObject.questions;

for (var i = 0; i < freshjson.length; i++ ){
  allnumbers.push(freshjson[i].questions);
}

console.log('total amount of array numbers  ' + allnumbers);
console.log('allnumbers length:  ' + allnumbers.length);



for (var counter = 0; counter < allnumbers.length; counter++){
 var x = currentnumbers.map(function(item, index) {
  // In this case item correspond to currentValue of array a,
  // using index to get value from array b
  return item - allnumbers[counter][index];
})

console.log('the array result '+ Math.abs(x.reduce((a,b)=> a +b, 0)));
added.push(Math.abs(x.reduce((a,b)=> a+b, 0)));
}

Array.min = function(added){
  return Math.min.apply(Math, added);
};

var minimum = Array.min(added);
console.log(minimum);
console.log('index: ' + added.indexOf(minimum));
var friend = added.indexOf(minimum);
console.log('your best friend: ' + freshjson[friend].name );
var bestFriend = freshjson[friend].name;
 freshjson.push(formObject);
console.log('pushed to the new array');
console.log(freshjson);
//using the fs module to save the object we made above into a txt file which will act as a makeshift database.

var restring = JSON.stringify(freshjson);
//
fs.writeFile('db.json', restring, function(err){
  if(err) throw err;
   console.log('restring was saved to db.json.');
 });
 console.log('appended array to json file');

//send the best friend name to the front end for the user to see
res.render(__dirname + '/public/index.ejs', {user: bestFriend});

});

app.get('/api', function(request, response){

  console.log('api route was hit');

  var textdb = fs.readFileSync('db.json', 'utf8');

  var freshjson = JSON.parse(textdb);
  response.send(freshjson);

});



require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
