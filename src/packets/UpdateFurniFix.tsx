class FurniInfo{
    id: number;
    itemName: string;
    publicName: string;
    type: string;
    width: number;
    length: number;
    stack_height: number;
    can_stack: number;
    can_sit: number;
    can_lay: number;
    is_walkable: number;
    sprite_id: number;
    allow_trade: number;
    allow_recycle: number;
    allow_marketplace_sell: number;
    allow_gift: number;
    allow_inventory_stack: number;
    interaction_type: string;

    constructor(id: number, itemName: string, publicName: string, type: string, width: number, length: number, stack_height: number, can_stack: number, can_sit: number, can_lay: number, is_walkable: number, sprite_id: number, allow_trade: number, allow_recycle: number, allow_marketplace_sell: number, allow_gift: number, allow_inventory_stack: number, interaction_type: string){
        this.id = id;
        this.itemName = itemName;
        this.publicName = publicName;
        this.type = type;
        this.width = width;
        this.length = length;
        this.stack_height = stack_height;
        this.can_stack = can_stack;
        this.can_sit = can_sit;
        this.can_lay = can_lay;
        this.is_walkable = is_walkable;
        this.sprite_id = sprite_id;
        this.allow_trade = allow_trade;
        this.allow_recycle = allow_recycle;
        this.allow_marketplace_sell = allow_marketplace_sell;
        this.allow_gift = allow_gift;
        this.allow_inventory_stack = allow_inventory_stack;
        this.interaction_type = interaction_type;
    }
}

export class UpdateFurniFix {
    handler: string;
    session: string;
    furni: FurniInfo;

    constructor(session: string, id: number, itemName: string, publicName: string, type: string, width: number, length: number, stack_height: number, can_stack: number, can_sit: number, can_lay: number, is_walkable: number, sprite_id: number, allow_trade: number, allow_recycle: number, allow_marketplace_sell: number, allow_gift: number, allow_inventory_stack: number, interaction_type: string){
        this.handler = 'updateFurniFix';
        this.session = session;
        this.furni = new FurniInfo(id, itemName, publicName, type, width, length, stack_height, can_stack, can_sit, can_lay, is_walkable, sprite_id, allow_trade, allow_recycle, allow_marketplace_sell, allow_gift, allow_inventory_stack, interaction_type);
    }
}
