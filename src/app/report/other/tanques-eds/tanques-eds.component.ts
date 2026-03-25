import { TanquesDeCombustible } from './../../../Class/tanques-de-combustible';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tanques-eds',
  templateUrl: './tanques-eds.component.html',
  styleUrls: ['./tanques-eds.component.css']
})
export class TanquesEdsComponent implements OnInit {

    @Input() dataTanqueEds: TanquesDeCombustible[]=[];

  constructor() { }

  ngOnInit(): void {
  }

}
