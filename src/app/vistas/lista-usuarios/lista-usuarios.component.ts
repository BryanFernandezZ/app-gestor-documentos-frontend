import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: any[]
  usuariosMostrar: any[]
  usuariosMostrar$: Subject<any[]>
  usuarioSeleccionado: any
  loading = false;


  //TODO: PAGINACION Y FILTRO
  nroPagina: number = 0;
  nroElementos: number = 5;

  anteriorDisabled: boolean = true;
  siguienteDisabled: boolean = false;

  filtro: string = "";
  
  tableType: number = 1;

  constructor(private usuarioService: UsuarioService) {
    this.usuarios = [];
    this.usuariosMostrar = [];
    this.usuariosMostrar$ = new Subject();
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
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
    if ((this.nroPagina * this.nroElementos) + this.nroElementos >= this.usuariosMostrar.length)
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

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.usuariosMostrar$.next(this.usuarios);
        this.usuariosMostrar = this.usuarios;
        console.log(this.usuarios);
      },
      (err) => console.error(err),
      () => this.loading = true
    )
  }

  setUsuarioSeleccionado(usuario: any) {
    this.usuarioSeleccionado = usuario;
  }

  eliminarUsuario() {
    this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.codigo).subscribe((data) => {
      this.obtenerUsuarios();
    }, (err) => console.error(err));
  }

}
