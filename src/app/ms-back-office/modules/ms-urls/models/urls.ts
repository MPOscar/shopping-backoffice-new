export class Url {
    id?: string;   
    createdAt?: string;
    updatedAt?: string;
    url: string;
    vanityUrl?: string;
}

export class UrlsListResponse {
    data: Url[];
    dataCount: number;
} 

export class UrlsResponse {
    data: Url;
} 