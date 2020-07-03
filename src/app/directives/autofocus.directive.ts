import { Directive, AfterViewInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  innerWidth;
  constructor(
    private el: ElementRef
  ) {
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    if (this.innerWidth > 576) {
      this.el.nativeElement.focus();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
