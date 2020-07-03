import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-add-menu',
  templateUrl: './product-add-menu.component.html',
  styleUrls: ['./product-add-menu.component.css']
})
export class ProductAddMenuComponent implements OnInit {

    tabs;
    constructor() { }

    ngOnInit() {
      this.tabs = [
        { estado: true, classTab: '' },
        { estado: false, classTab: '' },
        { estado: false, classTab: '' },
        { estado: false, classTab: '' },
      ];
      this.setTab(this.tabs);
    }

    setTab(tabl) {
      tabl.forEach(element => {
        if (element.estado === true) {
          element.classTab = 'active';
          element.classPane = 'show active';
        } else {
          element.classTab = '';
          element.classPane = '';
        }
      });
    }

    tabClass(value: number) {
      if (this.tabs[value].estado === true) {
        return;
      } else {
        this.tabs.forEach(e => {
          e.estado = false;
          e.classTab = '';
        });
        if (this.tabs[value].estado === false) {
          this.tabs[value].estado = true;
          this.tabs[value].classTab = 'active';
        }
      }
      // if (value == 1) {
      //   this.getclientsPending();
      // }
    }
  }
