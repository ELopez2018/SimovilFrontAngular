import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLatestFocus]'
})
export class LatestFocusDirective {

  constructor(
    private elementRef: ElementRef,
    private model: NgControl
  ) { }


  @HostListener('focus') onFocus() {
    if (!(this.model.control.value > 0))
      this.elementRef.nativeElement.setSelectionRange(this.elementRef.nativeElement.value.length, this.elementRef.nativeElement.value.length);
  }
}
