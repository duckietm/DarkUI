export class GetFeedComposer {
    handler: string;
    session: string;

    constructor(session: string){
        this.handler = 'getFeed';
        this.session = session;
    }
}
