import { HttpHeaders } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.endsWith("iniciar-sesion")) {
      //TODO: AGREGANDO HEADERS
      const token: string = localStorage.getItem("acctkn")!;
      let headers: HttpHeaders = new HttpHeaders({});

      token !== null ? headers = new HttpHeaders({
        "Authorization": `Bearer ${token}`
      }) : "";

      const reqClone = req.clone({
        headers
      })

      return next.handle(reqClone);
    }

    return next.handle(req);
  }
}
