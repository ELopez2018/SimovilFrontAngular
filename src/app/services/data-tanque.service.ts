import { TanquesDeCombustible } from './../Class/tanques-de-combustible';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTanqueService {

    tanque: TanquesDeCombustible[]=[];

  constructor() { }
}
