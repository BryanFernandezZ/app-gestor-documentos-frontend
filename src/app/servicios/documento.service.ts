import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AsignarUsuario } from '../vistas/lista-documentos/lista-documentos.component';

const headers: HttpHeaders = new HttpHeaders();

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private baseUrl: string = `${environment.apiUrl}/api/v1/documento`;

  constructor(private httpClient: HttpClient) {}

  obtenerDocumentos(): Observable<any[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/listar`);
  }
  
  obtenerDocumentoDeUsuarioLogueado(codigo: number): Observable<any[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/listarPorUsuario/${codigo}`);
  }

  verDocumento(codigo: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/ver/${codigo}`);
  }

  guardarDocument(documento: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/guardar`, documento);
  }

  actualizarDocumento(documento: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/actualizar`, documento);
  }

  eliminarDocumento(codigo: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/eliminar/${codigo}`);
  }

  derivarDocumento(asignarUsuario: AsignarUsuario): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/derivar`, asignarUsuario);
  }

  notificarDocumento(data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/notificar`, data);
  }

  finalizarDocumento(codigo: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/finalizar/${codigo}`);
  }
}