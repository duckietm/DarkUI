export class JoinGameComposer {
    handler: string;
    session: string;
    type: string;

    constructor(session: string, type: string){
        this.handler = 'joinGame';
        this.type = type;
        this.session = session;
    }
}
