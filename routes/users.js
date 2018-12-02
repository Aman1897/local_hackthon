var mongoose =require('mongoose');
var passportLocal=require('passport-local-mongoose');
mongoose.connect('mongodb://vandana:0132cs161177@ds125821.mlab.com:25821/project',()=>{
  console.log('connecting to database');
})
var userSchema=mongoose.Schema({
  email:String,
  password:String,
  username:String,
  name:String,
  pic:{
    type:String
  },
  gender:String,
  about:String,
  
  other:{type:Array}
});
userSchema.plugin(passportLocal);
module.exports=mongoose.model('user',userSchema);
