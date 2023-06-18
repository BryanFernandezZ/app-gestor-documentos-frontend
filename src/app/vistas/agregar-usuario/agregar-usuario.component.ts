import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {

  imagenSeleccionado?: File;

  maxLength: number = 8;

  regexPatterns = {
    contrasenia: new RegExp("(?=.*[\\!@#$%^&*()\\\\{}\\-_+=~`|:;\"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{5,}")
  }

  usuarioRequest: FormGroup = new FormGroup({});

  mensaje: string = "";
  submitted: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.initUsuarioRequest()
    this.getImageFile().then(image => {
      this.imagenSeleccionado = image;
    });
  }

  initUsuarioRequest() {
    this.usuarioRequest = new FormGroup({
      nombre: new FormControl("", [Validators.required]),
      apellidos: new FormControl("", [Validators.required]),
      tipoIdentidad: new FormControl("0", [Validators.required, Validators.pattern(new RegExp("[^0]"))]),
      nroIdentidad: new FormControl("", [Validators.required, Validators.pattern(new RegExp("[0-9]+")),
      Validators.minLength(this.maxLength)]),
      telefono: new FormControl("", [Validators.required, Validators.pattern(new RegExp("[0-9]+")), Validators.minLength(9)]),
      correo: new FormControl("", [Validators.required, Validators.email]),
      area: new FormControl("0", [Validators.required, Validators.pattern(new RegExp("[^0]"))]),
      rol: new FormControl("0", [Validators.required, Validators.pattern(new RegExp("[^0]"))]),
      usuario: new FormControl("", [Validators.required]),
      contrasenia: new FormControl("", [Validators.required, Validators.pattern(this.regexPatterns.contrasenia)]),
      confirmarContrasenia: new FormControl("", [Validators.required, Validators.pattern(this.regexPatterns.contrasenia)]),
    });
  }

  guardarUsuario() {
    this.submitted = true;
    const contrasenia = this.usuarioRequest.get("contrasenia")?.value;
    const confirmarContrasenia = this.usuarioRequest.get("confirmarContrasenia")?.value;
    const samePasswords: boolean = contrasenia === confirmarContrasenia;

    if (this.usuarioRequest.valid && samePasswords) {
      this.usuarioService.guardarUsuario(this.crearYObtenerUsuarioRequest()).subscribe({
        next: (data) => console.log("Guardando..."),
        error: (err) => console.error(err),
        complete: () => {
          this.usuarioRequest.reset();
          alert("Usuario guardado con exito...");
          this.router.navigateByUrl("/lista-usuarios");
        }
      })
    } else {
      console.log(this.usuarioRequest.get('contrasenia')?.errors);
      alert("Something went wrong. Please, try again.");
    }
  }

  cambiarMaxlength(tipoIdentidad: string) {
    parseInt(tipoIdentidad) === 1 ? this.maxLength = 8 : this.maxLength = 10;
    this.usuarioRequest.get("nroIdentidad")?.reset();
  }

  crearYObtenerUsuarioRequest(): FormData {
    const formData = new FormData();
    formData.append("nombre", this.usuarioRequest.get("nombre")!.value);
    formData.append("apellidos", this.usuarioRequest.get("apellidos")!.value);
    formData.append("tipoIdentidad", this.usuarioRequest.get("tipoIdentidad")!.value == 1 ? "DNI" : "Pasaporte");
    formData.append("nroIdentidad", this.usuarioRequest.get("nroIdentidad")!.value);
    formData.append("telefono", this.usuarioRequest.get("telefono")!.value);
    formData.append("correo", this.usuarioRequest.get("correo")!.value);
    formData.append("avatar", this.imagenSeleccionado!, this.imagenSeleccionado!.name);
    formData.append("area", this.usuarioRequest.get("area")!.value == 1 ? "Operativa" : "Administrativa");
    formData.append("rol", this.usuarioRequest.get("rol")!.value == 1 ? "Supervisor" : "Gestor");
    formData.append("usuario", this.usuarioRequest.get("usuario")!.value);
    formData.append("contrasenia", this.usuarioRequest.get("contrasenia")!.value);

    return formData;
  }

  async getImageFile(): Promise<File> {
    const response = await fetch('/assets/img/temporal-profile-picture.jpg');
    const blob = await response.blob();
    const file = new File([blob], 'temporal-profile-picture.jpg');
    return file;
  }

  archivoSeleccionado(event: any) {
    this.imagenSeleccionado = <File>event.target.files[0];
  }
}