const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// The static function in express is used to allow the
// server to serve local or static files such as css
// or images, etc.

// Here the folder name given inside the () will be used as
// the static folder.
app.use(express.static("public"));

// Below is an alternative that can be used to
// access static files like css, images, etc.
// app.use(express.static(__dirname));

app.post("/", function (req, res) {
  // let firstName = req.body.firstName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  if(firstName == ""){
    // window.alert("Please enter your first name.");
    res.sendFile(__dirname + "/failure.html");
  }
  else if(lastName == ""){
    // window.alert("Please enter your last name.");
    res.sendFile(__dirname + "/failure.html");
  }
  else if(email == ""){
    // window.alert("Please enter your email.")
    res.sendFile(__dirname + "/failure.html");
  }

  // console.log(firstName + "\n" + lastName + "\n" + email);
  // res.sendFile(__dirname + '/signup.html');

  const data = {
    members: [
      {
        email_address : email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

  app.post('/success', function (req, res) {
    res.redirect("/");
  });
  
  app.post('/failure', function (req, res) {
    res.redirect("/");
  });

  const url = "https://us17.api.mailchimp.com/3.0/lists/f6366de5af";

  const options = {
    method: "POST",
    auth: "jensen:4a9070fb6f478b46f208e4f9a92a9b00-us17"
  }

  const jsonData = JSON.stringify(data);

  // https.request(url, options, function(response) {

  // })

  const request = https.request(url, options, function(response) {
    response.on("data", function(data){
      console.log(JSON.parse(data));
      if(response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.send("Fail");
      }
    })
  })

  request.write(jsonData);
  request.end();

  
});




app.listen(3000, function () {
  console.log("Server running on port 3000");
});

// const client = require("@mailchimp/mailchimp_marketing");

// client.setConfig({
//   apiKey: "4a9070fb6f478b46f208e4f9a92a9b00-us17",
//   server: "localhost",
// });

// const client = require("@mailchimp/mailchimp_marketing");

// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });

// const run = async () => {
//   const response = await client.lists.batchListMembers("list_id", {
//     members: [{}],
//   });
//   console.log(response);
// };

// run();



// API Key
// 4a9070fb6f478b46f208e4f9a92a9b00-us17

// list/audience id
// f6366de5af