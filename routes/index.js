var express = require('express');
var router = express.Router();
var User = require('./users');
var passport = require('passport');
var passportLocal = require('passport-local');
var Message=require('./message');
passport.use(new passportLocal(User.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Friendly' });
});

router.get('/loginPage', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/aboutUs',function(req,res,next){
  res.render('aboutus',{title:'About'});
})

router.get('/contact',function(req,res,next){
  res.render('contact',{title:'Contact'});
})
router.get('/profile', isLoggedIn,function(req,res,next){
  User.findOne({username: req.session.passport.user})
  .then(function(u){
    if(!u)
    {
      // console.log('hello here in profile')
     res.redirect('/');
    }
    else{
      // console.log(u);
      res.render('profile',{title:'profile |'+req.session.passport.user,username:req.session.passport.user,user:u});
    }
  })
 
})


router.post('/register', function(req,res,next){
  
 
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    gender: req.body.gender,
    about: req.body.about,

    
  })
  
  User.register(newUser, req.body.password)
      .then(function(u){
        Message.create({message:[],
        username:req.body.username})
        .then(function(u){
          passport.authenticate('local')(req,res,function(){
            res.redirect('/hello');
          })
        })
        .catch(function(e){
          res.send(e);
        })

       
        
      })
      .catch(function(e){
        res.send(e);
      })

    
  
});


router.get('/hello', isLoggedIn,function(req,res,next){
  res.render('hello',{title:"hello"});
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function(req,res,next){});


  
router.get('/message', isLoggedIn,function(req, res, next){

  res.render('message');
});

router.post('/messages/:user', isLoggedIn, function(req, res, next){
  Message.findOne({username:req.body.username},function(err,doc){
    if(err)
    {
      console.log(err);
    }
    else
    {
      if(!doc)
      {
        console.log('Username with such a user does not exist');
        res.end();
      }
      else
      {
        console.log(doc);

        var date=new Date();
        var time=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()},${date.getHours()}:${date.getMinutes()}`;
        var timestamp=date.toISOString()+date.getMilliseconds();
     


        if (doc.message.length == 0) {

          var obj = {
            
            msgs: [{
             
              time:time,
              msg: req.body.message,
              unique:timestamp
            }]
          };
          doc.message.push(obj);
          doc.save();
          res.redirect('/message');

        } else {
        
            var objData = {
              time:time,
              msg: req.body.message,
              unique:timestamp
            };
            doc.message[0].msgs.push(objData);
            doc.markModified('message');
            doc.save();
            res.redirect('/message');
            
        }
      
        console.log('<h3>message will be sent soon !</h3>');
        res.end();
      }
    }
  })
  
  
 
  });

  router.get('/messages',function(req, res, next){
    Message.findOne({username:req.session.passport.user},function(err,doc){
      if(err)
      {
        console.log(err);
      }
      else
      {
        if(!doc)
        {
          res.send("You didnt receieve any message!")
        }
        else
        {
          if(doc.message.length>0)
        {
        var getACopy=doc.message[0].msgs;
        
        res.render('messages',{data:getACopy,title:'helllo',username:req.session.passport.user});
        }
        else
        {
          res.render('messages',{data:[],title:'helllo',username:req.session.passport.user});
        }
        }
      }
    })
   
  });
  

  router.get('/logout',function(req,res,next){
    req.logout();
    res.redirect('/');
  })


  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      res.redirect('/');
    }
  }
module.exports = router;
