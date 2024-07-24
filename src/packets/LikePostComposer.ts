export class LikePostComposer {
    handler: string;
    session: string;
    postId: number;

    constructor(session: string, postId: number){
        this.handler = 'likePost';
        this.session = session;
        this.postId = postId;
    }
}
