export class VotationGameComposer {
    handler: string;
    session: string;
    participantId: number;
    votationNumber: number;

    constructor(session: string, participantId: number, votationNumber: number){
        this.handler = 'votationGame';
        this.session = session;
        this.participantId = participantId;
        this.votationNumber = votationNumber;
    }
}
