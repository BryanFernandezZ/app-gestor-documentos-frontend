import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionGuard implements CanActivate {

  // constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.checkCurrentSession()) { //TODO: SI NO EXISTE USUARIO LOGUEADO
      // this.router.navigateByUrl("/login");
      window.location.href = "/login";
      return false;
    }

    return true;
  }

  checkCurrentSession(): boolean {
    const token: string = localStorage.getItem("acctkn")!;
    let isLogged: boolean = false;
    token == null ? isLogged = false : isLogged = true;
    return isLogged;
  }

}
