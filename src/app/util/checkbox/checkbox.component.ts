import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor {

  propagateChange = (_: any) => { };
  @Input() boolValue = false;
  @Input() id;

  writeValue(value: any) {
    if (value !== undefined) {
      this.boolValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  constructor() { }

  ngOnInit() {
  }

  changeValue() {
    this.boolValue = !this.boolValue;
    this.propagateChange(this.boolValue);
  }

}
