import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioLogueado } from 'src/app/componentes/navbar/navbar.component';
import { DocumentoService } from 'src/app/servicios/documento.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-lista-documentos',
  templateUrl: './lista-documentos.component.html',
  styleUrls: ['./lista-documentos.component.css']
})
export class ListaDocumentosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("derivarDocumentoModal") derivarDocumentoModalRef!: ElementRef;
  derivarDocumentoModal!: Modal;
  @ViewChild("notificarDocumentoModal") notificarDocumentoModalRef!: ElementRef;
  notificarDocumentoModal!: Modal;
  @ViewChild("finalizarDocumentoModal") finalizarDocumentoModalRef!: ElementRef;
  finalizarDocumentoModal!: Modal;

  documentos: any[] = [];
  documentosMostrar: any[] = [];
  loading: boolean = false;
  documentoSeleccionado: any;
  usuarioLogueado: UsuarioLogueado | undefined;
  supervisor: boolean = false;
  administrativa: boolean = false;

  //TODO: PAGINACION Y FILTRO
  nroPagina: number = 0;
  nroElementos: number = 5;

  anteriorDisabled: boolean = true;
  siguienteDisabled: boolean = false;

  filtro: string = "";


  //TODO: DERIVAR Y NOTIFICAR DOCUMENTO

  documentoDerivar: FormGroup = new FormGroup({});
  documentoNotificar: FormGroup = new FormGroup({});
  usuariosArea: any[] = []
  usuariosAreaLoading: boolean = false;
  submitted: boolean = false;

  archivoAdjunto?: File;

  acciones = {
    derivar: 1,
    notificar: 2,
    finalizar: 3
  }

  constructor(private documentoService: DocumentoService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.initAll();
    this.obtenerDocumentos();
    this.obtenerUsuariosArea();
  }

  ngAfterViewInit(): void {
    this.derivarDocumentoModal = new Modal(this.derivarDocumentoModalRef.nativeElement);
    this.notificarDocumentoModal = new Modal(this.notificarDocumentoModalRef.nativeElement);
    this.finalizarDocumentoModal = new Modal(this.finalizarDocumentoModalRef.nativeElement);
  }

  ngOnDestroy(): void {
    console.log("Destroy")
    this.documentosMostrar = [];
    this.documentos = [];
  }

  initAll() {
    this.documentos = [];
    this.documentosMostrar = [];
    this.usuarioLogueado = this.usuarioService.getUsuarioLogueado();
    this.supervisor = this.usuarioLogueado.rol.rol === "Supervisor" ? true : false;
    this.administrativa = this.usuarioLogueado.area.area === "Administrativa" ? true : false;

    this.documentoDerivar = new FormGroup({
      usuarioAsignado: new FormControl("0", [Validators.pattern(new RegExp("[^0]"))])
    })

    this.documentoNotificar = new FormGroup({
      archivoAdjunto: new FormControl([], [Validators.required])
    })
  }

  obtenerDocumentos() {
    this.loading = false;
    this.documentoService.obtenerDocumentoDeUsuarioLogueado(this.usuarioLogueado?.codigo!)
      .subscribe({
        next: (data) => this.documentos = data,
        error: (err) => console.error(err),
        complete: () => this.parsearDatos()
      })
  }

  obtenerUsuariosArea(){
    const areaUsuario: number = this.usuarioLogueado?.area.codigo;
    const areaCodigo = areaUsuario === 2  ? 1 : 2;

    this.usuarioService.obtenerUsuariosArea(areaCodigo).subscribe({
      next: (data) => this.usuariosArea = data,
      error: (err) => console.error(err)
    })
  }

  parsearDatos() {
    this.documentosMostrar = this.documentos;

    this.documentosMostrar.forEach(documento => {
      documento.fechaDocumento = this.parsearFecha(documento.fechaDocumento);
      documento.fechaCreacion = documento.fechaCreacion === null ? "No creado" : this.parsearFecha((documento.fechaCreacion));
      documento.fechaDerivacion === null ? documento.fechaDerivacion = "No Derivado" : this.parsearFecha(documento.fechaDerivacion);
      documento.fechaNotificacion = documento.fechaNotificacion === null ? "No Notificado" : this.parsearFecha((documento.fechaNotificacion));
      documento.fechaFinalizacion = documento.fechaFinalizacion === null ? "No Finalizado" : this.parsearFecha((documento.fechaFinalizacion));
    })

    this.loading = true;

    console.log(this.documentosMostrar);
  }
  parsearFecha(fecha: any): any {
    const fechaJs = new Date(fecha);
    let mes = "";

    if (fechaJs.getMonth() + 1 < 10) mes = `0${fechaJs.getMonth() + 1}`;
    else mes = `${fechaJs.getMonth() + 1}`;

    const fechaFinal = `${fechaJs.getDate()}/${mes}/${fechaJs.getFullYear()}`;

    return fechaFinal;
  }

  setNroElementos(nroelementos: string) {
    const _nroElementos: number = parseInt(nroelementos);
    this.nroElementos = _nroElementos;
    this.nroPagina = 0;
    this.resetTabla();
  }

  setFiltro(filtro: string) {
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

  verDocumento(documento: any) {
    this.documentoSeleccionado = documento;
  }

  setDocumentoSeleccionado(documento: any) {
    this.documentoSeleccionado = documento;
  }

  eliminarDocumento() {

    this.documentoService.eliminarDocumento(this.documentoSeleccionado.codigo).subscribe({
      next: () => this.obtenerDocumentos(),
      error: (err) => console.error(err),
      complete: () => {
        console.log("Documento Eliminado");
      }
    })
  }

  abrirModal(modalRef: number, abrir: boolean, documento?: any) {

    documento ? this.setDocumentoSeleccionado(documento) : "";

    switch (modalRef) {
      case this.acciones.derivar: {
        abrir ? this.derivarDocumentoModal.show() : this.derivarDocumentoModal.hide();
        break;
      }

      case this.acciones.notificar: {
        abrir ? this.notificarDocumentoModal.show() : this.notificarDocumentoModal.hide();
        break;
      }

      case this.acciones.finalizar: {
        abrir ? this.finalizarDocumentoModal.show() : this.finalizarDocumentoModal.hide();
      }
    }
  }

  derivarDocumento() {
    this.submitted = true;

    if (this.documentoDerivar.valid) {
      //TODO: DERIVAR DOCUMENTO
      this.abrirModal(1, false);

      const asignarUsuario: AsignarUsuario = {
        idDocumento: this.documentoSeleccionado.codigo,
        idUsuarioAsignado: this.documentoDerivar.get('usuarioAsignado')?.value
      }

      this.documentoService.derivarDocumento(asignarUsuario).subscribe({
        next: (data) => console.log(data),
        error: (err) => console.error(err),
        complete: () => {
          this.obtenerDocumentos();
          this.submitted = false;
        }
      })

    }
  }

  archivoAdjuntoSeleccionado(event: any) {
    console.log(event.target.files[0]);
    this.archivoAdjunto = <File>event.target.files[0];
  }

  notificarDocumento(){
    this.submitted = true;

    if(this.documentoNotificar.valid) {
      //TODO: NOTIFICAR DOCUMENTO
      this.abrirModal(2, false);

      const formData = new FormData();
      formData.append("idDocumento", this.documentoSeleccionado.codigo);
      formData.append("usuarioAnterior", this.documentoSeleccionado.usuarioAnterior);
      formData.append("archivoAdjunto", this.archivoAdjunto!, this.archivoAdjunto!.name);

      this.documentoService.notificarDocumento(formData).subscribe({
        next: (data) => console.log(data),
        error: (err) => console.error(err),
        complete: () => {
          this.obtenerDocumentos();
          this.submitted = false;
        }
      })
    }

    else alert("Something went wrong");
  }

  finalizarDocumento() {
    this.abrirModal(3, false);

    this.documentoService.finalizarDocumento(this.documentoSeleccionado.codigo).subscribe({
      next: (data) => console.log(data),
      error: (err) => console.error(err),
      complete: () => {
        this.obtenerDocumentos();
        this.submitted = false;
      }
    })
  }
}

export interface AsignarUsuario {
  idDocumento: number;
  idUsuarioAsignado: number;
}