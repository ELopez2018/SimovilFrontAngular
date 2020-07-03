import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';

@Component({
    selector: 'app-disability-payment-edit',
    templateUrl: './disability-payment-edit.component.html',
    styleUrls: ['./disability-payment-edit.component.css']
})
export class DisabilityPaymentEditComponent implements OnInit {
    Pagos;
    constructor(
        private _bdService: NominaService,
        private principalComponent: PrincipalComponent,
    ) { }

    ngOnInit() {
        this.GetPagos();
    }
    GetPagos() {

        this._bdService.getPagosInca().subscribe(datos => {
            this.Pagos = datos;
        }, error => {
            console.log(error);
        });
    }

    UpdatePago(pago) {
        this._bdService.updPagoInca(pago).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'Actualizado Correctamente');
            }, error => {
                this.principalComponent.showMsg('error', 'Error', error.error.message);
             });
    }
}
