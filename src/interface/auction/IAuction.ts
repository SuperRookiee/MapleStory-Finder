export interface IAuctionItem {
    item_name: string;
    unit_price: number;
    quantity: number;
    [key: string]: unknown;
}

export interface IAuctionList {
    count: number;
    items: IAuctionItem[];
    [key: string]: unknown;
}
