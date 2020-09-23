export class Filter {
    id?: string;
    name?: string;
};

export const RELEASES: Filter[] = [    
    { id: 'collectionId', name: 'Collection' },
    { id: 'gender', name: 'Gender' },
    { id: 'sku', name: 'SKU' },    
];

export class FilterItem {
    filter?: string;
    name?: string;
    value?: string;
}

export class FilterResponce {
    style?: string;
    brand?: string;
    collection?: string;
    category?: string;
    gender?: string;
    color?: string;
    shop?: string;
    shipping?: string;
    maxPrice?: string;
    minPrice?: string;    
}
