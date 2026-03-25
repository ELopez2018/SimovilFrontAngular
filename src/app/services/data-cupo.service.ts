import { CarteraService } from './cartera.service';
import { tap } from 'rxjs/operators';
import { EntCupo } from './../Class/EntCupo';
import { Parametros } from './../Class/Parametros';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderParametersToGet } from '../util/util-lib';

@Injectable({
  providedIn: 'root'
})
export class DataCupoService {

  alertaCupoConsumido: boolean;
  idEstacion: number;

  constructor() {}
}
