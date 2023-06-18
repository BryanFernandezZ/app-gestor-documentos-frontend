import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuarioLogueado: UsuarioLogueado | undefined

  categorias: any[]
  isLoading: boolean = false;
  supervisor: boolean = false;
  area: boolean = false;

  constructor(private categoriaService: CategoriaService,
    private authService: AuthService,
    private tipoDocumentoService: TipoDocumentoService,
    private usuarioService: UsuarioService,
    private router: Router) {
    this.categorias = [];
  }
  

  ngOnInit(): void {
    this.initCategorias();
    this.initUsuarioLogueado();
  }

  ngOnDestroy(): void {
    this.usuarioLogueado = undefined;
  }

  initCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(
      (data) => this.categorias = data,
      (err) => console.error(err)
    )
  }

  initUsuarioLogueado() {
    const token: string = localStorage.getItem("acctkn")!;
    token !== null ? this.authService.obtenerUsuario(token).subscribe({
      next: (data) => this.usuarioLogueado = data,
      error: (err) => console.error(err),
      complete: () => {
        const { rol } = this.usuarioLogueado?.rol;
        const { area } = this.usuarioLogueado?.area;
        this.supervisor = rol.toString().toLowerCase() === "supervisor" ? true : false;
        this.area = area.toString().toLowerCase() === "administrativa"? true : false;
        this.usuarioService.setUsuarioLogueado(this.usuarioLogueado!);
      }
    })
      : this.router.navigateByUrl("/login");
  }

  guardarTipoDocumento(e: any) {
    e.preventDefault();

    const categoria = document.querySelector<HTMLSelectElement>("#categoria_select");
    const tipo_documento = document.querySelector<HTMLInputElement>("#tipo_documento");


    if (categoria?.selectedIndex !== 0 && tipo_documento?.value !== "") {
      this.tipoDocumentoService.guardarTipoDocumento({
        tipoDocumento: tipo_documento?.value,
        categoria: {
          codigo: categoria?.selectedIndex
        }
      }).subscribe(
        (data) => alert("Guardado con exito"),
        (err) => console.error(err),
        () => {
          this.resetForm();
          this.router.navigateByUrl("/lista-documentos");
        }
      );

    } else {
      if (categoria?.selectedIndex === 0 && tipo_documento?.value === "") {
        console.log("categoria y tipodocumento");
        this.mostrarErrores([categoria, tipo_documento]);
      }
      else if (categoria?.selectedIndex === 0) {
        console.log("categoria");
        this.mostrarErrores([categoria]);
      }
      else {
        console.log("tipodocumento");
        this.mostrarErrores([tipo_documento]);
      }

      alert("Complete todos los campos");
    }
  }

  mostrarErrores(elements: any[]) {
    elements.forEach(element => element.classList.add("is-invalid"));
  }

  limpiarErrores(element: any) {
    element.classList.remove("is-invalid");
  }

  resetForm() {
    const categoria = document.querySelector<HTMLSelectElement>("#categoria_select");
    const tipo_documento = document.querySelector<HTMLInputElement>("#tipo_documento");

    categoria!.selectedIndex = 0;
    tipo_documento!.value = "";
  }

  cerrarSesion() {
    this.isLoading = true;
    setTimeout(() => {
      localStorage.removeItem("acctkn");
      this.router.navigateByUrl("/login");
      this.isLoading = false;
    }, 3000)
  }

  mostrarSidebar(): boolean {
    const bodyWidth: number = document.body.clientWidth;
    if(bodyWidth > 1060) return true;
    return false;
  }
}


export interface UsuarioLogueado {
  codigo: number;
  nombre: string;
  apellidos: string;
  avatar: any;
  rol: any; 
  area: any;
}