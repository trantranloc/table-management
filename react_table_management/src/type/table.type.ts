export interface Table {
    id: string;                  
    tableNumber: string;        
    capacity: number;           
    floor: number;              
    status: 'UNAVAILABLE' | 'AVAILABLE';
}

export type TableRequest = Omit<Table, 'id'>;
