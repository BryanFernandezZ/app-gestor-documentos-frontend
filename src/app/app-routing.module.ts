import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './vistas/home/home.component';
import { ListaUsuariosComponent } from './vistas/lista-usuarios/lista-usuarios.component';
import { ListaDocumentosComponent } from './vistas/lista-documentos/lista-documentos.component';
import { AgregarUsuarioComponent } from './vistas/agregar-usuario/agregar-usuario.component';
import { LoginComponent } from './vistas/login/login.component';
import { ActualizarUsuarioComponent } from './vistas/actualizar-usuario/actualizar-usuario.component';
import { AgregarDocumentoComponent } from './vistas/agregar-documento/agregar-documento.component';
import { ActualizarDocumentoComponent } from './vistas/actualizar-documento/actualizar-documento.component';
import { SesionGuard } from './guards/sesion.guard';
import { RolGuard } from './guards/rol.guard';
import { ForbiddenComponent } from './vistas/forbidden/forbidden.component';
import { ReporteComponent } from './vistas/reporte/reporte.component';

const routes: Routes = [
  { path: "login", component: LoginComponent, title: "Login" },

  {
    path: "",
    component: HomeComponent,
    title: "Home",
    canActivate: [SesionGuard]
  },
  {
    path: "lista-usuarios",
    component: ListaUsuariosComponent,
    title: "Lista de Usuarios",
    canActivate: [SesionGuard, RolGuard],
    data: {
      rol: "supervisor"
    }
  },
  {
    path: "agregar-usuario",
    component: AgregarUsuarioComponent,
    title: "Agregar Usuario",
    canActivate: [SesionGuard, RolGuard],
    data: {
      rol: "supervisor"
    }
  },
  {
    path: "actualizar-usuario/:codigo",
    component: ActualizarUsuarioComponent,
    title: "Actualizar Usuario",
    canActivate: [SesionGuard, RolGuard],
    data: {
      rol: "supervisor"
    }
  },
  {
    path: "lista-documentos",
    component: ListaDocumentosComponent,
    title: "Lista de Documentos",
    canActivate: [SesionGuard]
  },
  {
    path: "agregar-documento",
    component: AgregarDocumentoComponent,
    title: "Agregar Documento",
    canActivate: [SesionGuard]
  },
  {
    path: "actualizar-documento/:codigo",
    component: ActualizarDocumentoComponent,
    title: "Actualizar Documento",
    canActivate: [SesionGuard]
  },
  {
    path: "reporte",
    component: ReporteComponent,
    title: "Reporte",
    canActivate: [SesionGuard]
  },
  {
    path: "forbidden",
    component: ForbiddenComponent,
    title: "Sin permisos"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
