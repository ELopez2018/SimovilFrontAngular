import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { currencyNotDecimal, dateToISOString, addDays, focusById, cleanNumber, cleanString } from '../../../util/util-lib';
import { EntArticle } from '../../../Class/EntArticle';
import { EntClient } from '../../../Class/EntClient';
import { CarteraService } from '../../../services/cartera.service';
import { fadeTransition } from '../../../routerAnimation';
import { NominaService } from '../../../services/nomina.service';
import { forkJoin } from 'rxjs';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';

@Component({
    selector: 'app-station-consumption-add',
    templateUrl: './station-consumption-add.component.html',
    styleUrls: ['./station-consumption-add.component.css'],
    animations: [fadeTransition()]
})
export class StationConsumptionAddComponent implements OnInit {
    plantilla: FormGroup;
    consumption: FormGroup;
    list: FormArray;
    notdecimal = currencyNotDecimal();
    articles: EntArticle[];
    numitem: number;
    boolWarn = false;

    boolClient = false;
    clientSel: EntClient;
    codStation: number;
    station: EntStation;
    constructor(
        private fb: FormBuilder,
        private carteraService: CarteraService,
        private nominaService: NominaService,
        private storageService: StorageService,
        private utilService: UtilService,
        private principal: PrincipalComponent
    ) {
        this.codStation = this.storageService.getCurrentStation();
    }

    ngOnInit() {
        this.buildForm();
        this.utilService.loader();
        forkJoin (
            this.carteraService.getArticles(),
            this.nominaService.GetStations(this.codStation)
        ).subscribe(([res1, res2]) => {
            this.utilService.loader(false);
            this.articles = res1;
            this.station = res2[0];
            this.articles = this.articles.filter(e => this.station.articulos.findIndex(i => i.ID_ARTICULO == e.ID) >= 0);
        }, error => {
            this.utilService.loader(false);
            console.log(error);
        });
        // this.station.articulos.find(e => e.)
        setTimeout(() => {
            this.boolWarn = true;
            setTimeout(() => {
                focusById('closeWarn', true);
            }, 10); focusById('closeWarn', true);
        }, 500);
    }

    buildForm() {
        const date = dateToISOString(addDays(new Date(), -1));
        this.plantilla = this.fb.group({
            cliente: { value: null, disabled: true },
            fecha: date,
            articulo: null
        });
        this.consumption = this.fb.group({
            lista: this.fb.array([])
        });
    }

    additem() {
        this.list.push(this.createItem());
    }

    createItem() {
        const a = this.plantilla.getRawValue();
        let nom, cod, email;
        this.clientSel ? (nom = this.clientSel.nombre, cod = this.clientSel.codCliente, email = this.clientSel.email) : null;
        return this.fb.group({
            cliente: [cod, Validators.required],
            clienteNom: [nom, Validators.required],
            clienteMail: [email],
            tiquete: [null, [Validators.required, Validators.min(0)]],
            fecha: [a.fecha, Validators.required],
            hora: [null],
            placa: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            articulo: [a.articulo, Validators.required],
            cantidad: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
            total: [null, [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
    }

    add() {
        this.list = this.consumption.get('lista') as FormArray;
        this.list.push(this.createItem());
    }

    clear() {
        this.clientSel = null;
        this.plantilla.reset();
    }
    Autocompletar(index) {
        //   console.log(this.list.controls[index].get('tiquete').value);

        this.carteraService.getTicketConsecutivo(this.codStation, this.list.controls[index].get('tiquete').value).subscribe(data => {
            let fecha = new Date(data.HoraFin);
            console.log(data);
            let dia = this.FormatoFecha(new Date(data.Fecha));
            let f;
            let horas = fecha.getUTCHours() + '';
            let minutos = fecha.getMinutes() + '';
            let segundos = fecha.getSeconds() + '';

            if (fecha.getUTCHours() < 10) {
                horas = '0' + fecha.getUTCHours();
            }

            if (fecha.getMinutes() < 10) {
                minutos = '0' + fecha.getMinutes();
            }

            if (fecha.getSeconds() < 10) {
                segundos = '0' + fecha.getSeconds();
            }
            console.log(dia);
            console.log(f);
            f = horas + ':' + minutos + ':' + segundos;

            this.list.controls[index].get('placa').setValue(data.PLACA);
            this.list.controls[index].get('cantidad').setValue(data.CANTIDAD);
            this.list.controls[index].get('total').setValue(data.TOTAL);
            this.list.controls[index].get('hora').setValue(f);
            this.list.controls[index].get('fecha').setValue(dia);
            this.principal.showMsg('success', 'Exito', 'Ticket ha sido Encontrado');

            console.log(dia);

        }, error => {
            console.log(error);
            this.principal.showMsg('error', 'Error', error.error.message);
        });



    }
    FormatoFecha(fecha: Date): string {
        console.log(fecha);
        var dia = fecha.getDate() + '';
        var mes = (fecha.getMonth() + 1) + '';
        if (fecha.getDate() < 10) {
            dia = '0' + fecha.getDate();
        }
        if ((fecha.getMonth() + 1) < 10) {
            mes = '0' + (fecha.getMonth() + 1);
        }

        return fecha.getFullYear() + '-' + (mes) + '-' + (dia);
    }
    assignClient(client: EntClient) {
        if (this.numitem != null) {
            this.list.controls[this.numitem].get('clienteNom').setValue(client.nombre);
            this.list.controls[this.numitem].get('cliente').setValue(client.codCliente);
            this.list.controls[this.numitem].get('clienteMail').setValue(client.email);
            focusById('fecha_item' + this.numitem);
            this.numitem = null;
        } else {
            focusById('articulo');
            this.clientSel = client;
            this.plantilla.get('cliente').setValue(client.nombre);
        }
        this.boolClient = false;
    }

    boolClientF(num: number) {
        this.numitem = num != null ? num : null;
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
        this.boolClient = true;
    }

    delItem(index: number) {
        this.list.removeAt(index);
    }
    //   [SimovilObtenerTicketVenta] proc alma en Bases de datos
    lockItem(index: number) {


        if (this.lock(index)) {
            if (!this.list.controls[index].valid) {
                this.principal.showMsg('info', 'Información', 'Tiene campos pendientes por ingresar');
                return;
            } else {
                if (this.validItem(index)) {
                    this.utilService.loader();
                    this.carteraService.getConsumption(null, null, null, null, this.codStation, this.list.controls[index].get('tiquete').value).subscribe(res => {
                        this.utilService.loader(false);
                        if (res && res.length > 0) {
                            this.principal.showMsg('info', 'Información', 'El tiquete ya está ingresado en sistema');
                        } else {
                            this.list.controls[index].disable();
                        }
                    }, error => {
                        this.utilService.loader(false);
                        console.log(error);
                        this.principal.showMsg('error', 'Error', error.error.message);
                    });
                } else {
                    this.principal.showMsg('info', 'Información', 'El tiquete ya ha sido ingresado en la lista a ingresar');
                }
            }
        } else {
            this.list.controls[index].enable();
        }
    }

    lock(index: number) {
        return this.list.controls[index].enabled;
    }

    validItem(index: number) {
        const listRaw = this.list.getRawValue();
        let res = true;
        listRaw.map(e => {
            if (e.tiquete == listRaw[index].tiquete && e != listRaw[index]) {
                res = false;
            }
        });
        return res;
    }

    save() {
        if (!this.allDisabled) {
            this.principal.showMsg('warn', 'Advertencia', 'Tiene consumos sin validar');
            return;
        }
        this.utilService.confirm('Los consumos se guardaran en la base de datos y notificará al cliente el consumo con detalle. ¿Desea continuar?', res => {
            if (res) {
                this.sendC();
            }
        });
    }

    sendC() {
        const consumptionToSend = this.orderToSend();
        console.log(consumptionToSend);
        this.utilService.loader();
        this.carteraService.InsertConsumption(this.codStation, consumptionToSend).subscribe(res => {
            this.principal.showMsg('success', 'Éxito', 'Consumos ingresados correctamente.');
            this.utilService.loader(false);
            this.cleanArray();
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principal.showMsg('error', 'Error', error.error.message);
        });

    }

    orderToSend() {
        const rawData = this.list.getRawValue();
        const arrayList: {
            cliente: number,
            clienteNom: string,
            clienteMail: string,
            eds: string,
            consumos: {
                tiquete: number,
                fecha: string,
                hora: string,
                placa: string,
                articulo: number,
                cantidad: number,
                total: number
            }[]
        }[] = [];
        rawData.map(e => {
            if (arrayList.findIndex(i => i.cliente == e.cliente) < 0) {
                arrayList.push({
                    cliente: e.cliente,
                    clienteMail: e.clienteMail,
                    clienteNom: e.clienteNom,
                    eds: this.station.nombreEstacion,
                    consumos: []
                });
            }
            // e.articulo = (e.articulo as EntArticle).ID;
        });
        arrayList.map(e => {
            const arrayFilter = rawData.filter(f => f.cliente == e.cliente);
            arrayFilter.forEach(a => {
                e.consumos.push({
                    tiquete: a.tiquete,
                    fecha: a.fecha,
                    hora: (a.hora != null ? a.hora : '00:00'),
                    placa: cleanString(a.placa).toUpperCase(),
                    articulo: (a.articulo as EntArticle).ID,
                    cantidad: a.cantidad,
                    total: a.total
                });
            });
        });
        return arrayList;
    }

    get allDisabled() {
        let val = true;
        this.list.controls.map(e => {
            if (e.enabled) {
                val = false;
            }
        });
        return val;
    }

    cancel(quest = true) {
        if (quest) {
            this.utilService.confirm('¿Desea eliminar todos los consumos ingresados? ', res => {
                if (res) {
                    this.cleanArray();
                }
            });
        } else {
            this.cleanArray();
        }
    }

    cleanArray() {
        while (this.list.length > 0) {
            this.delItem(this.list.length - 1);
        }
        this.clear();
    }

    get visibleArray() {
        try {
            return (this.consumption.get('lista') as FormArray).length > 0;
        } catch (error) {
            console.log('Errores ' + error);
            return false;
        }
    }

    closeAdw() {
        this.boolWarn = false;
        focusById('btnClient', true);
    }
}
