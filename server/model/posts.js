import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,    
        },
        firstName: {
          type: String,
          required: true,
          min: 2,
          max: 50,
        },
        lastName: {
          type: String,
          required: true,
          min: 2,
          max: 50,
        },
        picturePath: String,
        userPicturePath: String,
        description:String,
        likes:{
            type:Map,
            of:Boolean,
        },
        comment:{
            type: Array,
            dafault:[]
        },
      },
  { timestamps: true }
);

const Post = mongoose.model('Post',PostSchema)
export default Post
