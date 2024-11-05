const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

const PortfolioService = new Schema({
   created_at:{
    type:Date,
    default:Date.now()
   },
   description:{
    type:String,
    required:true
   },
   github_url:{
    type:String,
    required:true
   },
   product_url:{
    type:String,
    required:true
   },
   company:{
    type:String,
    required:true
   },
   id:{
    type:String,
    required:true
   },
   image_link:{
    type:String,
    required:true
   },
   is_featured:{
    type:String,
    required:false
   },
   live_link:{
    type:String,
    required:false
   },
   order:{
    type:String
   },
   roles:{
    type:String
   },
   technologies_json:{
    type:String,
    required:true
   },
   title:{
    type:String,
    required:true
   },
   tag:{
    type:[String],
    required:true
   },
   blog_url:{
    type:String,
    required:true
   },
   updated_at:{
    type:Date,
    required:false
   }


   
});

const Valability = new Schema({
       is_available:{
        type:Boolean,
        required:true
       }

});

const TalkBusiness = new Schema({
       talkbusiness_id:{
            type:String,
            required:true 
       },
       name:{
        type:String,
        required:true 
       },
       description:{
        type:String,
        required:true 
       },
       media:{
        type:String,
        required:true,
       },
       amount:{
        type:Number,
        default:null,
       },
       piority:{
            type:Number,
            required:true
       },
       demos:[
         {
            name:String,
            link:String,
            description:String
         }
       ]
});

const Valabilitys = mongoose.model("Valability",Valability);
const PortfolioSchemas = mongoose.model("PortfolioSchema",PortfolioSchema);
const PortfolioServices = mongoose.model("PortfolioService",PortfolioService);
const PortfolioTalkBusiness = mongoose.model("PortfolioTalkBusiness",TalkBusiness);

module.exports = {
    PortfolioServices,
    PortfolioSchemas,
    Valabilitys,
    PortfolioTalkBusiness
};