import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoService } from 'src/app/servicios/documento.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';

@Component({
  selector: 'app-actualizar-documento',
  templateUrl: './actualizar-documento.component.html',
  styleUrls: ['./actualizar-documento.component.css']
})
export class ActualizarDocumentoComponent implements OnInit {

  codigoDocumento: number = this.rutaActiva.snapshot.params['codigo'];

  documentoRequest: FormGroup = new FormGroup({});
  documento: any;
  submited: boolean = false;

  tipoDocumentos: any[] = [];

  constructor(private rutaActiva: ActivatedRoute, private documentoService: DocumentoService,
    private tipoDocumentoService: TipoDocumentoService, private router: Router) { }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.documentoService.verDocumento(this.codigoDocumento).subscribe({
      next: (data) => this.documento = data,
      error: (err) => console.error(err),
      complete: () => {
        console.log(this.documento);
        this.parsearFechas();
        this.initDocumentoRequest();
      }
    });

    this.tipoDocumentoService.obtenerTipoDocumentos().subscribe({
      next: (data) => this.tipoDocumentos = data,
      error: (err) => console.error(err)
    })
  }

  parsearFechas() {
    Object.keys(this.documento).forEach(key => {
      let fechaParseada: Date;
      if (key.startsWith("fecha")) {
        //TODO: Verificamos si la fecha no es nula para poder parsearla
        if (this.documento[key]) {
          // const fecha: number[] = this.documento[key];
          // fechaParseada = new Date(fecha[0], fecha[1], fecha[2]);
          fechaParseada = new Date(this.documento[key]);
          this.documento[key] = fechaParseada.toISOString().substring(0, 10);
        }
      }
    })
  }

  initDocumentoRequest() {
    this.documentoRequest = new FormGroup({
      documento: new FormControl(this.documento.documento.codigo, [Validators.required]),
      fechaDocumento: new FormControl(this.documento.fechaDocumento, [Validators.required]),
      nroDocumento: new FormControl(this.documento.nroDocumento, [Validators.required]),
      remitente: new FormControl(this.documento.remitente, [Validators.required]),
      direccionProcesal: new FormControl(this.documento.direccionProcesal, [Validators.required]),
      suministro: new FormControl(this.documento.suministro, [Validators.required]),
      referencia: new FormControl(this.documento.referencia, [Validators.required]),
      descripcion: new FormControl(this.documento.descripcion, [Validators.required]),
    })
  }

  actualizarDocumento() {
    this.submited = true;
    if (this.documentoRequest.valid) {
      //TODO: ACTUALIZAR DOCUMENTO
      this.documentoService.actualizarDocumento(this.crearDocumentoRequest()).subscribe({
        next: (data) => console.log(data),
        error: (err) => console.error(err),
        complete: () => this.router.navigateByUrl("/lista-documentos")
      })
    } else {
      alert("Something went wrong");
    }
  }

  crearDocumentoRequest(): any {
    const fechaSeleccionada: Date = new Date(this.documentoRequest.get("fechaDocumento")?.value);
    const documentoRequestData = {
      codigo: this.codigoDocumento,
      documento: {
        codigo: this.documentoRequest.get("documento")?.value
      },
      fechaDocumento: [
        fechaSeleccionada.getFullYear(),
        fechaSeleccionada.getMonth() + 1,
        fechaSeleccionada.getUTCDate()
      ],
      nroDocumento: this.documentoRequest.get("nroDocumento")?.value,
      remitente: this.documentoRequest.get("remitente")?.value,
      direccionProcesal: this.documentoRequest.get("direccionProcesal")?.value,
      suministro: this.documentoRequest.get("suministro")?.value,
      referencia: this.documentoRequest.get("referencia")?.value,
      descripcion: this.documentoRequest.get("descripcion")?.value,
      usuarioAnterior: this.documento.usuarioAnterior,
      usuarioAsignado: this.documento.usuarioAsignado,
      archivoAdjunto: this.documento.archivoAdjunto,
      fechaCreacion: this.documento.fechaCreacion,
      fechaDerivacion: this.documento.fechaDerivacion,
      fechaNotificacion: this.documento.fechaNotificacion,
      fechaFinalizacion: this.documento.fechaFinalizacion,
      estado: this.documento.estado,
      creado: this.documento.creado,
      derivado: this.documento.derivado,
      notificado: this.documento.notificado,
      finalizado: this.documento.finalizado
    }

    console.log({ documentoRequestData });

    return documentoRequestData;
  }

  cancelar() {
    this.router.navigateByUrl("/lista-documentos");
  }
}
