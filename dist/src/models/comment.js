"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const comment_1 = require("../constants/comment");
const commentDataSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    journey: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Journey",
    },
    content: {
        type: String,
        required: true
    },
    parent_comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    type: {
        type: String,
        enum: comment_1.COMMENT_TYPE,
        default: comment_1.DEFAULT_COMMENT_TYPE,
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.CommentModel = (0, mongoose_1.model)("Comment", commentDataSchema, "comments");
//# sourceMappingURL=comment.js.map