import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.css']
})
export class FieldsetComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() cTitle: string;
  @Input() cTexto: string;
  @Output() showChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  changeShow() {
    this.show = !this.show;
    this.showChange.emit(this.show);
  }

}
