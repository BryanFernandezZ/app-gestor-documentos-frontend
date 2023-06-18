import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import { Observable, catchError, throwError } from 'rxjs';

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

      return next.handle(reqClone).pipe(
        catchError(this.manejarErrores)
      );
    }

    return next.handle(req);
  }

  manejarErrores(error: HttpErrorResponse) {
    if(error.status === 401) {
      console.log("Token expirado")
      localStorage.clear();
      window.location.href="/login";
    }

    return throwError("Error encontrado");
  }
}
