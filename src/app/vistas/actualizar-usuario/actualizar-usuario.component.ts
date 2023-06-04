import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css']
})
export class ActualizarUsuarioComponent implements OnInit {

  imagenSeleccionado?: File
  usuarioRequest?: FormGroup

  contraseniaForm: FormGroup = new FormGroup({
    contrasenia: new FormControl("", [Validators.required]),
    confirmarContrasenia: new FormControl("", [Validators.required]),
  });

  usuario: any
  usuarioId: number = 0;
  contraIncompatibles: boolean | undefined;
  initModal: boolean | undefined;
  errorContraText = "";
  contrasenia = "";

  constructor(private rutaActiva: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.usuarioId = this.rutaActiva.snapshot.params['codigo'];

    this.usuarioService.verUsuarioAux(this.usuarioId).subscribe((data) => {
      this.usuario = data;
    }, (err) => console.error(err), () => this.cargarDatosUsuario());

    this.initModal = true;
  }

  cargarDatosUsuario() {

    this.usuarioRequest = new FormGroup({
      codigo: new FormControl(this.usuario.codigo, [Validators.required]),
      nombre: new FormControl(this.usuario.nombre, [Validators.required]),
      apellidos: new FormControl(this.usuario.apellidos, [Validators.required]),
      tipoIdentidad: new FormControl(this.usuario.tipoIdentidad.codigo, [Validators.required]),
      nroIdentidad: new FormControl(this.usuario.nroIdentidad, [Validators.required]),
      telefono: new FormControl(this.usuario.telefono, [Validators.required]),
      correo: new FormControl(this.usuario.correo, [Validators.required]),
      area: new FormControl(this.usuario.area.codigo, [Validators.required]),
      rol: new FormControl(this.usuario.rol.codigo, [Validators.required]),
      usuario: new FormControl(this.usuario.usuario, [Validators.required]),
      contrasenia: new FormControl(this.usuario.contrasenia),
      active: new FormControl(this.usuario.active, [Validators.required]),
    })

    this.guardarImagenUsuarioActual();
  }

  guardarImagenUsuarioActual() {
    const base64String = 'data:image/jpeg;base64,' + this.usuario.avatar;
    this.imagenSeleccionado = this.base64ToFile(base64String);
  }

  base64ToFile(base64String: string) {
    const parts = base64String.split(';base64,');
    const type = parts[0].split(':')[1];
    const base64 = decodeURIComponent(parts[1]);
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: type });
    const file = new File([blob], "");
    return file;
  }

  archivoSeleccionado(event: any) {
    this.imagenSeleccionado = event.target.files[0];
  }

  actualizarUsuario() {
    if (this.usuarioRequest?.valid) {
      this.usuarioService.actualizarUsuario(this.crearYObtenerUsuarioRequest()).subscribe((data) => {
        alert("Usuario editado exitosamente...")
        this.router.navigateByUrl("/lista-usuarios");
      }, (err) => console.error(err));
    } else {
      alert("Complete todos campos")
    }
  }

  crearYObtenerUsuarioRequest(): FormData {

    const formData = new FormData();
    formData.append("codigo", this.usuarioRequest?.get("codigo")!.value);
    formData.append("nombre", this.usuarioRequest?.get("nombre")!.value);
    formData.append("apellidos", this.usuarioRequest?.get("apellidos")!.value);
    formData.append("tipoIdentidad", this.usuarioRequest?.get("tipoIdentidad")!.value == "1" ? "DNI" : "Pasaporte");
    formData.append("nroIdentidad", this.usuarioRequest?.get("nroIdentidad")!.value);
    formData.append("telefono", this.usuarioRequest?.get("telefono")!.value);
    formData.append("correo", this.usuarioRequest?.get("correo")!.value);
    formData.append("avatar", this.imagenSeleccionado!, this.imagenSeleccionado!.name);
    formData.append("area", this.usuarioRequest?.get("area")!.value == "1" ? "Operativa" : "Administrativa");
    formData.append("rol", this.usuarioRequest?.get("rol")!.value == "1" ? "Supervisor" : "Gestor");
    formData.append("usuario", this.usuarioRequest?.get("usuario")!.value);
    formData.append("contrasenia", this.usuarioRequest?.get("contrasenia")!.value);
    formData.append("active", this.usuarioRequest?.get("active")!.value.toString());

    return formData;
  }

  actualizarContrasenia() {
    if (this.contraseniaForm.valid) {
      this.usuarioRequest?.get("contrasenia")?.setValue(this.contraseniaForm.get("contrasenia")?.value);
      this.limpiarEstilosCaja();
      this.contraseniaForm.reset();
    } else {
      alert("Complete todos los campos");
    }
  }

  validarContrasenias() {
    this.initModal = false;

    const contrasenia1 = this.contraseniaForm?.get("contrasenia")?.value;
    const confirmarContrasenia = this.contraseniaForm?.get("confirmarContrasenia")?.value;

    if (contrasenia1 !== confirmarContrasenia) {
      this.contraIncompatibles = true;
      this.errorContraText = "No coinciden";
    } else {
      this.contraIncompatibles = false;
      this.errorContraText = "";
    }
  }

  limpiarEstilosCaja() {
    const modal_form_inputs = document.querySelectorAll("#modal_form input");

    modal_form_inputs.forEach(input => {
      input?.classList.contains("is-valid") ? input?.classList.remove("is-valid") : "";
      input?.classList.contains("is-invalid") ? input?.classList.remove("is-invalid") : "";
    })
  }
}
