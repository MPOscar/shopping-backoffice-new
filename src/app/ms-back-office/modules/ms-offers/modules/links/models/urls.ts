export class Link {
    id?: string;
    url: string;
    text: string;
}

export class UrlsListResponse {
    data: Link[];
    dataCount: number;
}

export class UrlsResponse {
    data: Link;
}