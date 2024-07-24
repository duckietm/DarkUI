export class InteractionHandlerComposer {
    handler: string;
    session: string;
    type: string;
    playerToInteract: string;

    constructor(session: string, type: string, playerToInteract: string){
        this.handler = 'interactionHandler';
        this.session = session;
        this.type = type;
        this.playerToInteract = playerToInteract;
    }
}
