import { Component, OnInit } from '@angular/core';
import { EntReceivable } from '../../Class/EntReceivable';
import { CarteraService } from '../../services/cartera.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { EntQuota } from '../../Class/EntQuota';
import { fadeTransition } from '../../routerAnimation';

@Component({
    selector: 'app-receivable',
    templateUrl: './receivable.component.html',
    styleUrls: ['./receivable.component.css'],
    animations: [fadeTransition()]
})
export class ReceivableComponent implements OnInit {
    receivables: EntReceivable[];
    quotas: EntQuota[];
    cols: any = []
    DiaSemaforo = [7, 16];

    constructor(
        private carteraService: CarteraService,
        private principalComponent: PrincipalComponent,
        private title: Title,
        private fb: FormBuilder
    ) {
        title.setTitle('Cuentas de cobro - Simovil');
        this.buildForm();
    }

    ngOnInit() {
        this.getReceivable();
    }

    buildForm() {
    }

    // por modificar
    getReceivable() {
        this.receivables = null;
        this.carteraService.getReceivable(null, true, null, null, null, null).subscribe(receivables => {
            if (receivables.length > 0) {
                receivables.forEach(element => {
                    element.fecha = this.DateToLocalString(element.fecha);
                });
                this.receivables = receivables;
                this.GetQuota();
            } else {
                this.principalComponent.showMsg('info', 'Información', 'El cliente no cuenta con cuentas de cobro');
            }
        }, error => {
            this.principalComponent.showMsg('error', 'ERROR', error);
        });
        this.cols[0] = [
            { field: 'id', header: 'Id', width: '10%' },
            { field: 'codCliente', header: 'Cliente', width: '20%' },
            { field: 'fecha', header: 'Fecha', width: '10%' },
            { field: 'valor', header: 'Valor', width: '20%', class: '$' },
            { field: 'saldo', header: 'Saldo', width: '20%', class: '$' }
            // { field: 'acciones', header: 'Acciones', width: '20%', class: 'button' }
            //{ field: 'observacion', header: 'Observación' }
        ];
    }

    CupoActivo(cupo) {
        return cupo.estadoCupo
    }

    GetQuota() {
        this.carteraService.getQuota(null).subscribe(quotas => {
            if (quotas.length > 0) {
                this.quotas = quotas;
            }
            this.receivableWhitquota();
        }, error => {
            console.log(error);
        });
    }

    receivableWhitquota() {
        this.receivables.forEach(item => {
            this.quotas.forEach(cupo => {
                if (item.codCliente == cupo.codCliente) {
                    item['acciones'] = cupo.estadoCupo == true ? 'Bloquear cupo' : 'Habilitar cupo';
                    item['estadoCupo'] = cupo.estadoCupo;
                }
            });
        });
    }

    DateToLocalString(date: any) {
        if (date == null)
            return null;
        return new Date(date).toLocaleDateString();
    }

    porCobrar(fecha: string) {
        let fechaString = fecha.split("/");
        var actual = new Date();
        var fechamod = new Date(Number(fechaString[2]), Number(fechaString[1]) - 1, Number(fechaString[0]));
        var diff = actual.getTime() - fechamod.getTime();
        if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[0])
            return 'tb sem1';
        else if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[1])
            return 'tb sem2';
        else
            return 'tb sem3';
    }

    BlockQuota(receivable: EntReceivable) {
        console.log(receivable);
        let quota = new EntQuota();
        quota.codCliente = receivable.codCliente;
        quota['block'] = true;
        quota.estadoCupo = !receivable['estadoCupo'];
        console.log(quota);
        this.carteraService.UpdateQuota(quota, null).subscribe(fila => {
            this.principalComponent.showMsg('success', 'Éxito', 'El cupo del cliente ' + quota.codCliente + ' ha sido actualizado correctamente');
            var array = [];
            this.receivables.forEach(item => {
                if (item.codCliente == quota.codCliente) {
                    item['acciones'] = quota.estadoCupo == true ? 'Bloquear cupo' : 'Habilitar cupo';
                    item['estadoCupo'] = quota.estadoCupo;
                }
                array.push(item);
            });
            this.receivables = array;
        }, error => {
            console.log(error);
            this.principalComponent.showMsg('error', 'Error', 'Error al bloquear el cupo del cliente ' + quota.codCliente);
        })  //por modificar
    }
}
