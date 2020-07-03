import { Injectable } from '@angular/core';
// import { URL_SERVICIOS } from '../../config/config';
import { NominaService } from './nomina.service';
// import { Parametros } from '../Class/Parametros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable()
export class SubirArchivoService {

  constructor(
      public _NominaService: NominaService,
      private http: HttpClient,
      private storageService: StorageService
  ) {

}
// public setHttpOption() {
//     this.httpOptions = {
//       headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
//     };
//   }
//   private httpOptions = {
//     headers: new HttpHeaders ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
//   };

  subirArchivo( archivo?: File, tipo?: any, id?: string ) {

    return new Promise( (resolve, reject ) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo, archivo.name );

      xhr.onreadystatechange = function() {

        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( xhr.response );
          }

        }
      };
      this._NominaService.InsertImage(tipo).subscribe();
    //   let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
    //   let url = 'https://simovil.mileniumgas.com:8080' + '/api/imgProducto' + this.httpOptions ;
    //   xhr.open('POS', url, true );
    //   xhr.send( formData );
    });

    // this.Parametros.GetParametros().servidorLocal + '/api/imgProducto'
    // this._NominaService.InsertImage()

  }



}
