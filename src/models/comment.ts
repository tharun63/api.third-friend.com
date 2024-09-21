import { Schema, model } from "mongoose";
import { COMMENT_TYPE,DEFAULT_COMMENT_TYPE} from '../constants/comment'


const commentDataSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    journey: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Journey",
    },
    content :{
      type: String,
      required: true
    },
    parent_comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment', 
        default: null,
    },
    type: {
        type: String,
        enum: COMMENT_TYPE,
        default: DEFAULT_COMMENT_TYPE,
    }
    
   
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);



export const CommentModel = model("Comment", commentDataSchema, "comments");

