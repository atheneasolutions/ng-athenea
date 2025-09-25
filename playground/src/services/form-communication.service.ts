import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class FormCommunicationService {

    public currentRequestSubs: Subscription | undefined | null;
    public currentRequest$: Observable<any> | undefined | null;

    constructor(
        public http: HttpClient,
    ) { }

    async request(path: any, type: any, params?: { [x: string]: any; },  throwError = { throw: true, show: true }, canCancelReq = false, options = {}): Promise<any> {
        let res;
        let endpoint = environment.FORMS_ENDPOINT;

        this.currentRequest$ = null;
        try {
          switch (type) {
            case 'get':
              if (params) Object.keys(params).forEach(key => (!params[key] || params[key] === undefined) && delete params[key]);
              this.currentRequest$ = this.http.get(endpoint + path, { ...options, params}).pipe(first());
              break;
            case 'patch':
              this.currentRequest$ = this.http.patch(endpoint + path, params, options).pipe(first());
              break;
            case 'post':
              this.currentRequest$ = this.http.post(endpoint + path, params, options).pipe(first());
              break;
            case 'put':
              this.currentRequest$ = this.http.put(endpoint + path, params, options).pipe(first());
              break;
            case 'delete':
              this.currentRequest$ = this.http.delete(endpoint + path, {...options, params }).pipe(first());
              break;
          }
    
          res = await new Promise((resolve, reject) => {
            if (canCancelReq) {
                this.cancelRequest();
                if(this.currentRequest$)
                this.currentRequestSubs = this.currentRequest$
                    .pipe(catchError(err => {
                    return this.handleError(path, type, params, throwError, err);
                    }))
                    .subscribe(
                    (data) => { resolve(data); },
                    (error) => {
                        return this.handleError(path, type, params, throwError, error)
                    }
                    );
            } else {
                if(this.currentRequest$)
                this.currentRequest$
                    .pipe(catchError(err => {
                        return this.handleError(path, type, params, throwError, err)
                    }))
                    .subscribe(
                        (data) => { resolve(data); },
                        (error) => {
                            reject(error);
                        }
                    );
            }
          })
        } catch (e) {
          return Promise.reject(e);
    
        }
        return Promise.resolve(res);
    }

    cancelRequest() {
        if (this.currentRequestSubs) this.currentRequestSubs.unsubscribe();
    }

    async handleError(path: any, type: any, params: { [x: string]: any; } | undefined, throwError: { throw: boolean; show: boolean; }, e: any) {
        throw e;
    }
}