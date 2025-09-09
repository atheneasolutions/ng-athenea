import { HttpClient, HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { catchError, switchMap, take, takeUntil, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommunicationService } from './communication.service';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public us: UserService | undefined;

  constructor(
    public inj: Injector,
    public http: HttpClient,
    public plt: Platform,
    public cs: CommunicationService
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.us = this.inj.get(UserService);
    
    const requestedToken = request.url.includes(environment.ICURA_ENDPOINT + '/api/');

    return this.addToken(request, requestedToken)
      .pipe(
        switchMap(req => {
          return next.handle(req).pipe(
            timeout(300000),
            catchError(async (error: HttpErrorResponse, caught) => {
                throw error;
            }
            ));
        }));
  }

  addToken(request: HttpRequest<any>, publicToken: boolean) {
    const token = (publicToken ? this.us?.getToken() : this.us?.lastPatientToken);
    //console.log(this.us?.getToken());

    let newRequestObj: any = {
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    }

    const cloned = request.clone(newRequestObj);
    return of(cloned);
  }


}
