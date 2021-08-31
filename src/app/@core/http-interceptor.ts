import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        if (req.url.match('http')) {
            return next.handle(req);
        }
        const siteReq = req.clone({
            url: `${environment.apiUrl}${req.url}`
        });
        // send the cloned, "secure" request to the next handler.
        return next.handle(siteReq);
    }
}