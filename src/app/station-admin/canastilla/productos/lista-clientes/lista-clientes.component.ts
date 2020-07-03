import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EntClient } from '../../../../Class/EntClient';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { CarteraService } from '../../../../services/cartera.service';
import { NominaService } from '../../../../services/nomina.service';


@Component({
    selector: 'app-lista-clientes',
    templateUrl: './lista-clientes.component.html',
    styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {
    @Output() submiter = new EventEmitter<EntClient>();
    clientes: EntClient[];
    constructor(
        private _carteraService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.getClientesCredito();
     }

    ngOnInit() {

    }
    getClientesCredito() {
        this.utilService.loader(true);
        this._carteraService.GetClientCredit(true).subscribe(data => {
            this.clientes = data;
            this.utilService.loader(false);
        }, error => {
            console.log('Errores : ', error);
            this.utilService.loader(false);
        });
    }
    SeleccionarClient(cliente: EntClient) {
        this.submiter.emit(cliente);
    }
}
