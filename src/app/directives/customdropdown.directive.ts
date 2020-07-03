import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCustomdropdown]'
})
export class CustomdropdownDirective {
  private isOpen: boolean = false;
  constructor(private _el: ElementRef) {

  }

  @HostBinding('class.show') get opened() {
    return this.isOpen;
  }
  @HostListener('click') open() {
    // this.isOpen = true;
    // this._el.nativeElement.querySelector('.dropdown-menu').classList.add('show')                
    if (this.isOpen == false) {
      this.isOpen = true;
      this._el.nativeElement.querySelector('.dropdown-menu').classList.add('show');
    } else {
      this.isOpen = false;
      this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
    };
  }
  @HostListener('document:click', ['$event.target']) close(targetElement) {
    let inside: boolean = this._el.nativeElement.contains(targetElement);
    if (!inside) {
      this.isOpen = false;
      this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
    }
  }
}
