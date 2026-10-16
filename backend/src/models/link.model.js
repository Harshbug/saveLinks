const mongoose=require('mongoose');
const {Schema}=require('mongoose');

const linkSchema=new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url:{
        type:String,
        required:true,
        //cant make this true it would eventually make one link uunique for a single user only 
        // unique:true,
    },
    title:{
        type:String
    },
    description:{
        type:String,
    },
    favicon:{
        type:String,
    },
    metadata:{
        type:String,
        enum:[
            'pending',
            'completed',
            'failed'
        ],
        default:"pending"
    },
    image:{
        type:String,
        default:null
    },
    isFavorite:{
        type:Boolean,
        default:false
    },
    tags:[String],
   
},{timestamps:true})
linkSchema.index({ userId: 1, url: 1 }, { unique: true });

const Link=mongoose.model('Link',linkSchema);

module.exports=Link;