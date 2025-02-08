export interface InventoryItem {
    id: number;
    img: string;
    count: number;
    position: number;
}

export interface Slot {
    empty: boolean;
    item: InventoryItem | null;
}
