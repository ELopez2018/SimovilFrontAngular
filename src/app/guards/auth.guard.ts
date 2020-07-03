import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { RBAC } from '../Class/RBAC';
import { BasicDataService } from '../services/basic-data.service';

const rbac = RBAC;

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private basicDataService: BasicDataService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.storageService.isAuthenticated())
      return this.validUrl(state.url);
    else
      this.router.navigate(['login'], { queryParams: { destination: state.url } });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.storageService.isAuthenticated())
      return this.validUrl(state.url);
    else
      this.router.navigate(['login'], { queryParams: { destination: state.url } });
  }

  validUrl(url: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (this.basicDataService.uploadRoutes > 0) {
        observer.next(this.basicDataService.checkPermisionUrl(url));
        observer.complete();
      } else {
        this.basicDataService.okAllowedRoutes.subscribe((data) => {
          observer.next(this.basicDataService.checkPermisionUrl(url));
          observer.complete();
        });
      }
    });
  }
}
