var mongoose=require('mongoose');
mongoose.connect('mongodb://vandana:0132cs161177@ds125821.mlab.com:25821/project');
var messageSchema=mongoose.Schema({
    message:{type:Array},
    username:String
})
module.exports=mongoose.model('message',messageSchema);