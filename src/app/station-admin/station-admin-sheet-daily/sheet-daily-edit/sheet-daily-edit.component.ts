import { Component, OnInit } from '@angular/core';
import { EntStation } from '../../../Class/EntStation';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { EntSalesTurn } from '../../../Class/EntSalesTurn';
import { EntArticle } from '../../../Class/EntArticle';
import { EntSalesTurnDetail } from '../../../Class/EntSalesTurnDetail';
import { EntCPL_Detalle } from '../../../Class/EntCPL_Detalle';
import { EntDailySheet } from '../../../Class/EntDailySheet';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';
import { PrintService } from '../../../services/print.service';
import { forkJoin } from 'rxjs';
import { EntDailySheetTurn } from '../../../Class/EntDailySheetTurn';
import { EntDailySheetTurnDet } from '../../../Class/EntDailySheetTurnDet';
import { EntDailySheetPagCli } from '../../../Class/EntDailySheetPagCli';
import { cleanString, currencyNotDecimal, focusById, dateToISOString, addDays } from '../../../util/util-lib';
import { EntDailySheetVenCli } from '../../../Class/EntDailySheetVenCli';
import { EntDailySheetPagPro } from '../../../Class/EntDailySheetPagPro';
import { EntHose } from '../../../Class/EntHose';
import { EntCPL } from '../../../Class/EntCPL';
import { EntProvider } from '../../../Class/EntProvider';
import { fadeTransition } from '../../../routerAnimation';
import { ComponentCanDeactivate } from '../../../guards/component-can-deactivate';
import { EntInvoice } from '../../../Class/EntInvoice';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EntOtrosPagos } from '../../../Class/EntOtrosPagos';
import { EntAdvance } from '../../../Class/EntAdvance';

@Component({
    selector: 'app-sheet-daily-edit',
    templateUrl: './sheet-daily-edit.component.html',
    styleUrls: ['./sheet-daily-edit.component.css'],
    animations: [fadeTransition()]
})
export class SheetDailyEditComponent extends ComponentCanDeactivate implements OnInit {
    notdecimal = currencyNotDecimal();
    station: EntStation;
    otherForm: FormGroup;
    paymentForm: FormGroup;
    cashForm: FormGroup;
    bankForm: FormGroup;
    salesTurn: EntSalesTurn;
    salesTurnBefore: EntSalesTurn;
    articles: EntArticle[];
    fecha;
    itemSel: EntSalesTurnDetail;
    turno: number;
    index: number;
    boolEdit = false;
    boolSearchProvider = false;
    indexselProvider;
    show = [false, false, false, false, false];
    proveedorList: FormArray;
    clienteList: FormArray;
    clienteListVen: FormArray;
    showItemProvider = true;
    showItemClient = true;
    showItemClientVen = true;
    planilla = null;
    pla_bef: EntDailySheet;
    lock = false;
    cpl: EntCPL;
    CplDetail: EntCPL_Detalle[] = [];
    cplSum = 0;
    TotalSumaEnc;
    cplTotalGalones = 0;
    emitFalse = { emitEvent: false };
    cajaCustodia = 0;
    cajaGenMen = 0;
    boolSave = false;
    cant = null;
    dataDailySheet: EntDailySheet;

    // Nuevo en la planilla Anticipos y otros
    anticipo: boolean = false;
    anticProveeForm: FormGroup;
    OtrosList: FormArray;
    proveedorAnticipoList: FormArray;
    showItemPAnticipo = true;
    showItemOtros = true;
    otrosAEliminar = [];
    anticiposAEliminar: any[] = [];
    AcumProvee: number;


    canDeactivate(): boolean {
        let val: boolean;
        val = !(this.paymentForm.dirty || this.bankForm.dirty || this.cashForm.dirty || this.otherForm.dirty || this.salesTurn != null || this.CplDetail.length > 0);
        return val;
    }

    constructor(
        private carteraService: CarteraService,
        private nominaService: NominaService,
        private fb: FormBuilder,
        private title: Title,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService,
        private storageService: StorageService,
        private printService: PrintService
    ) {
        super();
        this.title.setTitle('Editar Planilla - Simovil');
        this.initial();
    }

    ngOnInit() {
        this.buildForms();
    }

    assignDailySheet(planilla: EntDailySheet) {
        //console.log(planilla);
        this.pla_bef = planilla;
        this.proveedorList = this.cashForm.get('proveedorList') as FormArray;
        this.proveedorAnticipoList = this.cashForm.get('proveedorAnticipoList') as FormArray;
        this.OtrosList = this.cashForm.get('OtrosList') as FormArray;

        if (planilla.PLA_DIA_PAG_PRO && planilla.PLA_DIA_PAG_PRO.length > 0) {
            planilla.PLA_DIA_PAG_PRO.map(e => {
                this.proveedorList.push(
                    this.fb.group({
                        nombre: e.NOMBRE,
                        numero: [e.NUMERO, Validators.required],
                        id: e.ID_FACTURA,
                        val: [e.VALOR, Validators.required]
                    })
                );
            });
        }
        console.log(planilla.DE_OTROS_PAGOS);
        if (planilla.DE_OTROS_PAGOS && planilla.DE_OTROS_PAGOS.length > 0) {
            planilla.DE_OTROS_PAGOS.map(e => {
                this.OtrosList.push(
                    this.fb.group({
                        id: e.id,
                        detalles: e.detalles,
                        otroVal: e.valor
                    })

                );
            });
        }

        if (planilla.DE_ANT_PROV && planilla.DE_ANT_PROV.length > 0) {
            planilla.DE_ANT_PROV.map(e => {
                this.proveedorAnticipoList.push(
                    this.fb.group({
                        nitProveedor: e.proveedor,
                        Provenombre: e.nombreProvee,
                        Proveefecha: e.fecha,
                        AntValor: e.valor,
                        proveedor: e.proveedor,
                        valor: e.valor,
                        detalle: e.detalle,
                        estado: 3,
                        factura: [null],
                        fecha: this.fecha,
                        rutaPago: null,
                        novedadAnticipo: [],
                        nombreProvee: e.nombreProvee,
                        idAnticipo: e.idAnticipo
                    })
                );

            });
        }

        this.clienteList = this.otherForm.get('clienteList') as FormArray;
        if (planilla.PLA_DIA_PAG_CLI && planilla.PLA_DIA_PAG_CLI.length > 0) {
            planilla.PLA_DIA_PAG_CLI.map(e => {
                let dat;
                let ant;
                switch (e.TIPO_CLIENTE) {
                    case 'A':
                        ant = true;
                        dat = false;
                        break;
                    case 'D':
                        ant = null;
                        dat = true;
                        break;
                    case 'C':
                        ant = null;
                        dat = false;
                        break;
                }
                this.clienteList.push(
                    this.fb.group({
                        codCliente: e.COD_CLIENTE,
                        nombre: { value: e.NOMBRE, disabled: true },
                        anticipo: ant,
                        // datafono: dat, Se comenta para que predeterminer cartera y no datafono.
                        datafono: false,
                        val: [{ value: e.VALOR, disabled: true }, [Validators.required, Validators.min(0)]]
                    })
                );
            });
        }
        this.clienteListVen = this.paymentForm.get('clienteList') as FormArray;
        if (planilla.PLA_DIA_VEN_CLI && planilla.PLA_DIA_VEN_CLI.length > 0) {
            planilla.PLA_DIA_VEN_CLI.map(e => {
                this.clienteListVen.push(
                    this.fb.group({
                        codCliente: e.COD_CLIENTE,
                        nombre: { value: e.NOMBRE, disabled: true },
                        anticipo: e.TIPO_CLIENTE == 'A' ? true : false,
                        val: [{ value: e.VALOR, disabled: true }, Validators.required]
                    })
                );
            });
        }

        this.otherForm.patchValue({
            lubricante: planilla.OI_LUBRICANTE,
            soatRef: planilla.OI_SOAT_REF,
            soatValue: planilla.OI_SOAT,
            soatCom: planilla.OI_SOAT_COM,
            soatVen: planilla.OI_SOAT_VEN,
            soatAnu: planilla.OI_SOAT_ANU,
            soatReem: planilla.OI_SOAT_REEM,
            premio: planilla.OI_PREMIO,
            aprovNom: planilla.OI_APROV_DET,
            aprovVal: planilla.OI_APROV,
            presLiq: planilla.OI_PRESTAMO_LIQ,
            cusiana: planilla.OI_CUSIANA,
            cliente: planilla.PLA_DIA_PAG_CLI && planilla.PLA_DIA_PAG_CLI.length > 0 ? planilla.PLA_DIA_PAG_CLI.reduce((a, b) => a + b.VALOR, 0) : 0,
            otroNom: planilla.OI_OTRO_DET,
            otroVal: planilla.OI_OTRO,
            prestamoNom: planilla.OI_PRESTAMO_DET,
            prestamoVal: planilla.OI_PRESTAMO,
            total: planilla.OI_TOTAL,
        }, this.emitFalse);
        this.paymentForm.patchValue({
            bonoPunto: planilla.FP_BONO_PUNTO,
            bonoCumple: planilla.FP_BONO_CUMPLE,
            bonoSoat: planilla.FP_BONO_SOAT,
            calibracion: planilla.FP_CALIBRACION,
            cliente: planilla.PLA_DIA_VEN_CLI && planilla.PLA_DIA_VEN_CLI.length > 0 ? planilla.PLA_DIA_VEN_CLI.reduce((a, b) => a + b.VALOR, 0) : 0,
            datafono: planilla.FP_DATAFONO,
            descuento: planilla.FP_DESC,
            devolucion: planilla.FP_DEV,
            donacion: planilla.FP_DONACION,
            mantenimiento: planilla.FP_MANT,
            prestamo: planilla.FP_PREST,
            otro: planilla.FP_OTRO,
            otroDetalle: planilla.FP_OTRO_DET,
            total: planilla.FP_TOTAL
        }, this.emitFalse);
        this.cashForm.patchValue({
            proveedor: planilla.PLA_DIA_PAG_PRO && planilla.PLA_DIA_PAG_PRO.length > 0 ? planilla.PLA_DIA_PAG_PRO.reduce((a, b) => a + b.VALOR, 0) : 0,
            reembolsoNum: planilla.DE_REEM_CAJ_MEN_NUM,
            reembolso: planilla.DE_REEM_CAJ_MEN,
            servicioNom: planilla.DE_SERV_PUB_DET,
            servicioVal: planilla.DE_SERV_PUB,
            otroNom: planilla.DE_OTRO_DET,
            otroVal: planilla.DE_OTRO,
            totalEfe: planilla.DE_TOTAL_EFE,
            total: planilla.DE_TOTAL
        }, this.emitFalse);
        this.bankForm.setValue({
            lubricanteVal: planilla.CB_LUBRI,
            lubricanteDet: planilla.CB_LUBRI_DET,
            liquidoVal: planilla.CB_LIQ,
            liquidoDet: planilla.CB_LIQ_DET,
            gasVal: planilla.CB_GAS,
            gasDet: planilla.CB_GAS_DET,
            cusianaVal: planilla.CB_CUSIANA,
            cusianaDet: planilla.CB_CUSIANA_DET,
            seguroVal: planilla.CB_SEG_EST,
            seguroDet: planilla.CB_SEG_EST_DET,
            recaudo: planilla.CB_REC_CART,
            total: planilla.CB_TOTAL
        }, this.emitFalse);
        // se sobre escribe estos valores para emitir el cambio y oblique a actualizar los totales.
        this.otherForm.get('otroVal').setValue(planilla.OI_OTRO);
        this.paymentForm.get('otro').setValue(planilla.FP_OTRO);
        this.cashForm.get('otroVal').setValue(planilla.DE_OTRO);
        this.bankForm.get('recaudo').setValue(planilla.CB_REC_CART);
        this.principalComponent.showMsg('success', 'Exito', 'Planilla Cargada con Exito');
    }

    get bankLub() { return this.bankForm.get('lubricanteDet').value; }
    get bankLiq() { return this.bankForm.get('liquidoDet').value; }
    get bankGas() { return this.bankForm.get('gasDet').value; }

    getDailySheetToEdit() {

        if (!this.fecha) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'El campo fecha está vacío.');
            return;
        }
        if (!this.planilla) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'Debe seleccionar el tipo de planilla.');
            return;
        }
        this.utilService.loader(true);
        this.carteraService.getDailySheet(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {

            this.utilService.loader(false);
            this.deleteAllClient();
            this.deleteAllProvider();
            this.deleteAllAnticipos();
            this.deleteAllDeOtros();
            if (res && res.length == 1) {
                if (res[0].EDITABLE) {
                    this.assignDailySheet(res[0]);
                    this.getcplorsales();
                    this.carteraService.getDailySheetBefore(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
                        if (res.length == 1) {

                            this.assignplanillaAnterior(res[0]);
                        }
                    }, error => {
                        this.principalComponent.showMsg('error', 'Error', error.error.message);
                        console.log(error);
                    });
                } else {
                    this.principalComponent.showMsg('error', 'Error', 'No tiene permiso para editar la planilla');
                }
            } else {
                this.principalComponent.showMsg('error', 'Error', 'La planilla no existe');
            }

            let fecha0: any = new Date(this.fecha);
            fecha0 = new Date(fecha0.setDate(fecha0.getDate() - 1));
            this.carteraService.getAcumAnticipo(this.station.idEstacion, fecha0).subscribe(resp => {
                this.AcumProvee = resp[0].Acumulado;
            });
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    getcplorsales() {
        if (this.planilla == 'L' && !this.station.sisLiq) {
            // CPL
            this.carteraService.getCPL(this.station.idEstacion, this.fecha).subscribe(result => {
                this.utilService.loader(false);
                if (result.length == 1) {
                    this.assignCPLToEdit(result[0]);
                } else {
                    this.principalComponent.showMsg('error', 'Error', 'Error al obtener cpl');
                }
            }, error => {
                console.log(error);
                this.utilService.loader(false);
                this.principalComponent.showMsg('error', 'Error', error.error.message);
            });
        } else {
            // VENTAS
            this.getSalesTurn();
        }
    }

    assignCPLToEdit(val: EntCPL) {
        this.cpl = val;
        this.CplDetail = val.DETALLE;
        const arraySum = [];
        this.CplDetail.map(e => {
            e.TOTAL = (e.LEC_FIN - e.LEC_INI) * e.PRECIO;
            e.NUM_MAN = e.COD_MAN;
            e.DET_ART = this.articles.find(a => a.ID == e.COD_ART).DESCRIPCION || '';
            arraySum.push(e.TOTAL);
            this.cplTotalGalones += e.CANTIDAD;
        });
        this.cplSum = Math.round(arraySum.reduce((a, b) => a + b, 0));
        this.TotalSumaEnc = this.cplSum;
    }

    initial() {
        this.utilService.loader(true);
        forkJoin(
            this.carteraService.getArticles(),
            this.nominaService.GetStations(this.storageService.getCurrentStation())
        ).subscribe(([res1, res2]) => {
            if (res2.length == 1) {
                this.station = res2[0];
            }
            this.articles = res1;
            this.utilService.loader(false);
            switch (this.station.tipoEstacion) {
                case 1:
                    this.planilla = 'G';
                    break;
                case 2:
                    this.planilla = 'L';
                    break;
            }
        });
    }

    validForm(): boolean {
        let res = true;
        // this.salesTurn.DETALLE.find(e => e.NUM_TURNO > this.station.turno) != null ? (this.principalComponent.showMsg('error', 'Error', 'Existe turnos mayores a lo permitido por la estación.'), res = false) : null;
        !this.otherForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Otros ingresos, incompleto.'), res = false) : null;
        !this.paymentForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Formas de pago, incompleto.'), res = false) : null;
        !this.cashForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Distribución del efectivo, incompleto.'), res = false) : null;
        !this.bankForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Consignación de bancos, incompleto.'), res = false) : null;
        return res;
    }

    CPL_TO_SHEET(): EntDailySheetTurn[] {
        let pla_dia_turn: EntDailySheetTurn[] = [];
        for (let index = 1; index <= this.station.turno; index++) {
            const element = this.CplDetail.filter(e => e.NUM_TUR == index);
            const turn_det: EntDailySheetTurnDet[] = [];
            const codArticulos: { COD_ART: number, PRECIO: number, NOM_ART: string }[] = [];
            element.map(e => {
                if (!codArticulos.some(art => art.COD_ART == e.COD_ART && art.PRECIO == e.PRECIO)) {
                    codArticulos.push({ COD_ART: e.COD_ART, PRECIO: e.PRECIO, NOM_ART: e.DET_ART });
                }
            });
            codArticulos.map(art => {
                let sumCArt = element.filter(e => e.PRECIO == art.PRECIO && e.COD_ART == art.COD_ART).reduce((a, b) =>
                    a + b.CANTIDAD, 0);
                let sumVArt = element.filter(e => e.PRECIO == art.PRECIO && e.COD_ART == art.COD_ART).reduce((a, b) =>
                    a + b.TOTAL, 0);
                turn_det.push({ COD_ART: art.COD_ART, NOM_ART: art.NOM_ART, CANTIDAD: sumCArt, PRECIO: art.PRECIO, VENTA: sumVArt });
            });
            const sumaVTurn = turn_det.reduce((a, b) => a + b.VENTA, 0);
            const sumaCTurn = turn_det.reduce((a, b) => a + b.CANTIDAD, 0);
            pla_dia_turn.push({ NUM_TUR: index, CANT_VENTA: sumaCTurn, TOTAL: sumaVTurn, PLA_DIA_TUR_VEN: turn_det });
        }
        return pla_dia_turn;
    }

    save(val: boolean) {
        if (!this.validForm()) {
            return;
        }
        const planilla = new EntDailySheet();
        planilla.ID = this.pla_bef.ID;
        planilla.NUM = this.pla_bef.NUM;
        planilla.TIPO = this.planilla;
        planilla.FECHA = this.fecha;
        planilla.CREADO = new Date().toISOString().split('T')[0];
        planilla.ID_ESTACION = this.station.idEstacion;
        planilla.NOM_ADM = this.station.administrador;
        let sumaTurn = 0;
        let sumaCTurn = 0;
        // VENTAS
        planilla.PLA_DIA_TUR = [];
        if (this.CplDetail && this.CplDetail.length > 0) {
            planilla.PLA_DIA_TUR = this.CPL_TO_SHEET();
            planilla.CPL = { ID: this.cpl.ID, ID_ESTACION: this.station.idEstacion, FECHA: this.fecha, VALOR: this.cplSum, DETALLE: this.CplDetail };
            planilla.V_TOTAL = this.cplSum;
            planilla.V_CANT = planilla.PLA_DIA_TUR.reduce((a, b) => a + b.CANT_VENTA, 0);
        } else if (this.salesTurn && this.salesTurn.DETALLE && this.salesTurn.DETALLE.length > 0) {
            // agregar validacion de numeros de turnos editados.
            for (let index = 1; index <= this.station.turno; index++) {
                const element = this.salesTurn.DETALLE.filter(e => e.NUM_TURNO == index);
                const turn_det: EntDailySheetTurnDet[] = [];
                sumaTurn = 0;
                sumaCTurn = 0;
                element.map(e => {
                    sumaTurn += e.VALOR;
                    sumaCTurn += e.CANTIDAD;
                    turn_det.push({ COD_ART: e.ID_ARTICULO, NOM_ART: e.DETALLE_ARTICULO, CANTIDAD: e.CANTIDAD, PRECIO: e.PRECIO, VENTA: e.VALOR });
                });
                planilla.PLA_DIA_TUR.push({ NUM_TUR: index, CANT_VENTA: sumaCTurn, TOTAL: sumaTurn, PLA_DIA_TUR_VEN: turn_det });
            }
            planilla.V_TOTAL = this.salesTurn.VALOR;
        }
        planilla.V_CANT = planilla.PLA_DIA_TUR.reduce((a, b) => a + b.CANT_VENTA, 0);
        // OTROS INGRESOS
        const OI = this.otherForm.getRawValue();
        const listclient: EntDailySheetPagCli[] = [];
        let car = 0;
        let dat = 0;
        let ant = 0;
        // let tipoCli;
        OI.clienteList.map(e => {
            e.anticipo ? ant += e.val : e.datafono ? dat += e.val : car += e.val;
            // listclient.push({ COD_CLIENTE: e.codCliente, TIPO_CLIENTE: tipoCli, VALOR: e.val });
        });
        if (this.pla_bef.PLA_DIA_PAG_CLI_DET && this.pla_bef.PLA_DIA_PAG_CLI_DET.length > 0) {
            this.pla_bef.PLA_DIA_PAG_CLI_DET.map(e => {
                listclient.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
            });
        }
        // if (this.dataDailySheet.PLA_DIA_PAG_CLI_DET && this.dataDailySheet.PLA_DIA_PAG_CLI_DET.length >= 0 && this.dataDailySheet.PLA_DIA_PAG_CLI_DET !== undefined) {
        //     this.dataDailySheet.PLA_DIA_PAG_CLI_DET.map(e => {
        //         if (listclient.find(f => f.ID == e.ID) == null) {
        //             listclient.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
        //         }
        //     });
        // }
        planilla.OI_LUBRICANTE = OI.lubricante;
        planilla.OI_SOAT_REF = cleanString(OI.soatRef);
        planilla.OI_SOAT = OI.soatValue;
        planilla.OI_SOAT_COM = OI.soatCom;
        planilla.OI_SOAT_VEN = OI.soatVen;
        planilla.OI_SOAT_ANU = OI.soatAnu;
        planilla.OI_SOAT_REEM = OI.soatReem;
        planilla.OI_PREMIO = OI.premio;
        planilla.OI_APROV_DET = cleanString(OI.aprovNom);
        planilla.OI_APROV = OI.aprovVal;
        planilla.OI_PRESTAMO_LIQ = OI.presLiq;
        planilla.OI_CUSIANA = OI.cusiana;
        planilla.OI_PAG_CAR_CLI = car;
        planilla.OI_PAG_CAR_CLI_DAT = dat;
        planilla.OI_PAG_ANT_CLI = ant;
        planilla.OI_OTRO_DET = cleanString(OI.otroNom);
        planilla.OI_OTRO = OI.otroVal;
        planilla.OI_PRESTAMO_DET = cleanString(OI.prestamoNom);
        planilla.OI_PRESTAMO = OI.prestamoVal;
        planilla.OI_TOTAL = OI.total;
        planilla.TOTAL_OI_VENTAS = this.ventaTotal;
        // FORMAS DE PAGO
        const FP = this.paymentForm.getRawValue();
        const listclientVen: EntDailySheetVenCli[] = [];
        let car2 = 0;
        let ant2 = 0;
        // let tipoCli2;
        FP.clienteList.map(e => {
            e.anticipo ? ant2 += e.val : car2 += e.val;
            // listclientVen.push({ COD_CLIENTE: e.codCliente, TIPO_CLIENTE: tipoCli2, VALOR: e.val });
        });
        if (this.pla_bef.PLA_DIA_VEN_CLI && this.pla_bef.PLA_DIA_VEN_CLI.length > 0) {
            this.pla_bef.PLA_DIA_VEN_CLI_DET.map(e => {
                listclientVen.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
            });
        }
        // if (this.dataDailySheet.PLA_DIA_VEN_CLI && this.dataDailySheet.PLA_DIA_VEN_CLI.length > 0) {
        //     this.dataDailySheet.PLA_DIA_VEN_CLI_DET.map(e => {
        //         if (listclientVen.find(f => f.ID == e.ID) == null) {
        //             listclientVen.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
        //         }
        //     });
        // }
        planilla.FP_BONO_PUNTO = FP.bonoPunto;
        planilla.FP_BONO_CUMPLE = FP.bonoCumple;
        planilla.FP_BONO_SOAT = FP.bonoSoat;
        planilla.FP_CALIBRACION = FP.calibracion;
        planilla.FP_CLI_CRE = car2;
        planilla.FP_CLI_ANT = ant2;
        planilla.FP_DATAFONO = FP.datafono;
        planilla.FP_DESC = FP.descuento;
        planilla.FP_DEV = FP.devolucion;
        planilla.FP_DONACION = FP.donacion;
        planilla.FP_MANT = FP.mantenimiento;
        planilla.FP_PREST = FP.prestamo;
        planilla.FP_OTRO_DET = cleanString(FP.otroDetalle);
        planilla.FP_OTRO = FP.otro;
        planilla.FP_TOTAL = FP.total;
        planilla.TOTAL_EFEC_REC = this.efectivoRecibido;
        planilla.CAJ_CUST_SALDO = this.cajaCustodia;

        // DISTRIBUCION DEL EFECTIVO
        let DE = this.cashForm.getRawValue();
        const listprovider: EntDailySheetPagPro[] = [];
        let listAnticiposAProvee: EntAdvance[] = [];
        let listOtrosPagos: EntOtrosPagos[] = [];
        var TotalOtros = 0;
        let DetallesOtros: string;
        let sum = 0;
        DetallesOtros = DE.OtrosList.length > 0 ? 'DETALLES: ' : null;
        console.log(DetallesOtros);
        DE.proveedorList.map(e => {
            sum += e.val;
            listprovider.push({ ID_FACTURA: e.id, NOMBRE: e.nombre, NUMERO: e.numero, VALOR: e.val });
        });

        DE.OtrosList.map((e: any) => {
            TotalOtros += e.otroVal;
            DetallesOtros += ' ' + e.detalles.toUpperCase()  + ' VALOR: ' + e.otroVal;
            listOtrosPagos.push({
                id: e.id,
                detalles: e.detalles.toUpperCase(),
                valor: e.otroVal
            });
        });

        DE.proveedorAnticipoList.map((e: any) => {
            listAnticiposAProvee.push({
                idAnticipo: e.idAnticipo,
                proveedor: e.proveedor,
                valor: e.valor,
                detalle: ' ' + e.detalle +   'VALOR: ' + e.valor,
                estado: e.estado,
                factura: e.factura,
                fecha: e.fecha,
                rutaPago: e.rutaPago,
                nombreProvee: e.nombreProvee

            });
        });
        planilla.DE_PROV = DE.proveedor;
        planilla.DE_REEM_CAJ_MEN_NUM = Number.isInteger(DE.reembolsoNum) ? +DE.reembolsoNum : 0;
        planilla.DE_REEM_CAJ_MEN = DE.reembolso;
        planilla.DE_SERV_PUB_DET = cleanString(DE.servicioNom);
        planilla.DE_SERV_PUB = DE.servicioVal;

        // planilla.DE_OTRO_DET = cleanString(DE.otroNom);
        planilla.DE_OTRO_DET = DetallesOtros;
        planilla.DE_OTRO = TotalOtros;

        planilla.DE_TOTAL_EFE = DE.totalEfe;
        planilla.DE_TOTAL = DE.total;
        planilla.DE_ANT_PROV = listAnticiposAProvee;
        planilla.DE_OTROS_PAGOS = listOtrosPagos;
        planilla.DE_ANTI_A_ELIMIN = this.anticiposAEliminar;
        planilla.DE_OTROS_A_ELIMIN = this.otrosAEliminar;
        planilla.DE_ACUM_ANTICIPOS = this.AcumProvee + DE.Anticipos;

        // CONSIGNACION EN BANCOS
        const CB = this.bankForm.getRawValue();
        planilla.CB_LUBRI_DET = cleanString(CB.lubricanteDet);
        planilla.CB_LUBRI = CB.lubricanteVal;
        planilla.CB_LIQ_DET = cleanString(CB.liquidoDet);
        planilla.CB_LIQ = CB.liquidoVal;
        planilla.CB_GAS_DET = cleanString(CB.gasDet);
        planilla.CB_GAS = CB.gasVal;
        planilla.CB_CUSIANA_DET = cleanString(CB.cusianaDet);
        planilla.CB_CUSIANA = CB.cusianaVal;
        planilla.CB_SEG_EST_DET = cleanString(CB.seguroDet);
        planilla.CB_SEG_EST = CB.seguroVal;
        planilla.CB_REC_CART = CB.recaudo;
        planilla.CB_TOTAL = CB.total;
        planilla.SAL_FIN_CAJA = this.saldoCaja;
        planilla.CAJA_GRAL_MEN = this.cajaGenMen;
        planilla.PLA_DIA_PAG_CLI = listclient;
        planilla.PLA_DIA_PAG_PRO = listprovider;
        planilla.PLA_DIA_VEN_CLI = listclientVen;
        console.log(planilla);
        this.showPreview(planilla, val);
        this.boolSave = true;
    }

    showPreview(planilla: EntDailySheet, val: boolean) {
        if (val) {
            this.utilService.confirm('¿Desea guardar la planilla?', res => {
                if (res) {
                    this.updateDailySheet(planilla);
                }
            });
        } else {
            this.printDailySheet(planilla, true);
        }
    }

    updateDailySheet(planilla: EntDailySheet) {
        let person = prompt('Inserte su código', '');
        if (person == null || person == '') {
            this.principalComponent.showMsg('info', 'Cancelado', 'Cancelado por no ingresar el código');
        } else {
            this.carteraService.getCodeStation(planilla.ID_ESTACION, person).subscribe(res => {
                if (res.length == 1) {
                    planilla.NOM_REA = res[0].NOMBRE;
                    this.utilService.loader(true);
                    this.carteraService.UpdateDailySheet(planilla).subscribe(result => {
                        this.utilService.loader(false);
                        this.resetPlanilla(false);
                        this.principalComponent.showMsg('success', 'Éxito', 'Planilla Actualizada Exitosamente');
                    }, error => {
                        this.utilService.loader(false);
                        console.log(error);
                        this.principalComponent.showMsg('error', 'Error', error.error.message);
                    });
                } else {
                    this.principalComponent.showMsg('error', 'Error', 'Código sin resultados');
                }
            }, error => {
                console.log(error);
                this.principalComponent.showMsg('error', 'Error', error.error.message);
            });
        }
    }

    printDailySheet(planilla: EntDailySheet, open?: boolean) {
        this.utilService.loader(true);
        this.printService.printSheetDailyEasy(planilla, open, res =>
            this.principalComponent.showMsg('error', 'error', res)
        );
    }

    resetPlanilla(val = true) {
        if (val) {
            this.utilService.confirm('Desea reiniciar la creación de la planilla', result => {
                if (result) {
                    this.resetfields();
                }
            });
        } else {
            this.resetfields();
        }
    }

    resetfields() {
        this.lock = false;
        this.fecha = null;
        this.planilla = null;
        this.cashForm.reset();
        this.bankForm.reset();
        this.otherForm.reset();
        this.paymentForm.reset();
        this.salesTurn = null;
        this.salesTurnBefore = null;
        this.CplDetail = [];
        this.show = [false, false, false, false, false];
        this.deleteAllClient();
        this.deleteAllProvider();
        this.deleteAllAnticipos();
        this.deleteAllDeOtros();
        this.cajaCustodia = 0;
        this.cajaGenMen = 0;
        this.boolSave = false;
        this.cplSum = 0;
        this.cplTotalGalones = 0;
        this.TotalSumaEnc = null;
        this.cant = null;
        this.initial();
    }

    updateCPL(val: EntCPL_Detalle) {
        if (val.NUM_TUR < this.station.turno) {
            this.CplDetail.find(e => e.NUM_TUR == val.NUM_TUR + 1 && e.COD_MAN == val.COD_MAN).LEC_INI = val.LEC_FIN;
        }
        // val.CANTIDAD = (val.LEC_FIN - val.LEC_INI);
        // val.CANTIDAD = Math.round((val.LEC_FIN - val.LEC_INI) * 100) / 100;
        val.CANTIDAD = +(+val.LEC_FIN - +val.LEC_INI).toFixed(2);
        val.TOTAL = val.PRECIO * val.CANTIDAD;
        const arraySum = [];
        this.CplDetail.map(e => {
            arraySum.push(e.TOTAL);
            this.cplTotalGalones += e.CANTIDAD;
        });
        this.cplSum = arraySum.reduce((a, b) => a + b, 0);
    }

    buildForms() {
        this.otherForm = this.fb.group({
            lubricante: ['', [Validators.required, Validators.min(0)]],
            soatRef: [''],
            soatValue: [0, [Validators.required, Validators.min(0)]],
            soatCom: [0, [Validators.required, Validators.min(0)]],
            soatVen: [0, [Validators.required, Validators.min(0)]],
            soatAnu: [0, [Validators.required, Validators.min(0)]],
            soatReem: [0, [Validators.required, Validators.min(0)]],
            premio: [0, [Validators.required, Validators.min(0)]],
            aprovNom: '',
            aprovVal: [0, [Validators.required]],
            cliente: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            clienteList: this.fb.array([]),
            presLiq: [0, [Validators.required, Validators.min(0)]],
            cusiana: [0, [Validators.required, Validators.min(0)]],
            otroNom: '',
            otroVal: [0, [Validators.required, Validators.min(0)]],
            prestamoNom: '',
            prestamoVal: [0, [Validators.required, Validators.min(0)]],
            total: [0, [Validators.required, Validators.min(0)]]
        });
        this.paymentForm = this.fb.group({
            bonoPunto: [0, [Validators.required, Validators.min(0)]],
            bonoCumple: [0, [Validators.required, Validators.min(0)]],
            bonoSoat: [0, [Validators.required, Validators.min(0)]],
            calibracion: [0, [Validators.required, Validators.min(0)]],
            cliente: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            clienteList: this.fb.array([]),
            datafono: [0, [Validators.required, Validators.min(0)]],
            descuento: [0, [Validators.required, Validators.min(0)]],
            devolucion: [0, [Validators.required, Validators.min(0)]],
            donacion: [0, [Validators.required, Validators.min(0)]],
            mantenimiento: [0, [Validators.required, Validators.min(0)]],
            prestamo: [0, [Validators.required, Validators.min(0)]],
            otro: [0, [Validators.required, Validators.min(0)]],
            otroDetalle: '',
            total: [0, [Validators.required, Validators.min(0)]]
        });
        this.cashForm = this.fb.group({
            proveedorList: this.fb.array([]),
            proveedor: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            proveedorAnticipoList: this.fb.array([]),
            Anticipos: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            OtrosList: this.fb.array([]),
            TotalOtros: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            reembolsoNum: 0,
            reembolso: [0, [Validators.required, Validators.min(0)]],
            servicioNom: '',
            servicioVal: [0, [Validators.required, Validators.min(0)]],
            otroNom: '',
            otroVal: [0, [Validators.required, Validators.min(0)]],
            totalEfe: [0, [Validators.required, Validators.min(0)]],
            total: [0, [Validators.required, Validators.min(0)]]
        });
        this.bankForm = this.fb.group({
            lubricanteVal: [0, [Validators.required, Validators.min(0)]],
            lubricanteDet: '',
            liquidoVal: [0, [Validators.required, Validators.min(0)]],
            liquidoDet: '',
            gasVal: [0, [Validators.required, Validators.min(0)]],
            gasDet: '',
            cusianaVal: [0, [Validators.required, Validators.min(0)]],
            cusianaDet: '',
            seguroVal: [0, [Validators.required, Validators.min(0)]],
            seguroDet: '',
            recaudo: [0, [Validators.required, Validators.min(0)]],
            total: [0, [Validators.required, Validators.min(0)]]
        });
        this.otherForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                const a = this.otherForm.getRawValue();
                let resCli = 0;
                a.clienteList.map(el => resCli += el.val);
                this.otherForm.get('cliente').setValue(resCli, this.emitFalse);
                this.otherForm.get('total').setValue(a.aprovVal + resCli + a.lubricante + a.otroVal + a.premio + a.prestamoVal + a.soatCom + a.soatValue + a.presLiq + a.cusiana, this.emitFalse);
            }, 10);
        });
        this.paymentForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                const a = this.paymentForm.getRawValue();
                let resCli2 = a.clienteList.reduce((a, b) => a + b.val, 0);
                this.paymentForm.get('cliente').setValue(resCli2, this.emitFalse);
                this.paymentForm.get('total').setValue((a.bonoSoat || 0) + (a.calibracion || 0) + (resCli2 || 0) + (a.datafono || 0) + (a.descuento || 0) + (a.devolucion || 0) + (a.donacion || 0) + (a.mantenimiento || 0) + (a.prestamo || 0) + (a.otro || 0) + (a.bonoCumple || 0) + (a.bonoPunto || 0), this.emitFalse);
            }, 10);
        });
        this.cashForm.valueChanges.subscribe(e => {
            let sum = 0;
            var sum2 = 0;
            var otroVal = 0;

            setTimeout(() => {
                const a = this.cashForm.getRawValue();
                a.proveedorList.map((e => sum += e.val));
                a.proveedorAnticipoList.map(e => sum2 += e.AntValor);
                a.OtrosList.map(e => otroVal += e.otroVal);

                const re = this.cashForm.get('reembolso').value;
                // this.cashForm.get('reembolsoNum').setValue(re);
                this.cashForm.get('reembolsoNum').setValue(re && re > 0 ? (this.pla_bef.DE_REEM_CAJ_MEN_NUM ? this.pla_bef.DE_REEM_CAJ_MEN_NUM : this.station.num_caja + 1) : 0, this.emitFalse);
                this.cashForm.get('proveedor').setValue(sum, this.emitFalse);
                this.cashForm.get('Anticipos').setValue(sum2, this.emitFalse);
                this.cashForm.get('TotalOtros').setValue(otroVal, this.emitFalse);
                this.cashForm.get('totalEfe').setValue(a.reembolso + a.servicioVal + otroVal, this.emitFalse);
                this.cashForm.get('total').setValue(sum + sum2 + this.cashForm.get('totalEfe').value, this.emitFalse);
            }, 10);
        });
        this.bankForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                const a = this.bankForm.getRawValue();
                this.bankForm.get('total').setValue(a.lubricanteVal + a.liquidoVal + a.gasVal + a.cusianaVal + a.seguroVal + a.recaudo, this.emitFalse);
            }, 10);
        });
    }

    createItemProvider() {
        return this.fb.group({
            nombre: { value: null, disabled: true },
            numero: { value: null, disabled: true },
            id: [null, Validators.required],
            val: [null, [Validators.required, Validators.min(0)]]
        });
    }

    createItemAnticProvider($event) {
        return this.fb.group({
            nitProveedor: [$event.proveedor, Validators.required],
            Provenombre: [$event.nombreProvee],
            Proveefecha: [''],
            AntValor: [$event.valor, [Validators.required, Validators.min(0)]],
            proveedor: $event.proveedor,
            valor: [$event.valor],
            detalle: [$event.detalle],
            estado: [3],
            factura: [null],
            fecha: this.fecha,
            rutaPago: null,
            novedadAnticipo: [],
            nombreProvee: $event.nombreProvee,
            idAnticipo: null
        });

    }
    createItemOtros() {
        return this.fb.group({
            id: [null],
            detalles: [null, [Validators.required, Validators.min(5)]],
            otroVal: [null, [Validators.required, Validators.min(0)]]
        });
    }
    borrarOtrosDB(id, indice) {
        Swal.fire({
            title: 'ELIMINAR OTROS',
            text: 'Esta a punto de borrarlo definitivamente, ¿Desea continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.value) {
                this.otrosAEliminar.push({ id: id });
                this.OtrosList.removeAt(indice);
            } else {
                return;
            }

        });

    }
    borrarAnticipoDB(idAnticipo, estado, indice) {
        if (estado == 4) {
            Swal.fire({
                title: 'ANTICIPO PROCESADO',
                text: 'Este anticipo ya fue aplicado a una Factura, NO SE PUEDE BORRAR',
                icon: 'info',
            })
            return;
        }
        Swal.fire({
            title: 'ELIMINAR ANTICIPO',
            text: 'Esta a punto de borrar un Anticipo Almacenado, ¿Desea continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.value) {
                this.anticiposAEliminar.push({ id: idAnticipo });
                this.proveedorAnticipoList.removeAt(indice);
            } else {
                return;
            }

        });


    }
    AgregarAnticipo($event) {
        this.anticipo = false;
        this.proveedorAnticipoList = this.cashForm.get('proveedorAnticipoList') as FormArray;

        if (this.existAnt($event) !== -1) {
            Swal.fire({
                title: 'ANTICIPO MISMO PROVEEDOR?',
                text: 'El proveedor ya existe en la lista de anticipos, ¿Desea agregar Otro?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    this.addItemAnticProvider($event);
                } else {
                    return;
                }

            });
        } else {
            this.addItemAnticProvider($event);
        }
        // this.addItemAnticProvider($event);
    }

    existAnt(val: any) {
        return this.proveedorAnticipoList.controls.findIndex(e => e.get('nitProveedor').value == val.proveedor);
    }

    addtOtrosList() {
        this.OtrosList = this.cashForm.get('OtrosList') as FormArray;
        this.OtrosList.push(this.createItemOtros());
    }

    removeItemOtrosList(indice: number) {
        this.OtrosList.removeAt(indice);
    }

    addItemAnticProvider($event) {

        this.proveedorAnticipoList.push(this.createItemAnticProvider($event));
    }

    removeItemAnticProvider(indice: number) {
        this.proveedorAnticipoList.removeAt(indice);
    }

    addItemProvider() {
        this.proveedorList = this.cashForm.get('proveedorList') as FormArray;
        this.proveedorList.push(this.createItemProvider());
        this.boolProvider(this.proveedorList.length - 1);
    }

    removeItemProvider() {
        this.proveedorList = this.cashForm.get('proveedorList') as FormArray;
        this.proveedorList.removeAt(this.proveedorList.length - 1);
    }

    deleteAllProvider() {
        while (this.proveedorList && this.proveedorList.length > 0) {
            this.removeItemProvider();
        }
    }
    removeItemAnticipo() {
        this.proveedorAnticipoList = this.cashForm.get('proveedorAnticipoList') as FormArray;
        this.proveedorAnticipoList.removeAt(this.proveedorAnticipoList.length - 1);
    }

    deleteAllAnticipos() {
        while (this.proveedorAnticipoList && this.proveedorAnticipoList.length > 0) {
            this.removeItemAnticipo();
        }
    }
    removeItemOtros() {
        this.OtrosList = this.cashForm.get('OtrosList') as FormArray;
        this.OtrosList.removeAt(this.OtrosList.length - 1);
    }

    deleteAllDeOtros() {
        while (this.OtrosList && this.OtrosList.length > 0) {
            this.removeItemOtros();
        }
    }


    createItemClient(val: boolean) {
        if (val) {
            return this.fb.group({
                codCliente: ['', Validators.required],
                nombre: { value: '', disabled: true },
                detalle: ['', Validators.required],
                anticipo: null,
                datafono: false,
                val: ['', [Validators.required, Validators.min(0)]]
            });
        } else {
            return this.fb.group({
                codCliente: ['', Validators.required],
                nombre: { value: '', disabled: true },
                anticipo: null,
                val: ['', [Validators.required, Validators.min(0)]]
            });
        }
    }

    removeItemClient(pos: number) {
        this.utilService.confirm('¿Desea eliminar este pago de esta planilla?', res => {
            if (res) {
                this.clienteList = this.otherForm.get('clienteList') as FormArray;
                const codCliForDelete = this.clienteList.controls[pos].get('codCliente').value;
                this.clienteList.removeAt(pos);
                if (this.pla_bef.PLA_DIA_PAG_CLI_DET && this.pla_bef.PLA_DIA_PAG_CLI_DET.length > 0) {
                    this.pla_bef.PLA_DIA_PAG_CLI_DET = this.pla_bef.PLA_DIA_PAG_CLI_DET.filter(e => e.COD_CLIENTE != codCliForDelete);
                }
                if (this.dataDailySheet.PLA_DIA_PAG_CLI_DET && this.dataDailySheet.PLA_DIA_PAG_CLI_DET.length > 0 && this.dataDailySheet.PLA_DIA_PAG_CLI_DET !== undefined) {
                    this.dataDailySheet.PLA_DIA_PAG_CLI_DET = this.dataDailySheet.PLA_DIA_PAG_CLI_DET.filter(e => e.COD_CLIENTE != codCliForDelete);
                }
            }
        });
    }

    deleteAllClient() {
        while (this.clienteList && this.clienteList.length > 0) {
            this.clienteList.removeAt(this.clienteList.length - 1);
        }
        while (this.clienteListVen && this.clienteListVen.length > 0) {
            this.clienteListVen.removeAt(this.clienteListVen.length - 1);
        }
    }

    btnCombustible() {
        if (this.planilla) {
            if (this.planilla == 'L') {
                if (this.station.sisLiq) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.station.sisGas) {
                return true;
            } else {
                return false;
            }
        }
    }

    get ventaTotal() {
        return this.cplSum + (this.salesTurn ? this.salesTurn.VALOR : 0) + this.otherForm.get('total').value;
    }

    get efectivoRecibido() {
        return this.ventaTotal - this.paymentForm.get('total').value;
    }

    get saldoCaja() {
        return this.efectivoRecibido + this.cajaCustodia - this.cashForm.get('total').value - this.bankForm.get('total').value;
    }

    assignCPL(hoses: EntHose[]) {
        this.CplDetail = [];
        let val;
        for (let index = 1; index <= this.station.turno; index++) {
            hoses.map(e => {
                if (e.CAM_VAL && e.FECHA.substring(0, 10) == this.fecha && !(index >= e.TURNO)) {
                    val = e.VALOR_ANT;
                } else {
                    val = e.VALOR;
                }
                this.CplDetail.push(
                    {
                        ID_CPL: null,
                        NUM_TUR: index,
                        COD_MAN: e.ID,
                        NUM_MAN: e.NUM_MAN,
                        COD_ART: e.ID_ARTICULO,
                        DET_ART: e.DESCRIPCION,
                        LEC_INI: 0,
                        LEC_FIN: null,
                        CANTIDAD: 0,
                        PRECIO: val,
                        TOTAL: 0,

                    });
            });
        }
        let date = new Date(this.fecha);
        date.setDate(date.getDate() - 1);
        const newFecha = date.toISOString().split('T')[0];
        this.utilService.loader(true);
        this.carteraService.getCPL(this.station.idEstacion, newFecha).subscribe(result => {
            this.utilService.loader(false);
            if (result.length == 1) {
                this.loadBeforeValues(result[0]);
            }
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    loadBeforeValues(value: EntCPL) {
        const NumTurn = value.DETALLE[value.DETALLE.length - 1].NUM_TUR;
        this.CplDetail.map(e => {
            if (e.NUM_TUR === 1) {
                try {
                    e.LEC_INI = value.DETALLE.find(f => f.NUM_TUR === NumTurn && e.COD_MAN == f.COD_MAN).LEC_FIN;
                } catch (error) {
                    this.principalComponent.showMsg('error', 'Error', 'Error crítico, comuniquese con el administrador.');
                }
            }
        });
    }

    submit(val) {
        switch (val) {
            case 0:
                this.show[0] = false;
                this.show[1] = true;
                focusById('OI');
                break;
            case 1:
                this.show[1] = false;
                this.show[2] = true;
                focusById('FP');
                break;
            case 2:
                this.show[2] = false;
                this.show[3] = true;
                focusById('DE');
                break;
            case 3:
                this.show[3] = false;
                this.show[4] = true;
                focusById('CB');
                break;
            case 4:
                this.show[4] = false;
                focusById(this.station.manual ? 'CAJA_CUST' : 'BTN_SAVE');
                break;
        }
    }

    getClassTurn(val) {
        switch (val) {
            case 1:
                return 'table-primary';
            case 2:
                return 'table-secondary';
            case 3:
                return 'table-success';
            case 4:
                return 'table-warning';
            case 5:
                return 'table-info';
        }
    }

    assignplanillaAnterior(plan: EntDailySheet) {
        this.bankForm.get('lubricanteDet').setValue(plan.CB_LUBRI_DET, this.emitFalse);
        this.bankForm.get('liquidoDet').setValue(plan.CB_LIQ_DET, this.emitFalse);
        this.bankForm.get('gasDet').setValue(plan.CB_GAS_DET, this.emitFalse);
        this.bankForm.get('cusianaDet').setValue(plan.CB_CUSIANA_DET, this.emitFalse);
        this.cajaCustodia = plan.SAL_FIN_CAJA;
        this.cajaGenMen = plan.CAJA_GRAL_MEN;
        this.carteraService.getDataToDailySheet(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
            if (res && res.length == 1) {
                this.assignData(res[0]);
            }
            this.dataDailySheet = res[0];
        });
    }

    assignData(val: EntDailySheet) {
        this.clienteList = this.otherForm.get('clienteList') as FormArray;
        if (val.PLA_DIA_PAG_CLI && val.PLA_DIA_PAG_CLI.length > 0) {
            val.PLA_DIA_PAG_CLI.forEach(e => {
                let ant, dat;
                if (e.TIPO_CLIENTE == 'A') {
                    ant = true;
                    dat = false;
                } else if (e.TIPO_CLIENTE == 'C') {
                    ant = null;
                    dat = false;
                } else {
                    ant = null;
                    dat = true;
                }
                this.clienteList.push(
                    this.fb.group({
                        codCliente: [e.COD_CLIENTE, Validators.required],
                        nombre: { value: e.NOMBRE, disabled: true },
                        anticipo: ant,
                        // datafono: dat, Se comenta para que predeterminer cartera y no datafono.
                        datafono: false,
                        val: [{ value: e.VALOR, disabled: true }, [Validators.required, Validators.min(0)]]
                    })
                );
            });
        }
        this.clienteListVen = this.paymentForm.get('clienteList') as FormArray;
        if (val.PLA_DIA_VEN_CLI && val.PLA_DIA_VEN_CLI.length > 0) {
            val.PLA_DIA_VEN_CLI.forEach(e => {
                this.clienteListVen.push(
                    this.fb.group({
                        codCliente: [e.COD_CLIENTE, Validators.required],
                        nombre: { value: e.NOMBRE, disabled: true },
                        anticipo: e.TIPO_CLIENTE == 'A',
                        val: [{ value: e.VALOR, disabled: true }, [Validators.required, Validators.min(0)]]
                    })
                );
            });
        }
    }

    getSalesTurn() {
        if (!this.fecha) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'El campo fecha está vacío.');
            return;
        }
        if (!this.planilla) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'Selecciones el tipo de planilla.');
            return;
        }
        // this.carteraService.getDailySheetBefore(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
        //   if (res.length == 1)
        //     this.assignplanillaAnterior(res[0]);
        // }, error => {
        //   this.principalComponent.showMsg('error', 'Error', error.error.message);
        //   console.log(error);
        // });
        this.utilService.loader(true);
        this.carteraService.getSalesTurn(this.station.idEstacion, this.planilla, true, null, this.fecha, this.fecha).subscribe(result => {
            console.log(result);
            this.utilService.loader(false);
            if (result.length > 0) {
                this.cant = result[0].DETALLE.reduce((a, b) => a + b.CANTIDAD, 0);
                this.salesTurn = result[0];
                this.show[0] = true;
                this.salesTurnBefore = JSON.parse(JSON.stringify(result[0]));
                this.lock = true;
            } else {
                this.principalComponent.showMsg('info', 'Información', 'Sin resultados');
            }
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    getNameArticle(val: number) {
        if (val == null || this.articles == null) {
            return;
        }
        try {
            return this.articles.find(e => e.ID == val).DESCRIPCION;
        } catch (error) {
            return '';
        }
    }

    selItem(val: EntSalesTurnDetail) {
        this.itemSel = val;
        this.turno = val.NUM_TURNO;
        this.index = this.salesTurn.DETALLE.findIndex(e => e == val);
        this.boolEdit = true;
        setTimeout(() => {
            focusById('turnoedit');
        }, 100);
    }

    hide() {
        if (!(Number.isInteger(this.itemSel.NUM_TURNO) && this.itemSel.NUM_TURNO > 0 && this.itemSel.NUM_TURNO <= this.station.turno)) {
            this.itemSel.NUM_TURNO = this.salesTurnBefore.DETALLE[this.index].NUM_TURNO;
            this.principalComponent.showMsg('error', 'Error', 'Numero de turno no permitido');
        }
        this.itemSel.EDITADO = this.salesTurnBefore.DETALLE[this.index].NUM_TURNO == this.itemSel.NUM_TURNO ? false : true;
        this.boolEdit = false;
    }

    assignSheet(val: string) {
        this.planilla = val;
        if (val == 'G') {
            this.otherForm.get('presLiq').setValue(0, [Validators.required, Validators.min(0)]);
            this.otherForm.get('cusiana').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('bonoCumple').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('bonoPunto').setValue(0, [Validators.required, Validators.min(0)]);
            this.otherForm.get('presLiq').enable();
            this.otherForm.get('cusiana').enable();
            this.paymentForm.get('bonoCumple').enable();
            this.paymentForm.get('bonoPunto').enable();
            this.otherForm.get('prestamoVal').setValue(0);
            this.otherForm.get('prestamoNom').setValue('');
            this.otherForm.get('prestamoVal').disable();
            this.otherForm.get('prestamoNom').disable();
            this.paymentForm.get('descuento').setValue(0);
            this.paymentForm.get('devolucion').setValue(0);
            this.paymentForm.get('donacion').setValue(0);
            this.paymentForm.get('mantenimiento').setValue(0);
            this.paymentForm.get('prestamo').setValue(0);
            this.paymentForm.get('descuento').disable();
            this.paymentForm.get('devolucion').disable();
            this.paymentForm.get('donacion').disable();
            this.paymentForm.get('mantenimiento').disable();
            this.paymentForm.get('prestamo').disable();
            this.bankForm.get('liquidoVal').setValue(0);
            this.bankForm.get('liquidoDet').setValue('');
            this.bankForm.get('liquidoVal').disable();
            this.bankForm.get('liquidoDet').disable();
            this.bankForm.get('gasVal').enable();
            this.bankForm.get('gasDet').enable();
            this.bankForm.get('cusianaVal').enable();
            this.bankForm.get('cusianaDet').enable();
            this.bankForm.get('gasVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.bankForm.get('gasDet').setValue('');
            this.bankForm.get('cusianaVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.bankForm.get('cusianaDet').setValue('');
        } else if (val == 'L') {
            this.paymentForm.get('descuento').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('devolucion').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('donacion').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('mantenimiento').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('prestamo').setValue(0, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('descuento').enable();
            this.paymentForm.get('devolucion').enable();
            this.paymentForm.get('donacion').enable();
            this.paymentForm.get('mantenimiento').enable();
            this.paymentForm.get('prestamo').enable();
            this.otherForm.get('presLiq').setValue(0);
            this.otherForm.get('cusiana').setValue(0);
            this.paymentForm.get('bonoCumple').setValue(0);
            this.paymentForm.get('bonoPunto').setValue(0);
            this.otherForm.get('presLiq').disable();
            //this.otherForm.get('cusiana').disable();
            this.paymentForm.get('bonoCumple').disable();
            this.paymentForm.get('bonoPunto').disable();
            this.otherForm.get('prestamoVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.otherForm.get('prestamoNom').setValue(0, [Validators.required, Validators.min(0)]);
            this.otherForm.get('prestamoVal').enable();
            this.otherForm.get('prestamoNom').enable();
            this.bankForm.get('liquidoVal').enable();
            this.bankForm.get('liquidoDet').enable();
            this.bankForm.get('liquidoVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.bankForm.get('liquidoDet').setValue('');
            this.bankForm.get('gasVal').disable();
            this.bankForm.get('gasDet').disable();
            //this.bankForm.get('cusianaVal').disable();
            //this.bankForm.get('cusianaDet').disable();
            this.bankForm.get('gasVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.bankForm.get('gasDet').setValue('');
            this.bankForm.get('cusianaVal').setValue(0, [Validators.required, Validators.min(0)]);
            this.bankForm.get('cusianaDet').setValue('');
        }
    }

    assignProvider(val: EntInvoice) {
        // let a = this.proveedorList.controls[this.indexselProvider] as FormGroup;
        // a.get('nit').setValue(val.nit, this.emitFalse);
        // a.get('nombre').setValue(val.nombre, this.emitFalse);
        // focusById('DetPro-' + this.indexselProvider);
        // this.boolSearchProvider = false;
        // this.indexselProvider = null;
        if (this.existItem(val) == -1) {
            const a = this.proveedorList.controls[this.indexselProvider] as FormGroup;
            a.get('nombre').setValue(val.nombre, this.emitFalse);
            a.get('numero').setValue(val.numero, this.emitFalse);
            a.get('id').setValue(val.id, this.emitFalse);
            a.get('val').setValue(val.saldo);
            focusById('ValPro-' + this.indexselProvider);
            this.boolSearchProvider = false;
            this.indexselProvider = null;
        } else {
            this.principalComponent.showMsg('info', 'Información', 'Esta factura ya fue agregada');
        }
    }

    existItem(val: EntInvoice) {
        return this.proveedorList.controls.findIndex(e => e.get('id').value == val.id);
    }

    boolProvider(val) {
        this.indexselProvider = val;
        this.boolSearchProvider = true;
        setTimeout(() => {
            focusById('searchPro');
        }, 50);
    }

    json(val) {
        if (val) {
            return JSON.stringify(val);
        }
    }

    setDailyType(val) {
        this.planilla = val;
        this.getSalesTurn();
    }

    getDailySheet(date: string, station: number, type: string) {
        this.utilService.confirm('¿Desea imprimir la planilla?', result => {
            if (result) {
                this.utilService.loader(true);
                this.carteraService.getDailySheet(station, type, date).subscribe(res0 => {
                    this.utilService.loader(false);
                    if (res0.length == 1) {
                        this.utilService.loader(true);
                        this.printService.printSheetDailyEasy(res0[0], true, res =>
                            this.principalComponent.showMsg('error', 'error', res)
                        );
                    } else {
                        this.principalComponent.showMsg('error', 'Error', 'Imposible obtener datos de la empresa de las estación.');
                    }
                }, error => {
                    this.utilService.loader(false);
                    console.log(error);
                    this.principalComponent.showMsg('error', 'Error', error.error.message);
                });
            }
        });
    }
}
