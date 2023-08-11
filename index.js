const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');
const app = express();


//declaring that we are using ejsS
app.set('view engine', 'ejs');

//where to look out for views
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

var contactList = [
  {
    name: "Arpan",
    phone: "11111111"
  },
  {
    name: "Arvind",
    phone: "11111011"
  },

]

//req is an object
//middleware 1
app.use(function(req,res,next){
   req.myName="Arpan";
   console.log('middleWare 1 called!!');
   next(); //to pass the control to the next middleware
});

//middleware 2
app.use(function(req,res,next){
  console.log('My Name from MW2', req.myName);
   //console.log('middleware 2 called');
   next();
});


app.get('/',function(req,res){    //signifies controllers

//     console.log(__dirname);
//     res.send('Cool,it is running !or is it? ');
// 

      Contact.find({}, function(err,contacts){
           if(err){
               console.log('Error in fetching contacts from db');
               return;

           }

          // console.log(req.myName);
       return res.render('home',{ 
        title: "My Contact List",
        contacts_List: contacts
      });   
      
    });

       
      
})



app.get('/practice', function(req,res){
      return res.render('practice',{
        title: "let us practice ejs"
      });
});


app.post('/create-contact',function(req,res){
  //return res.redirect('/practice')
   
  // console.log(req.body);
  // console.log(req.body.name);
  // console.log(req.body.phone);  

  

  // contactList.push(req.body);
  
  // for pushing into database using mongoDB
  Contact.create({
    name: req.body.name,
    phone: req.body.phone
  }, function(err, newContact){    //callback function
    if(err){console.log('error in creating a contact!');
    return;}

    console.log('********', newContact);
    return res.redirect('back');
  });

  //  return res.redirect('back');

});


 //for deleting a contact
app.get('/delete-contact/',function(req,res){ 
  //deleting from database using id
  //get the id from query in the url of home.ejs
  let id=req.query.id;
  
  //find the contact in the database using id and delete
  Contact.findByIdAndDelete(id ,  function(err){
     if(err){
         console.log('error in deleting an object from database');
         return;
     }

     //if no error occured
     return res.redirect('back');
  });


 
});



app.listen(port , function(err){
    if(err) { console.log('Error in running the server',err); }

    console.log('Yup! My express server is running on Port:',port);
});