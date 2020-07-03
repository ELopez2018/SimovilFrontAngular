import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numeric]'
})
export class NumericDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(
    private elementRef: ElementRef,
    private model: NgControl
  ) {
    this.elementRef.nativeElement.style.textAlign = "right"
  }

  @HostListener('input') inputChange() {
    const newValue = this.unMask();
    this.model.control.setValue(newValue, {
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false,
    });
    let index = this.elementRef.nativeElement.selectionStart;
    this.ngModelChange.emit(this.unMask());
    // fix cursor position
    setTimeout(() => {
      this.elementRef.nativeElement.setSelectionRange(index, index);
    }, 0);
  }

  @HostListener('focusout') onFocusout() {
    this.unMask() == 0 ? this.model.control.setValue(0) : null;
    this.elementRef.nativeElement.value = this.addDecimals();
  }

  @HostListener('focus') onFocus() {
    if (this.model.control.value == 0)
      this.elementRef.nativeElement.setSelectionRange(0, this.elementRef.nativeElement.value.length);
    else
      this.elementRef.nativeElement.setSelectionRange(this.elementRef.nativeElement.value.length - 3, this.elementRef.nativeElement.value.length - 3);
  }

  addDecimals() {
    let value = String(this.elementRef.nativeElement.value);
    const arrayNum = value.split('.');
    arrayNum[0] = arrayNum[0].length > 1 ? arrayNum[0] : '$0';
    arrayNum[1] = arrayNum && arrayNum.length == 2 ? ('.' + arrayNum[1].replace('_', '') + '00').substring(0, 3) : '.00';
    return arrayNum[0] + arrayNum[1];
  }

  unMask() {
    // let value = Number(this.elementRef.nativeElement.value.replace(/[^\d.-]/g, '', ''));
    let value = this.elementRef.nativeElement.value.replace(/[^\d.-]/g, '', '');
    return Number.isNaN(value) ? value : Number(value);
  }
}
