import { DataTipoCupoService } from './../../../services/data-tipo-cupo.service';
import { EntCtaCobroPrductosPorCliente } from './../../../Class/EntCtaCobroProductosPorCliente';
import { EntTipoConcepto } from './../../../Class/EntTipoConcepto';
import { PrincipalComponent } from './../../../principal/principal.component';
import { UtilService } from './../../../services/util.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { EntConsumptionClient } from '../../../Class/EntConsumptionClient';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { NominaService } from '../../../services/nomina.service';
import { dateToISOString, focusById, rangedate } from '../../../util/util-lib';
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
    public productosAll: EntCtaCobroPrductosPorCliente[] = []; //create
    public totalCantidad: number;
    public totalCantidadesProducto: number;
    public totalValor: number;
    public totalDeLaVenta: number;
    public totalTickets: number;
    public totalProductos: number;
    public retenciones: boolean = null;
    public classRet: string = 'p-button-rounded p-button-secondary';
    public iconRetn: string = 'pi pi-question';
    public retencionesAll: any[] = [];
    public tiposImpuestos: any[] = [];
    public impuesto = { id: null, formaPago: null, text: null, valor: null };
    public impuestoValor: number;
    public mensaje: string;
    public treeTipoConceptos = [
        { idConcepto: 0, detalleConcepto: 'combustible' },
        { idConcepto: 1, detalleConcepto: 'Aditivos o Lubricantes' },
    ];
    public tipoConceptos: EntTipoConcepto[] = this.treeTipoConceptos;
    public conceptoSelected: EntTipoConcepto;
    public retencionSelected: any[] = [];
    noAplica;
    //elementos
    deConsumos: boolean = false;
    deProductos: boolean = false;
    botonDeRetenciones: boolean = false;
    tipoCupo: string;
    botonNoAplica: boolean = false;
    rol: number;
    areaRol: number;

    constructor(
        public carteraService: CarteraService,
        public storageService: StorageService,
        public nominaService: NominaService,
        public utilService: UtilService,
        public principalCompo: PrincipalComponent,
        public dataTipoCupo: DataTipoCupoService
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

        this.rol = this.storageService.getCurrentUserDecode().idRol;
        this.areaRol = this.storageService.getCurrentUserDecode().Area
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

    get validaRetencionCredito() {
        if (this.dataTipoCupo.detalleTipoCupo == '"CREDITO"') {
            return true;
        }
    }

    get validaRetencionAnticipo() {
        if (this.dataTipoCupo.detalleTipoCupo == '"ANTICIPO"') {
            return true;
        }
    }

    retencionValidadaCredito() {
        if (this.validaRetencionCredito) {
            this.botonDeRetenciones = false;
            this.principalCompo.showMsg('success', 'Información', 'Cliente tipo crédito no requiere seleccionar el botón retenciones');
            return;
        }
    }

    retencionValidadaAnticipo() {
        if (this.validaRetencionAnticipo) {
            this.botonDeRetenciones = true;
            this.principalCompo.showMsg('info', 'Información', '¡Para el cliente tipo anticipo favor siga los pasos desde 1 al 3, hasta hacer click en botón con el simbolo "+" que agrega la retención seleccionada! En caso "no aplica" retención hasta el paso 2.');
            return;
        }
    }

    get validaConcepto() {
        if (this.conceptoSelected == undefined) {
            return true;
        } else {
            return false;
        }
    }

    getConceptoValidado() {
        if (this.validaConcepto) {
            this.principalCompo.showMsg('info', 'Atención', 'Favor seleccione el concepto (Combustible o Lubricantes) que requiere consultar porque está: ' + this.conceptoSelected);
            return;
        }
    }

    consultarArticulo() {
        this.retencionValidadaAnticipo();
        this.retencionValidadaCredito();
        this.getConceptoValidado();
        if (this.conceptoSelected.idConcepto == 0) {
            this.deConsumos = true;
            this.deProductos = false;
            this.consultarConsumos();
        }
        if (this.conceptoSelected.idConcepto == 1) {
            this.deProductos = true;
            this.deConsumos = false;
            this.consultarProductos();
        }
    }

    consultarProductos() {
        this.utilService.loader(true);
        this.productosAll = [];

        let roles = [4, 1]
        let areas = [7, 11]
        if (roles.includes(this.rol) && areas.includes(this.areaRol)) {
            this.carteraService
                .getConsumosCtaCobroClieXProducto(
                    this.cliente.idEstacion,
                    this.fechaIni,
                    this.fechaFin,
                    this.cliente.codCliente
                )
                .subscribe((productos) => {
                    this.utilService.loader(false);
                    this.productosAll = productos;
                    this.totalDeProductos();
                });
        } else {
            this.carteraService
                .getConsumosCtaCobroClieXProducto(
                    this.estacion,
                    this.fechaIni,
                    this.fechaFin,
                    this.cliente.codCliente
                )
                .subscribe((productos) => {
                    this.utilService.loader(false);
                    this.productosAll = productos;
                    this.totalDeProductos();
                });
        }


    }

    consultarConsumos() {
        this.utilService.loader(true);
        this.consumosAll = [];
        console.log("rol:"+this.rol+ ' areaRol:'+this.areaRol+' estation: '+this.cliente.idEstacion);
        let roles = [4, 1]
        let areas = [7, 11]
        if (roles.includes(this.rol) && areas.includes(this.areaRol)) {
            this.carteraService
                .getConsumptionReceivable(
                    this.cliente.codCliente,
                    this.fechaIni,
                    this.fechaFin,
                    null,
                    this.cliente.idEstacion
                )
                .subscribe((consumos) => {
                    this.utilService.loader(false);
                    this.consumosAll = consumos;
                    this.totales();
                });
        } else {
            this.carteraService
                .getConsumptionReceivable(
                    this.cliente.codCliente,
                    this.fechaIni,
                    this.fechaFin,
                    null,
                    this.estacion
                )
                .subscribe((consumos) => {
                    this.utilService.loader(false);
                    this.consumosAll = consumos;
                    this.totales();
                });
        }
    }

    totalDeProductos() {
        this.totalProductos = 0;
        this.totalCantidadesProducto = 0;
        this.totalDeLaVenta = 0;
        this.productosAll.forEach((items) => {
            this.totalCantidadesProducto += items.Cantidad;
            this.totalDeLaVenta += items.totalVenta;
            this.totalProductos++;
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
        if (this.validarPaso2() == true || this.validarPaso3() == true) {
            return;
        }

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
                this.principalCompo.showMsg(
                    'success',
                    'Eliminado',
                    'Retencion eliminada'
                );
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
                if (this.retencionesAll && this.retencionesAll.length > 0) {
                    this.retencionesAll = [];
                    Swal.fire({
                        icon: 'info',
                        title: 'Retenciones',
                        text: 'Debe volver a realizar las retenciones',
                    });
                }
                this.principalCompo.showMsg(
                    'success',
                    'Eliminado',
                    'Consumo eliminado para restaurarlo vuelva a consultar'
                );
            } else {
                return;
            }
        });
    }

    borrarProducto(index: number) {

        console.log('Borrar producto de la lista... con índice: ' + index);
    }

    AgregarRetencion() {
        this.validarPaso2();

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
        this.noAplica = this.impuesto;
        if (this.noAplica == 'NO APLICA') {
            this.botonNoAplica = true;
            console.log('elementos siguientes desactivados porque: ' + this.impuesto);
        }
        if (this.noAplica != 'NO APLICA') {
            this.botonNoAplica = false;
            console.log('elementos siguientes activados porque sí aplica');
        }
    }
    RetencionesMoc() {
        let i = 0;
        this.retencionesAll.push({
            id: i,
            descripcion: 'Retencion ' + i,
            valor: Math.round(Math.random()),
        });
        i++;
    }
    Retenciones() {
        setTimeout(() => {
            focusById('selectRetenciones');
        }, 10);

        this.retenciones = !this.retenciones;

        if (this.retenciones) {
            this.classRet = 'p-button-rounded';
        } else {
            this.classRet = 'p-button-rounded p-button-danger';
            this.retencionesAll = [];
        }
    }

    getValidarRetencion() {
        this.principalCompo.showMsg('info', 'Atención', 'Favor seleccione el concepto (Combustible o Lubricantes) que requiere consultar porque está: ' + this.conceptoSelected);
        this.principalCompo.showMsg('info', 'Atención', 'Favor seleccione el tipo de retención, pulse en el símbolo "+" ');
    }

    validarPaso2() {
        if (this.impuesto.id == null && JSON.stringify(this.impuesto) != '"NO APLICA"' && this.dataTipoCupo.detalleTipoCupo == '"ANTICIPO"') {
            this.principalCompo.showMsg('warn', 'Atención', 'Favor seleccione una retención del paso 2, sino aplica: seleccione "NO APLICA" :)');
            return true;
        }
    }

    validarPaso3() {
        if (this.retencionesAll.length == 0 && this.dataTipoCupo.detalleTipoCupo == '"ANTICIPO"' && this.noAplica != 'NO APLICA') {
            this.principalCompo.showMsg('error', 'Atención', 'Favor agregue la retención en el paso 3, pulse en el botón del símbolo "+" para adicionarla al listado');
            return true;
        }
    }
}
