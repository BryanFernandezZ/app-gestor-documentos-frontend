import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioLogueado } from 'src/app/componentes/navbar/navbar.component';
import { DocumentoService } from 'src/app/servicios/documento.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-agregar-documento',
  templateUrl: './agregar-documento.component.html',
  styleUrls: ['./agregar-documento.component.css']
})
export class AgregarDocumentoComponent implements OnInit, AfterViewInit {

  usuarioLogueado: UsuarioLogueado = this.usuarioService.getUsuarioLogueado();

  //TODO: AGREGAR VALIDACIONES ADICIONALES
  documentoRequest: FormGroup = new FormGroup({
    documento: new FormControl("", [Validators.required]),
    fechaDocumento: new FormControl("", [Validators.required]),
    nroDocumento: new FormControl("", [Validators.required, Validators.minLength(18)]), // Validators.maxLength(25)
    remitente: new FormControl("", [Validators.required]),
    direccionProcesal: new FormControl("", [Validators.required]),
    suministro: new FormControl("", [Validators.required, Validators.pattern(new RegExp("[0-9]{8}"))]),
    referencia: new FormControl("", [Validators.required, Validators.pattern(new RegExp("[A-Za-z0-9-]{13}"))]),
    descripcion: new FormControl("", [Validators.required]),
    usuarioAsignado: new FormControl({
      value: `${this.usuarioLogueado.nombre} ${this.usuarioLogueado.apellidos}`,
      disabled: true
    }, [Validators.required]),
  })

  tipoDocumentos: any[] = [];

  submited = false;

  constructor(private documentoService: DocumentoService,
    private usuarioService: UsuarioService,
    private tipoDocumentoService: TipoDocumentoService,
    private router: Router) { }

  ngOnInit(): void {
    this.tipoDocumentoService.obtenerTipoDocumentos().subscribe({
      next: (data) => this.tipoDocumentos = data,
      error: (err) => console.error(err),
      complete: () => {
        this.tipoDocumentos = this.tipoDocumentos.sort((a, b) => a.tipoDocumento.localeCompare(b.tipoDocumento));
      }
    })
  }

  ngAfterViewInit(): void {

  }

  guardarDocumento() {
    this.submited = true;
    if (this.documentoRequest.valid) {
      const documento = this.crearDocumentoRequest();
      this.documentoService.guardarDocument(documento).subscribe(
        (data) => console.log(data),
        (err) => {
          err.status === 500 ? alert(err.error.message) : ""
          console.error({ err });
        },
        () => {
          alert("Documento guardado!");
          this.router.navigateByUrl("/lista-documentos");
        }
      )
    } else {
      alert("Algo ocurrio mal...")
    }
  }

  crearDocumentoRequest(): any {
    const fechaSeleccionada = new Date(this.documentoRequest.get("fechaDocumento")?.value);
    const tipoDocumentoSeleccionado = this.tipoDocumentos.find(td => td.codigo === parseInt(this.documentoRequest.get("documento")?.value));
    return {
      documento: {
        codigo: tipoDocumentoSeleccionado.codigo
      },
      fechaDocumento: [
        fechaSeleccionada.getFullYear(),
        fechaSeleccionada.getMonth(),
        fechaSeleccionada.getUTCDate()
      ],
      nroDocumento: this.documentoRequest.get("nroDocumento")?.value,
      remitente: this.documentoRequest.get("remitente")?.value,
      direccionProcesal: this.documentoRequest.get("direccionProcesal")?.value,
      suministro: this.documentoRequest.get("suministro")?.value,
      referencia: this.documentoRequest.get("referencia")?.value,
      descripcion: this.documentoRequest.get("descripcion")?.value,
      usuarioAsignado: {
        codigo: this.usuarioLogueado.codigo
      }
    }
  }

  cancelar() {
    this.router.navigateByUrl("/lista-documentos");
  }
}
