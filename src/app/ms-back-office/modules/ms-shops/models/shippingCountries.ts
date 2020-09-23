export class ShippingCountries {
    id?: string;
    name?: string;
};

export const SHIPPINGCOUNTRIES: ShippingCountries[] = [
    { id: 'Worldwide', name: 'Worldwide' },
    { id: 'Europe', name: 'Europe' },
    { id: 'USA', name: 'USA' },
    { id: 'Select Countries', name: 'Select Countries' },
];

export const SHIPPINGCOUNTRIESRAFFLE: ShippingCountries[] = [
    { id: 'Worldwide Shipping', name: 'Worldwide Shipping' },
    { id: 'Shipping to US only', name: 'Shipping to US only' },
    { id: 'Shipping to EU only', name: 'Shipping to EU only' },
    { id: 'Instore pick-up', name: 'Instore pick-up' },
];
