export class Shipping {
    id?: string;
    name?: string;
}

export const SHIPPING: Shipping[] = [
    { id: 'Worldwide', name: 'Worldwide' },
    { id: 'Europe', name: 'Europe' },
    { id: 'USA', name: 'USA' },
    { id: 'Select Countries', name: 'Select Countries' },
    { id: 'unavailable', name: 'Unavailable' },
];


export const OFFER_SHIPPING: Shipping[] = [
    { id: 'worldwide', name: 'Worldwide' },
    { id: 'unavailable', name: 'Unavailable' },
];
