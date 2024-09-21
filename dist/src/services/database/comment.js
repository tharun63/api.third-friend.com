"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDataServiceProvider = void 0;
const comment_1 = require("../../models/comment");
class CommentDataServiceProvider {
    async saveComment(commentData) {
        return await comment_1.CommentModel.create(commentData);
    }
    async updateCommentById(commentId, data) {
        return comment_1.CommentModel.updateOne({ _id: commentId }, { $set: data });
    }
    async getAllComments({ query = {}, skip = null, limit = null, sort = {}, projection = {}, lean = false, }) {
        if (lean) {
            return comment_1.CommentModel.find(query)
                .collation({ locale: "en" })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(projection)
                .lean();
        }
        return comment_1.CommentModel.find(query)
            .collation({ locale: "en" })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(projection);
    }
    async countAllComments(query = {}) {
        return comment_1.CommentModel.countDocuments(query);
    }
}
exports.CommentDataServiceProvider = CommentDataServiceProvider;
//# sourceMappingURL=comment.js.map