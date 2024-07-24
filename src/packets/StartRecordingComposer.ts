export class StartRecordingComposer {
    handler: string;
    session: string;

    constructor(session: string){
        this.handler = 'startRecoding';
        this.session = session;
    }
}
