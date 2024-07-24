export class StopRecordingComposer {
    handler: string;
    session: string;

    constructor(session: string){
        this.handler = 'stopRecoding';
        this.session = session;
    }
}
