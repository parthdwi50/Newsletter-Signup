const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

app.post("/", function(req, res) {


  const listId = process.env.LIST_ID;


  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email
  };

  const run = async () => {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html");

  } catch (err) {
    console.log(err.status);
    res.sendFile(__dirname + "/faliure.html");
  }


};

run();

});

app.post("/faliure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000!");
});
