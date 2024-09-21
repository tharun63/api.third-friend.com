import { CommentModel } from "../../models/comment";

export class CommentDataServiceProvider {


  public async saveComment(commentData) {
    return await CommentModel.create(commentData);
  }

 
  async updateCommentById(commentId, data) {
    return CommentModel.updateOne({ _id: commentId }, { $set: data });
  }

  async getAllComments({
    query = {},
    skip = null,
    limit = null,
    sort = {},
    projection = {},
    lean = false,
  }) {
    if (lean) {
      return CommentModel.find(query)
        .collation({ locale: "en" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean();
    }
    return CommentModel.find(query)
      .collation({ locale: "en" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection);
  }

  async countAllComments(query = {}) {
    return CommentModel.countDocuments(query);
  }

}
