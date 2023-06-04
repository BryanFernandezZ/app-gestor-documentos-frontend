import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private baseUrl: string = `${environment.apiUrl}/api/v1/tipoDocumento`;

  constructor(private httpClient: HttpClient) { }

  obtenerTipoDocumentos(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/listar`);
  }

  guardarTipoDocumento(tipoDocumento: any): Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}/guardar`, tipoDocumento);
  }
}
