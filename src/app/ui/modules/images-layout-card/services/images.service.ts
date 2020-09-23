import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs';
//
import { ConfigService } from '../../../../config/services/config.service';
import { HttpHeadersInterceptorService, RequestOptions } from '../../../../error-handling/interceptors/http-headers-interceptor.service';

import { Face } from '../models/face';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  baseUrl: string;

  toEditFace: Face;

  constructor(private http: HttpClient,
              private httpHeaders: HttpHeadersInterceptorService,
              private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.apiUrl + this.configService.config.apiConfigs.images.apiEndpoint;
  }

  postImage(image: File): Observable<any> {
    const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
    requestOptions.headers = requestOptions.headers.delete('Content-Type');
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<any>(this.baseUrl, formData, requestOptions);
  }
}
