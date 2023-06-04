import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.apiUrl}/api/v1/auth`;

  constructor(private httpClient: HttpClient) { }

  login(request: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/iniciar-sesion`, request);
  }

  obtenerUsuario(token: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/verUsuario?token=${token}`);
  }
}
