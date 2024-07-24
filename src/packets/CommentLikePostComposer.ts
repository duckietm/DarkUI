export class CommentLikePostComposer {
    handler: string;
    session: string;
    postId: number;
    commentId: number;

    constructor(session: string, postId: number, commentId: number){
        this.handler = 'commentLikePost';
        this.session = session;
        this.postId = postId;
        this.commentId = commentId;
    }
}
