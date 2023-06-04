import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './vistas/home/home.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { ListaUsuariosComponent } from './vistas/lista-usuarios/lista-usuarios.component';
import { ContenidoHeaderComponent } from './componentes/contenido-header/contenido-header.component';
import { ListaDocumentosComponent } from './vistas/lista-documentos/lista-documentos.component';
import { AgregarUsuarioComponent } from './vistas/agregar-usuario/agregar-usuario.component';
import { LoginComponent } from './vistas/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizarUsuarioComponent } from './vistas/actualizar-usuario/actualizar-usuario.component';
import { AgregarDocumentoComponent } from './vistas/agregar-documento/agregar-documento.component';
import { ActualizarDocumentoComponent } from './vistas/actualizar-documento/actualizar-documento.component';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ForbiddenComponent } from './vistas/forbidden/forbidden.component';
import { TableFilterPipe } from './pipes/table-filter.pipe';
import { TextoCoincidenciaPipe } from './pipes/texto-coincidencia.pipe';
import { ReporteComponent } from './vistas/reporte/reporte.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ListaUsuariosComponent,
    ContenidoHeaderComponent,
    ListaDocumentosComponent,
    AgregarUsuarioComponent,
    LoginComponent,
    ActualizarUsuarioComponent,
    AgregarDocumentoComponent,
    ActualizarDocumentoComponent,
    ForbiddenComponent,
    TableFilterPipe,
    TextoCoincidenciaPipe,
    ReporteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
