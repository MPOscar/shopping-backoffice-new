export class Status {
    id?: string;
    name?: string;
};

export const STATUS: Status[] = [
    { id: 'on_sale', name: 'On Sale' },
    { id: 'available', name: 'Available' },
    { id: 'coming_soon', name: 'Coming Soon' },
    { id: 'restock', name: 'Restock' },
    { id: 'sold_out', name: 'Sold Out' },
];

export const RAFFLE_STATUS: Status[] = [
    { id: 'live', name: 'Raffle Live' },
    { id: 'closed', name: 'Raffle Closed' },
    { id: 'coming_soon', name: 'Coming Soon' },
];


export const OFFERS_STATUS: Status[] = [
    { id: 'available', name: 'Available' },
    { id: 'coming_soon', name: 'Coming Soon' },
    { id: 'on_sale', name: 'On Sale' },
    { id: 'closed', name: 'Raffle Closed' },
    { id: 'live', name: 'Raffle Live' },
    { id: 'restock', name: 'Restock' },
    { id: 'sold_out', name: 'Sold Out' },
];