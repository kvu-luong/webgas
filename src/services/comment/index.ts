import { NotFoundError } from '@core/error.response';
import Comment from '@models/comment.model';
import { findOneProduct } from '@models/repositories/product.repo';
import { covertToObjectIdMongodb } from '@utils/index';

export class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId,
  }: {
    productId: string;
    userId: string;
    content: string;
    parentCommentId?: string;
  }) {
    const comment = new Comment({
      productId,
      userId,
      content,
      parentId: parentCommentId,
    });

    let rightValue = 1;
    if (parentCommentId) {
      // insert new comment for existing one
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('Parent comment not found');

      rightValue = parentComment.right;

      // update remain comments
      await Comment.updateMany(
        {
          productId: covertToObjectIdMongodb(productId),
          right: { $gte: rightValue }, // update parent too
        },
        {
          $inc: { right: 2 },
        },
      );

      await Comment.updateMany(
        {
          productId: covertToObjectIdMongodb(productId),
          left: { $gt: rightValue },
        },
        {
          $inc: { left: 2 },
        },
      );
    } else {
      const lastComment = await Comment.findOne(
        {
          productId: covertToObjectIdMongodb(productId),
        },
        'right',
        { sort: { right: -1 } }, // get the last one
      );

      if (lastComment?.right) {
        rightValue = lastComment.right + 1;
      }
    }

    // Insert to comment
    comment.left = rightValue;
    comment.right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId,
  }: // limit = 50,
  // offset = 0,
  {
    productId: string;
    parentCommentId?: string;
    limit?: number;
    offset?: number;
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError('Parent comment not found');

      return await Comment.find({
        productId: covertToObjectIdMongodb(productId),
        left: { $gt: parent.left },
        right: { $lte: parent.right },
      })
        .select({
          left: 1,
          right: 1,
          content: 1,
          parentId: 1,
        })
        .sort({
          left: 1,
        });
    }

    return await Comment.find({
      productId: covertToObjectIdMongodb(productId),
    })
      .select({
        left: 1,
        right: 1,
        content: 1,
        parentId: 1,
      })
      .sort({
        left: 1,
      });
  }

  static async deleteComments({ commentId, productId }: { commentId: string; productId: string }) {
    const foundProduct = await findOneProduct({
      productId,
    });

    if (!foundProduct) throw new NotFoundError('Product not found');

    //1. Define left and right
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');

    const leftValue = comment.left;
    const rightValue = comment.right;

    // 2. Calculate with to this comment
    const width = rightValue - leftValue + 1;
    // 3. Delete all comments belong to this comment

    await Comment.deleteMany({
      productId: covertToObjectIdMongodb(productId),
      left: { $gte: leftValue, $lte: rightValue },
    });

    // 4. Update remains right of other comments.
    await Comment.updateMany(
      {
        productId: covertToObjectIdMongodb(productId),
        right: { $gt: rightValue },
      },
      {
        $inc: { right: -width },
      },
    );

    // 5. Update remains left of other comments.
    await Comment.updateMany(
      {
        productId: covertToObjectIdMongodb(productId),
        left: { $gt: rightValue },
      },
      {
        $inc: { left: -width },
      },
    );

    return { isDelete: true };
  }
}
