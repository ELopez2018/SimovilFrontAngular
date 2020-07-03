import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { articulo_estacion, EntStation } from '../../../Class/EntStation';
import { SelectItem } from 'primeng/api';
import { currencyNotDecimal, dateToISOString, addDays, focusById, cleanNumber, cleanString } from '../../../util/util-lib';
import { EntArticle } from '../../../Class/EntArticle';
import { UtilService } from '../../../services/util.service';
import { EntClient } from '../../../Class/EntClient';
import { StorageService } from '../../../services/storage.service';
import { EntConsumo } from '../../../Class/EntConsumo';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-stationConsumptionFormapago',
    templateUrl: './stationConsumptionFormapago.component.html',
    styleUrls: ['./stationConsumptionFormapago.component.css']
})
export class StationConsumptionFormapagoComponent implements OnInit {
    mensaje: string;
    mensaje2: string;
    formaPago: number;
    VerBuscarFP: boolean = false;
    es: any;
    consumos: any[] = [];
    fechaInicial: Date = new Date();
    fechaFinal: Date = new Date();
    descripcionFP: string;
    articulos: SelectItem[] = [];
    fechaRegistro: Date = new Date();
    boolClient = false;
    clientSel: EntClient;
    nombreCliente: String;
    codStation: number;
    station: EntStation;
    stationSel: EntStation;
    stationCode: number;
    stationsAll: EntStation[];
    constructor(
        public nominaService: CarteraService,
        public _NominaService: NominaService,
        public Mensaje: PrincipalComponent,
        public utilService: UtilService,
        public principal: PrincipalComponent,
        public _storageService: StorageService
    ) {
        this.clientSel = new EntClient();
        this.formaPago = null;
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['enero ', 'febrero ', 'marzo ', 'abril ', 'mayo ', 'junio', 'julio ', 'agosto ', 'septiembre ', 'octubre ', 'noviembre ', 'diciembre '],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
        this.nominaService.getArticles().subscribe(resp => {
            resp.forEach(Art => {
                this.articulos.push({
                    label: Art.DESCRIPCION,
                    value: Art.ID
                });
            })
        })
    }

    ngOnInit() {
        this.GetEstaciones();
        this.mensaje = 'El ticket está registrado y no puede editarse';
        this.mensaje2 = 'Puede realizar los cambios que necesite para guardarlos en la Base de Datos';
    }
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    boolClientF(num: number) {
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
        this.boolClient = true;
    }

    assignClient(client: EntClient) {
        this.clientSel = client;
        this.VerBuscarFP = client !== null;
        this.boolClient = false;
    }


    async consultarDatosFP(estacion: number, formaPago: number) {
        await this.nominaService.getDatosFormadePago(estacion, formaPago).subscribe(resp => {
            this.descripcionFP = resp[0].DESCRIPCION;
        });
    }

    Buscar() {
        if (this.stationCode == null) {
            Swal.fire({
                title: 'SIN AUTORIZACION',
                text: 'Debe ser Administrador de Estacion para poder consultar las Formas de Pago',
                icon: 'error'
            });
            return;
        }
        this.consumos = [];
        this.descripcionFP = null;
        this.utilService.loader();
        this.consultarDatosFP(this.stationCode, this.formaPago);
        this.nominaService.getFormadePago(this.stationCode, this.formaPago, this.fechaInicial, this.fechaFinal).subscribe(resp => {
            this.utilService.loader(false);
            this.consumos = resp;
            let arrayTickets;
            arrayTickets = [];
            this.consumos.forEach(consumo => {
                arrayTickets.push({ ticket: consumo.CONSECUTIVO });
            });
            const Tickets = {
                idEstacion: this.stationSel.idEstacion,
                tickets: arrayTickets
            };
            this.nominaService.getValidarConsumoFp(Tickets).subscribe(datos => {
                datos.forEach((Cons: any) => {
                    let Indice = this.consumos.findIndex(ticket => ticket.CONSECUTIVO == Cons.tickets);
                    this.consumos[Indice].REGISTRADO = Cons.registrado;
                });
            });
        }, error => {
            this.utilService.loader(false);
            this.Mensaje.showMsg('error', 'SE PRODUJERON ERRORES', error.error.message);
            console.error('ESTE ES EL ERROR :', error);
        });
    }

    Eliminar(I: number) {
        Swal.fire({
            title: '¿ESTÁ SEGURO?',
            text: 'Está a punto de eliminar el consumo de esta lista, ¿Desea Continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {

            if (result.value) {

                this.consumos.splice(I, 1);
                this.Mensaje.showMsg('success', 'ELIMINADO', 'Consumo eliminado correctamente');
            } else {

                this.Mensaje.showMsg('info', 'CANCELADO', 'Se canceló la eliminación');
            }

        });

    }

    guardar() {

        Swal.fire({
            title: '<strong>GUARDAR</strong>',
            showClass: {
                popup: 'animated zoomIn '
            },
            hideClass: {
                popup: 'animated zoomOut faster'
            },
            icon: 'question',
            html:
                'Está a punto de guardar estos consumos a nombre de ' + this.clientSel.nombre + '<br>' +
                '<strong>¿Desea continuar?</strong> ',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Sí',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"> No</i>',
            cancelButtonColor: '#d33',
            cancelButtonAriaLabel: 'Thumbs down'
        })
            .then((result) => {
                const consumptionToSend = this.orderToSend();
                this.utilService.loader();
                console.log(consumptionToSend);
                this.nominaService.InsertConsumption(this.stationCode, consumptionToSend).subscribe(res => {
                    this.principal.showMsg('success', 'Éxito', 'Consumos ingresados correctamente.');
                    this.utilService.loader(false);
                }, error => {
                    console.log(error);
                    this.utilService.loader(false);
                    this.principal.showMsg('error', 'Error', error.error.message);
                });
                this.utilService.loader(false);
                this.principal.showMsg('success', 'Guardado', 'Consumos Guardados');
            })
        this.utilService.loader(false);
    }
    Cancelar() {
        this.consumos = [];
    }

    orderToSend() {
        let contadorOmitidas: number = 0;
        // const rawData = this.list.getRawValue();
        let arrayList: {
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
        arrayList.push({
            cliente: this.clientSel.codCliente,
            clienteMail: this.clientSel.email,
            clienteNom: this.clientSel.nombre,
            eds: this.stationSel.nombreEstacion,
            consumos: []
        });
        arrayList.map(e => {
            this.consumos.forEach(a => {
                if (a.REGISTRADO == false) {
                    e.consumos.push({
                        tiquete: a.CONSECUTIVO,
                        fecha: a.Fecha,
                        hora: (a.hora != null ? a.hora : '00:00'),
                        placa: cleanString(a.PLACA).toUpperCase(),
                        articulo: a.CodigoAlterno,
                        cantidad: a.CANTIDAD,
                        total: a.VALOR
                    });
                } else {
                    contadorOmitidas++;
                }

            });
        });
        if (contadorOmitidas > 0) {
            this.principal.showMsg('info', 'OMITIDOS', 'Se omitieron ' + contadorOmitidas + ' Consumos que ya estaban registrados');
        }
        return arrayList;
    }

}
