export class UpdateSettingsComposer {
    handler: string;
    session: string;
    type: string;
    data: string;

    constructor(session: string, type: string, data: string){
        this.handler = 'updateSettings';
        this.session = session;
        this.type = type;
        this.data = data;
    }
}
