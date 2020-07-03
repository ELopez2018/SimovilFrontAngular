import { Component, OnInit } from '@angular/core';
import { EntProductosTraslados } from '../../../../../Class/EnProductosTraslados';
import { NominaService } from '../../../../../services/nomina.service';
import { UtilService } from '../../../../../services/util.service';
import { EntStation } from '../../../../../Class/EntStation';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../../services/storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PrincipalComponent } from '../../../../../principal/principal.component';

@Component({
    selector: 'app-intraslados',
    templateUrl: './intraslados.component.html',
    styleUrls: ['./intraslados.component.css']
})
export class IntrasladosComponent implements OnInit {
    productos: EntProductosTraslados[];
    stationsAll: EntStation[];
    stationCode;
    Usuario;
    constructor(
        private _NominaService: NominaService,
        private utilService: UtilService,
        private title: Title,
        private storageService: StorageService,
        private principal: PrincipalComponent
    ) {
        this.GetEstaciones();
        this.title.setTitle('Ventas Productos - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.Usuario = this.storageService.getCurrentUserDecode().Usuario;
        if (this.stationCode) {
            this.getProductos(this.stationCode);
        }
    }

    ngOnInit() {
    }
    getProductos(estacion?: number) {
        this.utilService.loader(true);
        this._NominaService.GetProductosTraslados(estacion).subscribe(data => {
            this.productos = data;
            this.utilService.loader(false);
        }, error => {
            console.error(error);
            this.principal.showMsg('error','CONSULTAR BRODUCTOS', error.error.message);
            this.utilService.loader(false);
        });
    }
    GetEstaciones() {

        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.error(error.error.message));
    }
    Repuesta(rep: boolean, Traslado: EntProductosTraslados) {
        if (rep) {
            Swal.fire({
                title: '¿ESTA SEGURO?',
                text: 'Esta a punto de Recibir un Traslado de Productos, debe comprobar que todos los artículos llegaron en buen estado, ¿Desea Continuar?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    this.EnviaRepuesta(Traslado, rep);
                }

            });
        } else {
            Swal.fire({
                title: '¿ESTA SEGURO?',
                text: 'Esta a punto de Rechazar un Traslado de Productos, ¿Desea Continuar?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    this.EnviaRepuesta(Traslado, rep);
                }

            });

        }

    }

    EnviaRepuesta(Traslado: EntProductosTraslados, rep: boolean, ) {
        const Datos = {
            idEstacion: this.stationCode,
            idTraslado: Traslado.id,
            repuesta: rep,
            idUsuario: this.Usuario,
            observacion: Traslado.observacionesRecibe
        };
        this._NominaService.EnviaRepuestaTraslado(Datos).subscribe(data => {
            Swal.fire(
                '¡REPUESTA ENVIADA!',
                'La Repuesta fué enviada correctamente',
                'success'
            );
            this.getProductos(this.stationCode);
        }, error => {
            Swal.fire(
                'NO SE GUARDÓ',
                error.error.message,
                'error'
            );
            this.utilService.loader(false);
        });
    }


}
