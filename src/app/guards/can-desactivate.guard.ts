import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate';

@Injectable({
  providedIn: 'root'
})
export class CanDesactivateGuard  {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    if (!component.canDeactivate()) {
      if (confirm("No ha guardado los cambios, ¿desea salir de la página actual?"))
        return true;
      else
        return false;
    }
    return true;
  }
}