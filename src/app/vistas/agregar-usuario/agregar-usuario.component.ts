import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {

  imagenSeleccionado?: File;
  usuarioRequest: FormGroup = new FormGroup({
    nombre: new FormControl("", [Validators.required]),
    apellidos: new FormControl("", [Validators.required]),
    tipoIdentidad: new FormControl("", [Validators.required]),
    nroIdentidad: new FormControl("", [Validators.required]),
    telefono: new FormControl("", [Validators.required]),
    correo: new FormControl("", [Validators.required, Validators.email]),
    area: new FormControl("", [Validators.required]),
    rol: new FormControl("", [Validators.required]),
    usuario: new FormControl("", [Validators.required]),
    contrasenia: new FormControl("", [Validators.required]),
  });

  regexPatterns: any = {
    contrasenia: new RegExp("(?=.*[\\!@#$%^&*()\\\\{}\\-_+=~`|:;\"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{5,}"),
    correo: new RegExp("[A-Za-z0-9+_.-]+@[a-z]+.(com)"),
  }

  mensaje: string = "";

  errors: any = {
    nombre: {
      nombre: "nombre",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    apellidos: {
      nombre: "apellidos",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    tipoIdentidad: {
      nombre: "tipoIdentidad",
      valido: false,
      mensaje: this.mensaje,
      dropdown: true
    },
    nroIdentidad: {
      nombre: "nroIdentidad",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    telefono: {
      nombre: "telefono",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    correo: {
      nombre: "correo",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    area: {
      nombre: "area",
      valido: false,
      mensaje: this.mensaje,
      dropdown: true
    },
    rol: {
      nombre: "rol",
      valido: false,
      mensaje: this.mensaje,
      dropdown: true
    },
    usuario: {
      nombre: "usuario",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    contrasenia: {
      nombre: "contrasenia",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    },
    confirmarContrasenia: {
      nombre: "confirmarContrasenia",
      valido: false,
      mensaje: this.mensaje,
      dropdown: false
    }
  }

  maxLength: number = 8;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.getImageFile().then(image => {
      this.imagenSeleccionado = image;
    });
  }

  noExistenErrores(): boolean {
    let response = true;
    Object.values(this.errors).forEach((error: any) => {
      if (!error['valido']) response = false;
    });

    return response;
  }

  guardarUsuario() {
    if (this.noExistenErrores()) { //this.usuarioRequest.valid
      this.usuarioService.guardarUsuario(this.crearYObtenerUsuarioRequest()).subscribe((data) => {
        this.usuarioRequest.reset();
        alert("Usuario guardado con exito...");
        this.router.navigateByUrl("/lista-usuarios");
      }, (err) => console.error(err)
      )
    } else {
      Object.values(this.errors).forEach((error: any) => {
        // error['valido'] ? this.toggleErrors(error['nombre'], true, "Correcto") : this.toggleErrors(error['nombre'], false, "Campo Obligatorio");
        if (!error['valido']) {
          if (!error['dropdown']) {
            if (error['nombre'] === "confirmarContrasenia") {
              const confirmar_contrasenia = document.querySelector<HTMLInputElement>("#confirmar_contrasenia")!;
              if (confirmar_contrasenia?.value.length > 0) this.toggleErrors(error['nombre'], error['valid'], error['mensaje']);
              else this.toggleErrors(error['nombre'], error['valid'], "Campo Obligatorio");
            } else {
              if (this.usuarioRequest.get(error['nombre'])?.value.length > 0) this.toggleErrors(error['nombre'], error['valid'], error['mensaje']);
              else this.toggleErrors(error['nombre'], error['valid'], "Campo Obligatorio");
            }
          } else {
            const tipoIdentidad = this.usuarioRequest.get(error['nombre'])?.value;
            if (tipoIdentidad !== "1" && tipoIdentidad !== "2") {
              this.toggleErrors(error['nombre'], false, "Campo Obligatorio");
            } else this.toggleErrors(error['nombre'], error['valid'], error['mensaje']);
          }

        }
        //else this.toggleErrors(error['nombre'], true, "Correcto")
      }
      );
      alert("Something went wrong. Please, try again.");
    }
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

  validarInput(key: string, length: number, dropdown?: boolean, selectedIndex?: number) {

    if (key !== "nroIdentidad" && key !== "telefono" && key !== "correo" && key !== "contrasenia" && key !== "confirmarContrasenia") {
      //TODO: PARA CAMPOS VACIOS
      if (!dropdown) {
        if (length !== 0) this.toggleErrors(key, true, "Correcto");
        else this.toggleErrors(key, false, "");
      } else {
        if (key === "tipoIdentidad") {
          this.usuarioRequest.get("nroIdentidad")?.setValue("");
          this.maxLengthNroIdentidad();
        }
        if (selectedIndex !== 0) this.toggleErrors(key, true, "Correcto.");
        else {
          this.toggleErrors('nroIdentidad', false, "");
          this.toggleErrors(key, false, "");
        }
      }
    } else {
      if (key == "nroIdentidad") {

        //TODO: PARA CANTIDAD DE CARACTERES
        if (length > 0) {
          if (this.usuarioRequest.get("tipoIdentidad")!.value == "1") {
            if (length === 8) this.toggleErrors(key, true, "Correcto");
            else this.toggleErrors(key, false, "Este campo debe contener ocho dígitos.");

          } else if (this.usuarioRequest.get("tipoIdentidad")!.value == "2") {
            if (length === 10) this.toggleErrors(key, true, "Correcto");
            else this.toggleErrors(key, false, "Este campo debe contener diez dígitos.");

          } else this.toggleErrors(key, false, "");

        } else this.toggleErrors(key, false, "");

      } else if (key == "telefono") {
        if (length > 0) {
          if (length !== 9) this.toggleErrors(key, false, "Este campo debe contener nueve dígitos.");
          else this.toggleErrors(key, true, "Correcto");
        } else this.toggleErrors(key, false, "");

      } else if (key == 'correo') {
        if (length > 0) {
          const correo = this.usuarioRequest.get("correo")?.value;
          if (!this.regexPatterns['correo'].test(correo)) this.toggleErrors(key, false, "Este campo no es un correo válido.");
          else this.toggleErrors(key, true, "Correcto");
        } else this.toggleErrors(key, false, "");

      } else if (key == 'contrasenia') {
        if (length > 0) {
          const contrasenia = this.usuarioRequest.get("contrasenia")?.value;
          if (!this.regexPatterns['contrasenia'].test(contrasenia)) this.toggleErrors(key, false, "Este campo debe contener por lo menos una mayúscula y un símbolo.");
          else this.toggleErrors(key, true, "Correcto");
        } else this.toggleErrors(key, false, "");

      } else if (key == 'confirmarContrasenia') {
        if (length > 0) {
          const contrasenia = this.usuarioRequest.get("contrasenia")?.value;
          const confirmar_contrasenia = document.querySelector<HTMLInputElement>("#confirmar_contrasenia")!.value;
          if (!this.regexPatterns['contrasenia'].test(confirmar_contrasenia)) this.toggleErrors(key, false, "Este campo debe contener por lo menos una mayúscula y un símbolo.");
          else if (confirmar_contrasenia !== contrasenia) this.toggleErrors(key, false, "Las contraseñas no coinciden.");
          else {
            this.toggleErrors(key, true, "Correcto");
          }
        }
        else this.toggleErrors(key, false, "");
      }
    }
  }

  maxLengthNroIdentidad() {
    const tipo_identidad = document.querySelector<HTMLSelectElement>("#tipo_identidad")!.selectedIndex;

    switch (tipo_identidad) {
      case 1: this.maxLength = 8; break;
      case 2: this.maxLength = 10; break;
      default: this.maxLength = 8; break;
    }
  }

  toggleErrors(control: string, error: boolean, mensaje: string) {
    this.errors[control]['valido'] = error;
    this.errors[control]['mensaje'] = mensaje;
  }
}