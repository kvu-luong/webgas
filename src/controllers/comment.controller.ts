import { CREATED, OK } from '@core/success.response';
import { Response } from 'express';
import { CommentService } from '@services/comment';
import { CustomRequest } from 'global';

export class CommentController {
  static createComment = async (req: CustomRequest, res: Response) => {
    const commentPayload = {
      ...req.body,
      userId: req.userId,
    };

    new CREATED({
      message: 'Create a comment!',
      metadata: await CommentService.createComment(commentPayload),
    }).send(res);
  };

  static getComments = async (req: CustomRequest, res: Response) => {
    const commentPayload = {
      productId: req.query['productId'] as string,
      parentCommentId: req.query['parentCommentId'] as string,
    };

    return new OK({
      message: 'List comments',
      metadata: await CommentService.getCommentsByParentId(commentPayload),
      statusCode: 200,
    }).send(res);
  };

  static deleteComments = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'Delete comments',
      metadata: await CommentService.deleteComments(req.body),
      statusCode: 200,
    }).send(res);
  };
}
