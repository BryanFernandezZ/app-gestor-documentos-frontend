import { Component, OnInit } from '@angular/core';
import { DocumentoService } from 'src/app/servicios/documento.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  responseDocumentos: any;
  responseUsuarios: any;

  totalDocumentos: number = 0;
  totalUsuarios: number = 0;

  constructor(private documentoService: DocumentoService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.documentoService.obtenerCantidadDocumentos().subscribe({
      next: (data) => this.responseDocumentos = data,
      error: (err) => console.error(err),
      complete: () => {
        const { totalDocumentos } = this.responseDocumentos;
        this.totalDocumentos = totalDocumentos;
      }
    })

    this.usuarioService.obtenerCantidadUsuarios().subscribe({
      next: (data) => this.responseUsuarios = data,
      error: (err) => console.error(err),
      complete: () => {
        const { totalUsuarios } = this.responseUsuarios;
        this.totalUsuarios = totalUsuarios;
      }
    })
  }

}
