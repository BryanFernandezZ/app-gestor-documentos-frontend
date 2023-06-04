import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioLogueado } from '../componentes/navbar/navbar.component';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/api/v1/usuario`;

  constructor(private httpClient: HttpClient) { }

  obtenerUsuarios(): Observable<any[]>  {
    return this.httpClient.get<any[]>(`${this.baseUrl}/listar`);
  }

  verUsuario(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/ver/${id}`);
  }

  verUsuarioAux(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/verAux/${id}`);
  }

  guardarUsuario(usuario: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/guardar`, usuario);
  }

  actualizarUsuario(usuario: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/actualizar`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/eliminar/${id}`, null);
  }

  setUsuarioLogueado(usuario: UsuarioLogueado){
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem("obj", usuarioString);
  }

  getUsuarioLogueado(): UsuarioLogueado {
    const objStr = localStorage.getItem("obj")!;
    return JSON.parse(objStr) as UsuarioLogueado;
  }


  obtenerUsuariosArea(area: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/usuariosArea/${area}`);
  }
}
