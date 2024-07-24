export class CommentPostComposer {
    handler: string;
    session: string;
    postId: number;
    comment: string;

    constructor(session: string, postId: number, comment: string){
        this.handler = 'commentPost';
        this.session = session;
        this.postId = postId;
        this.comment = comment;
    }
}
