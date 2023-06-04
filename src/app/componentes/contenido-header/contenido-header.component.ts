import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contenido-header',
  templateUrl: './contenido-header.component.html',
  styleUrls: ['./contenido-header.component.css']
})
export class ContenidoHeaderComponent implements OnInit {

  @Input() titulo: string

  constructor() {
    this.titulo = "";
  }

  ngOnInit(): void {
  }

}
