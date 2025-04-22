export interface Table {
    id: string;
    tableNumber: string;
    capacity: number;
    floor: number;
    status: 'BOOKED' | 'PROCESSING' | 'AVAILABLE';
}

export type TableRequest = Omit<Table, 'id'>;
