import { Component, OnInit } from '@angular/core';
import { DocumentoService } from 'src/app/servicios/documento.service';
import { ExportadorService } from 'src/app/servicios/exportador.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  documentos: any [] = [];
  documentosMostrar: any[] = [];
  documentoSeleccionado: any;
  loading: boolean = false;

  //TODO: PAGINACION Y FILTRO DE TABLA

  nroElementos: number = 5;
  nroPagina: number = 0;

  anteriorDisabled: boolean = true;
  siguienteDisabled: boolean = false;

  filtro: string = "";

  constructor(private documentoService: DocumentoService, private exportadorService: ExportadorService) { }

  ngOnInit(): void {
    this.obtenerDocumentos();
  }

  obtenerDocumentos(): void {
    this.documentoService.obtenerDocumentos().subscribe({
      next: (data) => this.documentos = data,
      error: (err) => console.error(err),
      complete: () => this.parsearDatos()
    })
  }

  parsearDatos() {
    this.documentosMostrar = this.documentos;

    this.documentosMostrar.forEach(documento => {
      documento.fechaDocumento = this.parsearFecha(documento.fechaDocumento);
      documento.fechaCreacion = documento.fechaCreacion === null ? "No creado" : this.parsearFecha((documento.fechaCreacion));
      // documento.fechaDerivacion === null ? documento.fechaDerivacion = "No Derivado" : this.parsearFecha(documento.fechaDerivacion);
      documento.fechaDerivacion = documento.fechaDerivacion === null ? "No Derivado" : this.parsearFecha(documento.fechaDerivacion);
      documento.fechaNotificacion = documento.fechaNotificacion === null ? "No Notificado" : this.parsearFecha((documento.fechaNotificacion));
      documento.fechaFinalizacion = documento.fechaFinalizacion === null ? "No Finalizado" : this.parsearFecha((documento.fechaFinalizacion));
    })

    this.loading = true;
  }
  parsearFecha(fecha: any): any {
    const fechaJs = new Date(fecha);
    let mes = "";

    if (fechaJs.getMonth() + 1 < 10) mes = `0${fechaJs.getMonth() + 1}`;
    else mes = `${fechaJs.getMonth() + 1}`;

    const fechaFinal = `${fechaJs.getDate()}/${mes}/${fechaJs.getFullYear()}`;

    return fechaFinal;
  }

  setNroElementos(nroElementos: string): void {
    this.nroElementos = parseInt(nroElementos);
    this.nroPagina = 0;
  }

  setFiltro(filtro: string): void{
    this.filtro = filtro;
  }

  anteriorPagina() {
    this.nroPagina--;
    if (this.nroPagina > 0) {
      this.siguienteDisabled = false;
      this.anteriorDisabled = false;
    }
    else this.resetTabla();
  }

  siguientePagina() {
    this.anteriorDisabled = false;
    this.nroPagina++;
    if ((this.nroPagina * this.nroElementos) + this.nroElementos >= this.documentosMostrar.length)
      this.siguienteDisabled = true;
  }

  verPrimeraPagina() {
    this.nroPagina = 0;
    this.resetTabla();
  }

  resetTabla() {
    this.anteriorDisabled = true;
    this.siguienteDisabled = false;
  }

  exportarAExcel(): void {
    this.exportadorService.exportarAExcel(this.generarDataExportar(), "reporte_documentos");
  }

  generarDataExportar(): any[] {
    const data: any[] = [];
    this.documentos.forEach(d => {
      const documento = {
        codigo: d.codigo,
        documento: d.documento.tipoDocumento,
        numeroDocumento: d.nroDocumento,
        suministro: d.suministro,
        referencia: d.referencia,
        usuarioAsignado: d.usuarioAsignado.nombre + d.usuarioAsignado.apellidos,
        usuarioAnterior: d.usuarioAnterior === null ? "" : d.usuarioAnterior,
        fechaDocumento: d.fechaDocumento,
        fechaCreacion: d.fechaCreacion,
        fechaDerivacion: d.fechaDerivacion,
        fechaNotificacion: d.fechaNotificacion,
        fechaFinalizacion: d.fechaFinalizacion
      }

      data.push(documento);
    })

    return data;
  }

  setDocumentoSeleccionado(documento: any): void {
    this.documentoSeleccionado = documento;
    console.log({ documento })
  }
}

export interface DocumentoExcelExport {
  codigo: number;
  documento: string;
  numeroDocumento: string;
  suministro: string;
  referencia: string;
  usuarioAsignado: string;
  usuarioAnterior: string;
  fechaDocumento: string;
  fechaCreacion: string;
  fechaDerivacion: string;
  fechaNotificacion: string;
  fechaFinalizacion: string;
}
