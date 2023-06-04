import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl: string = `${environment.apiUrl}/api/v1/categoria`

  constructor(private httpClient: HttpClient) { }

  obtenerCategorias(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/listar`);
  }
}
