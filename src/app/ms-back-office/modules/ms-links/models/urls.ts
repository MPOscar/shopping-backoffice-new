export class Link {
    id?: string;
    linkUrl: string;
    linkText: string;
}

export class UrlsListResponse {
    data: Link[];
    dataCount: number;
}

export class UrlsResponse {
    data: Link;
}
