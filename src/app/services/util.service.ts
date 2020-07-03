import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { focusById } from '../util/util-lib';

@Injectable()
export class UtilService {
  private confirmMessageSource = new Subject<any>();
  private confirmResultSource = new Subject<boolean>();
  private loaderStatus = new Subject<boolean>();

  cofirmMessage$ = this.confirmMessageSource.asObservable();
  confirmResult$ = this.confirmResultSource.asObservable();
  loader$ = this.loaderStatus.asObservable();

  confirmResult(response: boolean) {
    this.confirmResultSource.next(response);
  }

  /**
   * Modal de confirmación
   * @param message Mensaje a mostrar
   * @param result Callback "true,false,null"
   * @param option Array con dos opciones a seleccionar
   */
  confirm(message: string, result, option?: string[]) {
    setTimeout(() => {
      focusById('cm2', true);
    }, 10);
    this.confirmMessageSource.next({ message: message, option: option });
    const subscription = this.confirmResult$.subscribe(e => {
      result(e);
      subscription.unsubscribe();
    });
  }

  loader(value: boolean = true) {
    this.loaderStatus.next(value);
  }

}
