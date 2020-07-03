import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../../routerAnimation';


@Component({
  selector: 'app-inventario-menu',
  templateUrl: './inventario-menu.component.html',
  styleUrls: ['./inventario-menu.component.css'],
  animations: [fadeTransition()]
})
export class InventarioMenuComponent implements OnInit {
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
