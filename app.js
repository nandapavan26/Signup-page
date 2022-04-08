const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const { response } = require('express');
 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
 
mailchimp.setConfig({
  apiKey: "0bec630f6a0b6daa0c0d7f50e0730376-us14",
  server: "us14"
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post('/', async (req, res) => {
    const firstName = req.body.fname
    const lastName = req.body.lname
    const emailAddress = req.body.email
 
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
 
    const response = await mailchimp.lists.batchListMembers('474e4647c5', data)
 
    // res.send('Data received')

    console.log(response);


    if(response.errors.length>0)
    {
        res.redirect("/");
    }
    else{
        if(response.new_members[0].status==="subscribed")
        {
            res.send("sucess!");
        }
        else
        {
            res.send("failure");
        }
    }
})
 
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000")
});

//API KEY
//0bec630f6a0b6daa0c0d7f50e0730376-us14

// list-id
// 474e4647c5
