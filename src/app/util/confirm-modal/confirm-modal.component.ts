import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  animations: [fadeTransition()]
})
export class ConfirmModalComponent implements OnInit {

  dialog = "";
  option: string[] = ['Sí', 'No'];
  ajust = false;
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.utilService.cofirmMessage$.subscribe(e => {
      this.dialog = e.message;
      if (e.option != null) {
        this.option = e.option;
        this.ajust = true;
      } else {
        this.option = ['Sí', 'No'];
        this.ajust = false;
      }
    });
  }

  response(value: boolean) {
    // this.result.emit(value);
    this.utilService.confirmResult(value);
    this.dialog = "";
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.response(null);
    }
  }

  get itemRes() {
    return ''
  }
}
