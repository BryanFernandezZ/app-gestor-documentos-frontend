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

  constructor(private usuarioService: UsuarioService) {
    this.usuarios = [];
    this.usuariosMostrar = [];
    this.usuariosMostrar$ = new Subject();
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.usuariosMostrar$.next(this.usuarios);
        this.usuariosMostrar = this.usuarios;
      },
      (err) => console.error(err),
      () => this.loading = true
    )
  }

  filtrarUsuarios(event: any) {
    const filtro = event.target.value;
    const usuariosFiltrados = this.usuarios.filter(
      usuario => usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
      usuario.apellidos.toLowerCase().includes(filtro.toLowerCase())
    );
    this.usuariosMostrar$.next(usuariosFiltrados);
    this.usuariosMostrar = usuariosFiltrados;
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
