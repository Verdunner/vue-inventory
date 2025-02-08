export interface InventoryItem {
    id: number;
    name: string;
    position: number;
}

export interface Slot {
    empty: boolean;
    item: InventoryItem | null;
}
