export class GetSettingsInfoComposer {
    handler: string;
    session: string;

    constructor(session: string){
        this.handler = 'geSettingsInfo';
        this.session = session;
    }
}
