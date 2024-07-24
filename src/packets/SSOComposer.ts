export class SSOComposer {
    handler: string;
    ssoTicket: string;

    constructor(ticket: string){
        this.handler = 'authentication';
        this.ssoTicket = ticket;
    }
}
