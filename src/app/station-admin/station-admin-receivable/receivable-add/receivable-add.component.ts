import { PrincipalComponent } from './../../../principal/principal.component';
import { UtilService } from './../../../services/util.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { EntConsumptionClient } from '../../../Class/EntConsumptionClient';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { NominaService } from '../../../services/nomina.service';
import { dateToISOString, rangedate } from '../../../util/util-lib';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-receivable-add',
    templateUrl: './receivable-add.component.html',
    styleUrls: ['./receivable-add.component.css'],
})
export class ReceivableAddComponent implements OnInit {
    @Input() cliente: EntBasicClient = new EntBasicClient();
    @Output() retencionSubmitterAll = new EventEmitter<any>();
    public fechaIni: string;
    public fechaFin: string;
    public cols: any[];
    public estacion: number;
    public consumosAll: EntConsumptionClient[] = [];
    public totalCantidad: number;
    public totalValor: number;
    public totalTickets: number;
    public retenciones: boolean = null;
    public classRet: string = 'p-button-rounded p-button-secondary';
    public iconRetn: string = 'pi pi-question';
    public retencionesAll: any[] = [];
    public tiposImpuestos: any[] = [];
    public impuesto = { id: null, formaPago: null, text: null, valor: null };
    public impuestoValor: number;
    public mensaje: string;
    constructor(
        public carteraService: CarteraService,
        public storageService: StorageService,
        public nominaService: NominaService,
        public utilService: UtilService,
        public principalCompo: PrincipalComponent
    ) {
        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'ConsecutivoEstacion', header: 'Ticket' },
            { field: 'placa', header: 'Placa' },
            { field: 'combustible', header: 'Combustible' },
            { field: 'cantidad', header: 'Cantidad' },
            { field: 'valor', header: 'Valor' },
        ];
        this.estacion = this.storageService.getCurrentStation();
    }

    ngOnInit(): void {
        this.GetTipoImpuestos();
        this.Fechas();
        this.Reset();
    }
    Cancel() {
        this.Reset();
        this.retencionSubmitterAll.emit(null);
    }
    Reset() {
        this.consumosAll = [];
        this.impuesto = { id: null, formaPago: null, text: null, valor: null };
        this.retenciones = false;
        this.retencionesAll = [];
        this.impuestoValor = null;
    }
    GetTipoImpuestos() {
        this.nominaService.GetTiposImpuestos().subscribe((resp) => {
            this.tiposImpuestos = resp;
        });
    }
    consultarConsumos() {
        this.utilService.loader(true);
        this.consumosAll = [];
        this.carteraService
            .getConsumption(
                this.cliente.codCliente,
                this.fechaIni,
                this.fechaFin,
                null,
                this.estacion
            )

            .subscribe((consumos) => {
                this.utilService.loader(false);
                this.consumosAll = consumos;
                console.log(this.consumosAll);
                this.totales();
            });
    }
    totales() {
        this.totalTickets = 0;
        this.totalCantidad = 0;
        this.totalValor = 0;
        this.consumosAll.forEach((items) => {
            this.totalCantidad += items.cantidad;
            this.totalValor += items.valor;
            this.totalTickets++;
        });
    }
    ConsultaMock() {
        this.cliente.codCliente = 860002566;
        this.fechaIni = '2020-10-01'; //new Date(2020,10,1);
        this.fechaFin = '2020-10-02'; //new Date(2020,10,5);
        this.estacion = 96;
    }
    Fechas() {
        let fecha = rangedate(dateToISOString(new Date()), 1);
        this.fechaFin = dateToISOString(fecha[1]);
        this.fechaIni = dateToISOString(fecha[0]);
    }
    Guardar() {
        if (this.consumosAll && this.consumosAll.length > 0) {
            this.retencionSubmitterAll.emit({
                fechaIni: this.fechaIni,
                fechaFin: this.fechaFin,
                retenciones: this.retencionesAll,
                consumos: this.consumosAll,
            });
            this.Reset();
        }
    }
    EliminarRetencion(index: number) {
        Swal.fire({
            title: 'ELIMINAR RETENCION',
            text:
                'Está a punto de eliminar la retencion de esta lista, ¿Desea continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
        }).then((result) => {
            if (result.value) {
                this.retencionesAll.splice(index, 1);
                this.principalCompo.showMsg("success","Eliminado","Retencion eliminada")
            } else {
                return;
            }
        });
    }
    EliminarConsumo(index: number) {
        Swal.fire({
            title: 'ELIMINAR CONSUMO',
            text:
                'Está a punto de eliminar un consumo de esta lista, ¿Desea continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
        }).then((result) => {
            if (result.value) {
                this.consumosAll.splice(index, 1);
                this.totales();
                if(this.retencionesAll && this.retencionesAll.length > 0) {
                    this.retencionesAll =[];
                    Swal.fire({icon:'info', title:'Retenciones', text: 'Debe volver a realizar las retenciones'});
                }
                this.principalCompo.showMsg("success","Eliminado","Consumo eliminado para restaurarlo vuelva a consultar")
            } else {
                return;
            }
        });
    }
    AgregarRetencion() {
        if (!this.impuesto || this.impuesto.formaPago === null) {
            this.mensaje = 'Debe seleccionar un concepto';
            return;
        }
        if (
            this.retencionesAll.find((e) => e.tipo === this.impuesto.id) !==
            undefined
        ) {
            this.mensaje = 'Ya está registrada la transaccion';
            return;
        }
        this.mensaje = null;
        this.retencionesAll.push({
            id: this.retencionesAll.length + 1,
            tipo: this.impuesto.id,
            formaPago: this.impuesto.formaPago,
            valor: this.impuestoValor,
            DETALLE: this.impuesto.text,
        });
    }
    CalculoRet() {
        this.impuestoValor = Math.round(this.totalValor * this.impuesto.valor);
    }
    RetencionesMoc() {
        let i = 0;
        // for (let a = 0; a < 5; a++) {
        this.retencionesAll.push({
            id: i,
            descripcion: 'Retencion ' + i,
            valor: Math.round(Math.random()),
        });
        i++;
        // }
    }
    Retenciones() {
        this.retenciones = !this.retenciones;

        if (this.retenciones) {
            this.classRet = 'p-button-rounded';
            // this.RetencionesMoc();
        } else {
            this.classRet = 'p-button-rounded p-button-danger';
            this.retencionesAll = [];
        }
    }
}
