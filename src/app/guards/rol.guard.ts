import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const permiso: boolean = this.checkUserPermission(route);

    if (!permiso) {
      this.router.navigateByUrl("/forbidden");
    }

    return permiso;
  }

  checkUserPermission(route: ActivatedRouteSnapshot): boolean {
    const { rol } = this.usuarioService.getUsuarioLogueado().rol;
    return rol.toString().toLowerCase() === route.data['rol'] ? true : false
  }

}


