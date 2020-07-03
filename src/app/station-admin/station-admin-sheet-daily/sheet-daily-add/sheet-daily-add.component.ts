import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { EntSalesTurn } from '../../../Class/EntSalesTurn';
import { EntArticle } from '../../../Class/EntArticle';
import { forkJoin } from 'rxjs';
import { EntSalesTurnDetail } from '../../../Class/EntSalesTurnDetail';
import { fadeTransition } from '../../../routerAnimation';
import { EntCPL_Detalle } from '../../../Class/EntCPL_Detalle';
import { EntHose } from '../../../Class/EntHose';
import { EntCPL } from '../../../Class/EntCPL';
import { EntDailySheet } from '../../../Class/EntDailySheet';
import { EntDailySheetPagCli } from '../../../Class/EntDailySheetPagCli';
import { EntDailySheetPagPro } from '../../../Class/EntDailySheetPagPro';
import { EntDailySheetTurnDet } from '../../../Class/EntDailySheetTurnDet';
import { PrintService } from '../../../services/print.service';
import { EntDailySheetTurn } from '../../../Class/EntDailySheetTurn';
import { cleanString, currencyNotDecimal, focusById, dateToISOString, addDays } from '../../../util/util-lib';
import { EntDailySheetVenCli } from '../../../Class/EntDailySheetVenCli';
import { EntInvoice } from '../../../Class/EntInvoice';
import { ComponentCanDeactivate } from '../../../guards/component-can-deactivate';
import { EntDailyAttachedType } from '../../../Class/EntDailySheetAttachedType';
import { EntAdvance } from '../../../Class/EntAdvance';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EntOtrosPagos } from '../../../Class/EntOtrosPagos';

@Component({
    selector: 'app-sheet-daily-add',
    templateUrl: './sheet-daily-add.component.html',
    styleUrls: ['./sheet-daily-add.component.css'],
    animations: [fadeTransition()]
})

export class SheetDailyAddComponent extends ComponentCanDeactivate implements OnInit {
    canDeactivate(): boolean {
        let val: boolean;
        val = !(this.paymentForm.dirty || this.bankForm.dirty || this.cashForm.dirty || this.otherForm.dirty || this.salesTurn != null || this.CplDetail.length > 0);
        return val;
    }
    // tslint:disable-next-line: member-ordering
    notdecimal = currencyNotDecimal();
    station: EntStation;
    paymentForm: FormGroup;
    // tslint:disable-next-line: member-ordering
    cashForm: FormGroup;
    // tslint:disable-next-line: member-ordering
    bankForm: FormGroup;
    attachedForm: FormGroup;
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
    show = [false, false, false, false, false, false];

    proveedorList: FormArray;

    clienteList: FormArray;
    clienteListVen: FormArray;

    showItemProvider = true;
    showItemClient = true;
    showItemClientVen = true;

    anticipo: boolean = false;
    anticProveeForm: FormGroup;
    OtrosList: FormArray;
    proveedorAnticipoList: FormArray;
    showItemPAnticipo = true;
    showItemOtros = true;
    otherForm: FormGroup;


    planilla = null;
    lock = false;
    CplDetail: EntCPL_Detalle[] = [];
    cplSum = 0;
    cplTotalGalones = 0;
    cpl: EntCPL;
    TotalSumaEnc = 0;

    emitFalse = { emitEvent: false };
    cajaCustodia = 0;
    cajaGenMen = 0;
    boolSave = false;
    dataDaily: EntDailySheet;
    pagBank = 0;
    cant = null;
    fileToUp = [null, null, null, null, null, null, null, null, null, null];

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
        this.title.setTitle('Crear Planilla - Simovil');
        this.initial();

    }

    ngOnInit() {
        this.buildForms();
    }

    initial() {
        this.utilService.loader(true);
        forkJoin(
            this.carteraService.getArticles(),
            this.nominaService.GetStations(this.storageService.getCurrentStation()),
            this.carteraService.getAttachedTypes()
        ).subscribe(([res1, res2, res3]) => {
            this.assignAttachedTypes(res3);
            if (res2.length === 1) {
                this.station = res2[0];
                switch (this.station.tipoEstacion) {
                    case 1:
                        // this.planilla = 'G';
                        this.assignSheet('G');

                        break;
                    case 2:

                        // this.planilla = 'L';
                        this.assignSheet('L');
                        break;
                }
            }
            this.articles = res1;
            this.utilService.loader(false);
        });

    }

    validForm(): boolean {
        var res = true;
        // this.salesTurn.DETALLE.find(e => e.NUM_TURNO > this.station.turno) != null ? (this.principalComponent.showMsg('error', 'Error', 'Existe turnos mayores a lo permitido por la estación.'), res = false) : null;
        !this.otherForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Otros ingresos, incompleto.'), res = false) : null;
        !this.paymentForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Formas de pago, incompleto.'), res = false) : null;
        !this.cashForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Distribución del efectivo, incompleto.'), res = false) : null;
        !this.bankForm.valid ? (this.principalComponent.showMsg('error', 'Error', 'Consignación de bancos, incompleto.'), res = false) : null;
        return res;
    }

    CPL_TO_SHEET(): EntDailySheetTurn[] {
        var pla_dia_turn: EntDailySheetTurn[] = [];
        for (let index = 1; index <= this.station.turno; index++) {
            const element = this.CplDetail.filter(e => e.NUM_TUR == index);
            const turn_det: EntDailySheetTurnDet[] = [];
            let codArticulos: { COD_ART: number, PRECIO: number, NOM_ART: string }[] = [];
            element.map(e => {
                if (!codArticulos.some(art => art.COD_ART == e.COD_ART && art.PRECIO == e.PRECIO)) {
                    codArticulos.push({ COD_ART: e.COD_ART, PRECIO: e.PRECIO, NOM_ART: e.DET_ART });
                }
            });
            codArticulos.map(art => {
                var sumCArt = element.filter(e => e.PRECIO == art.PRECIO && e.COD_ART == art.COD_ART).reduce((a, b) =>
                    a + b.CANTIDAD, 0);
                var sumVArt = element.filter(e => e.PRECIO == art.PRECIO && e.COD_ART == art.COD_ART).reduce((a, b) =>
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
        planilla.TIPO = this.planilla;
        planilla.FECHA = this.fecha;
        planilla.CREADO = new Date().toISOString().split('T')[0];
        planilla.ID_ESTACION = this.station.idEstacion;
        planilla.NOM_ADM = this.station.administrador;
        var sumaTurn = 0;
        var sumaCTurn = 0;
        // VENTAS
        planilla.PLA_DIA_TUR = [];
        if (this.CplDetail && this.CplDetail.length > 0) {
            planilla.PLA_DIA_TUR = this.CPL_TO_SHEET();
            planilla.CPL = { ID_ESTACION: this.station.idEstacion, FECHA: this.fecha, VALOR: this.cplSum, DETALLE: this.CplDetail };
            planilla.V_TOTAL = this.cplSum;
            planilla.V_CANT = planilla.PLA_DIA_TUR.reduce((a, b) => a + b.CANT_VENTA, 0);
        } else if (this.salesTurn && this.salesTurn.DETALLE && this.salesTurn.DETALLE.length > 0) {
            // agregar validacion de numeros de turnos editados.
            for (let index = 1; index <= this.station.turno; index++) {
                const element = this.salesTurn.DETALLE.filter(e => e.NUM_TURNO === index);
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
        let OI = this.otherForm.getRawValue();
        let listclient: EntDailySheetPagCli[] = [];
        var car = 0;
        var dat = 0;
        var ant = 0;
        OI.clienteList.map(e => {
            e.anticipo ? ant += e.val : e.datafono ? dat += e.val : car += e.val;
        });
        if (this.dataDaily.PLA_DIA_PAG_CLI_DET && this.dataDaily.PLA_DIA_PAG_CLI_DET.length >= 0 && this.dataDaily.PLA_DIA_PAG_CLI_DET !== undefined) {

            this.dataDaily.PLA_DIA_PAG_CLI_DET.map(e => {
                listclient.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
            });
        }
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
        let FP = this.paymentForm.getRawValue();
        let listclientVen: EntDailySheetVenCli[] = [];
        var car2 = 0;
        var ant2 = 0;
        FP.clienteList.map(e => {
            e.anticipo ? ant2 += e.val : car2 += e.val;
        });
        if (this.dataDaily.PLA_DIA_VEN_CLI && this.dataDaily.PLA_DIA_VEN_CLI.length > 0) {
            this.dataDaily.PLA_DIA_VEN_CLI_DET.map(e => {
                listclientVen.push({ ID: e.ID, COD_CLIENTE: e.COD_CLIENTE, TIPO_CLIENTE: e.TIPO_CLIENTE, VALOR: e.VALOR });
            });
        }
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
        let listprovider: EntDailySheetPagPro[] = [];
        let listAnticiposAProvee: EntAdvance[] = [];
        let listOtrosPagos: EntOtrosPagos[] = [];

        var sum = 0;
        var TotalOtros = 0;
        let DetallesOtros: string = 'DETALLES :';
        DE.proveedorList.map(e => {
            sum += e.val;
            listprovider.push({ ID_FACTURA: e.id, VALOR: e.val, DETALLE: 'ABONO POR PLANILLA' });
        });

        DE.OtrosList.map((e: any) => {
            TotalOtros += e.otroVal;
            DetallesOtros += ' ' + e.detalles + ' VALOR: ' + e.otroVal;
            listOtrosPagos.push({
                id: e.id,
                detalles: e.detalles,
                valor: e.otroVal
            });
        });

        DE.proveedorAnticipoList.map((e: any) => {
            listAnticiposAProvee.push({
                proveedor: e.proveedor,
                valor: e.valor,
                detalle: 'ANTICIPO POR PLANILLA DIARIA - ' + 'VALOR: ' + e.valor + ' ' + e.detalle,
                estado: e.estado,
                factura: e.factura,
                fecha: e.fecha,
                rutaPago: e.rutaPago,
            });
        });

        planilla.DE_PROV = DE.proveedor;
        planilla.DE_REEM_CAJ_MEN_NUM = Number.isInteger(DE.reembolsoNum) ? +DE.reembolsoNum : null;
        planilla.DE_REEM_CAJ_MEN = DE.reembolso;
        planilla.DE_SERV_PUB_DET = cleanString(DE.servicioNom);
        planilla.DE_SERV_PUB = DE.servicioVal;
        planilla.DE_OTRO_DET = DetallesOtros;
        planilla.DE_OTRO = TotalOtros;
        planilla.DE_TOTAL_EFE = DE.totalEfe;
        planilla.DE_TOTAL = DE.total;
        planilla.DE_ANT_PROV = listAnticiposAProvee;
        planilla.DE_OTROS_PAGOS = listOtrosPagos;

        // CONSIGNACION EN BANCOS
        let CB = this.bankForm.getRawValue();
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
        planilla.FILES = this.fileToUp;
        console.log(planilla);
        this.showPreview(planilla, val);

        this.boolSave = true;
    }

    showPreview(planilla: EntDailySheet, val: boolean) {
        if (val) {
            this.utilService.confirm('¿Desea guardar la planilla?', res => {
                if (res) {
                    this.insertDailySheet(planilla);
                }
            });
        } else {
            this.printDailySheet(planilla, true);
        }
    }

    insertDailySheet(planilla: EntDailySheet) {
        var person = prompt('Inserte su código', '');
        if (person == null || person == '') {
            this.principalComponent.showMsg('info', 'Cancelado', 'Cancelado por no ingresar el código');
        } else {
            this.utilService.loader();
            this.carteraService.getCodeStation(planilla.ID_ESTACION, person).subscribe(res => {
                if (res.length == 1) {
                    planilla.NOM_REA = res[0].NOMBRE;
                    this.carteraService.InsertDailySheet(planilla).subscribe(result => {
                        this.resetPlanilla(false);
                        this.utilService.loader(false);
                        this.principalComponent.showMsg('success', 'Éxito', 'Insertado correctamente');
                        this.getDailySheet(planilla.FECHA, planilla.ID_ESTACION, planilla.TIPO);
                    }, error => {
                        this.utilService.loader(false);
                        console.log(error);
                        this.principalComponent.showMsg('error', 'Error', error.error.message);
                    });
                } else {
                    this.utilService.loader(false);
                    this.principalComponent.showMsg('error', 'Error', 'Código sin resultados');
                }
            }, error => {
                console.log(error);
                this.principalComponent.showMsg('error', 'Error', error.error.message);
                this.utilService.loader(false);
            });
        }
    }

    printDailySheet(planilla: EntDailySheet, open?: boolean) {
        this.utilService.loader(true);
        this.printService.printSheetDailyEasy(planilla, open, res => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'error', res);
        }
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
        this.resetAttachedForm();
        this.salesTurn = null;
        this.salesTurnBefore = null;
        this.CplDetail = [];
        this.show = [false, false, false, false, false];
        this.deleteAllClient();
        this.deleteAllProvider();
        this.cajaCustodia = 0;
        this.cajaGenMen = 0;
        this.boolSave = false;
        this.cant = null;
        this.cpl = null;
        this.cplTotalGalones = 0;
        this.TotalSumaEnc = 0;
        this.initial();
    }

    updateCPL(val: EntCPL_Detalle) {
        if (val.NUM_TUR < this.station.turno) {
            this.CplDetail.find(e => e.NUM_TUR == val.NUM_TUR + 1 && e.COD_MAN == val.COD_MAN).LEC_INI = val.LEC_FIN;
        }
        // val.CANTIDAD = (val.LEC_FIN - val.LEC_INI);
        // val.CANTIDAD = Math.round((val.LEC_FIN - val.LEC_INI) * 100) / 100;
        val.CANTIDAD = +(+val.LEC_FIN - +val.LEC_INI).toFixed(3);
        val.TOTAL = val.PRECIO * val.CANTIDAD;
        let arraySum = [];
        this.cplTotalGalones = 0;
        this.CplDetail.map(e => {
            arraySum.push(e.TOTAL);
            this.cplTotalGalones += e.CANTIDAD;
        });
        this.cplSum = arraySum.reduce((a, b) => a + b, 0);
    }

    agregarLecFinCPL() {
        console.log('termino');
    }

    buildForms() {
        this.otherForm = this.fb.group({
            lubricante: [null, [Validators.required, Validators.min(0)]],
            soatRef: [null],
            soatValue: [null, [Validators.required, Validators.min(0)]],
            soatCom: [null, [Validators.required, Validators.min(0)]],
            soatVen: [null, [Validators.required, Validators.min(0)]],
            soatAnu: [null, [Validators.required, Validators.min(0)]],
            soatReem: [null, [Validators.required, Validators.min(0)]],
            premio: [null, [Validators.required, Validators.min(0)]],
            aprovNom: null,
            aprovVal: [null, [Validators.required]],
            cliente: null,
            clienteList: this.fb.array([]),
            presLiq: [null, [Validators.required, Validators.min(0)]],
            cusiana: [null, [Validators.required, Validators.min(0)]],
            otroNom: null,
            otroVal: [null, [Validators.required, Validators.min(0)]],
            prestamoNom: null,
            prestamoVal: [null, [Validators.required, Validators.min(0)]],
            total: [null, [Validators.required, Validators.min(0)]]
        });

        this.paymentForm = this.fb.group({
            bonoPunto: [null, [Validators.required, Validators.min(0)]],
            bonoCumple: [null, [Validators.required, Validators.min(0)]],
            bonoSoat: [null, [Validators.required, Validators.min(0)]],
            calibracion: [null, [Validators.required, Validators.min(0)]],
            cliente: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            clienteList: this.fb.array([]),
            datafono: [null, [Validators.required, Validators.min(0)]],
            descuento: [null, [Validators.required, Validators.min(0)]],
            devolucion: [null, [Validators.required, Validators.min(0)]],
            donacion: [null, [Validators.required, Validators.min(0)]],
            mantenimiento: [null, [Validators.required, Validators.min(0)]],
            prestamo: [null, [Validators.required, Validators.min(0)]],
            otro: [null, [Validators.required, Validators.min(0)]],
            otroDetalle: null,
            total: [null, [Validators.required, Validators.min(0)]]
        });
        this.cashForm = this.fb.group({
            proveedorList: this.fb.array([]),
            proveedor: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            proveedorAnticipoList: this.fb.array([]),
            Anticipos: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            OtrosList: this.fb.array([]),
            TotalOtros: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
            reembolsoNum: null,
            reembolso: [null, [Validators.required, Validators.min(0)]],
            servicioNom: null,
            servicioVal: [null, [Validators.required, Validators.min(0)]],
            otroNom: null,
            otroVal: [null],
            totalEfe: [null, [Validators.required, Validators.min(0)]],
            total: [null, [Validators.required, Validators.min(0)]]
        });

        this.bankForm = this.fb.group({
            lubricanteVal: [null, [Validators.required, Validators.min(0)]],
            lubricanteDet: null,
            liquidoVal: [null, [Validators.required, Validators.min(0)]],
            liquidoDet: null,
            gasVal: [null, [Validators.required, Validators.min(0)]],
            gasDet: null,
            cusianaVal: [null, [Validators.required, Validators.min(0)]],
            cusianaDet: null,
            seguroVal: [null, [Validators.required, Validators.min(0)]],
            seguroDet: null,
            recaudo: [null, [Validators.required, Validators.min(0)]],
            total: [null, [Validators.required, Validators.min(0)]]
        });
        this.attachedForm = this.fb.group({
            attachedTypes: this.fb.array([])
        });
        this.otherForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                let a = this.otherForm.getRawValue();
                var resCli = 0;
                a.clienteList.map(el => resCli += el.val);
                this.otherForm.get('cliente').setValue(resCli, this.emitFalse);
                this.otherForm.get('total').setValue(a.aprovVal + resCli + a.lubricante + a.otroVal + a.premio + a.prestamoVal + a.soatCom + a.soatValue + a.presLiq + a.cusiana, this.emitFalse);
            }, 10);
        });
        this.paymentForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                let a = this.paymentForm.getRawValue();
                var resCli2 = a.clienteList.reduce((a, b) => a + b.val, 0);
                this.paymentForm.get('cliente').setValue(resCli2, this.emitFalse);
                this.paymentForm.get('total').setValue((a.bonoSoat || 0) + (a.calibracion || 0) + (resCli2 || 0) + (a.datafono || 0) + (a.descuento || 0) + (a.devolucion || 0) + (a.donacion || 0) + (a.mantenimiento || 0) + (a.prestamo || 0) + (a.otro || 0) + (a.bonoCumple || 0) + (a.bonoPunto || 0), this.emitFalse);
            }, 10);
        });
        this.cashForm.valueChanges.subscribe(e => {
            var sum = 0;
            var sum2 = 0;
            var otroVal = 0;
            setTimeout(() => {
                let a = this.cashForm.getRawValue();

                a.proveedorList.map(e => sum += e.val);
                a.proveedorAnticipoList.map(e => sum2 += e.AntValor);
                a.OtrosList.map(e => otroVal += e.otroVal);

                let re = this.cashForm.get('reembolso').value;
                this.cashForm.get('reembolsoNum').setValue(re && re > 0 ? this.station.num_caja + 1 : null, this.emitFalse);
                this.cashForm.get('proveedor').setValue(sum, this.emitFalse);
                this.cashForm.get('Anticipos').setValue(sum2, this.emitFalse);
                this.cashForm.get('TotalOtros').setValue(otroVal, this.emitFalse);
                this.cashForm.get('totalEfe').setValue(a.reembolso + a.servicioVal + otroVal, this.emitFalse);
                this.cashForm.get('total').setValue(sum + sum2 + this.cashForm.get('totalEfe').value, this.emitFalse);
            }, 10);
        });

        this.bankForm.valueChanges.subscribe(e => {
            setTimeout(() => {
                let a = this.bankForm.getRawValue();
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
            nombreProvee: $event.nombreProvee
        });


    }
    createItemOtros() {
        return this.fb.group({
            detalles: [null, [Validators.required, Validators.min(5)]],
            otroVal: [null, [Validators.required, Validators.min(0)]]
        });
    }

    get bankLub() { return this.bankForm.get('lubricanteDet').value; }
    get bankLiq() { return this.bankForm.get('liquidoDet').value; }
    get bankGas() { return this.bankForm.get('gasDet').value; }




    AgregarAnticipo($event) {
        this.anticipo = false;
        this.proveedorAnticipoList = this.cashForm.get('proveedorAnticipoList') as FormArray;

        console.log(this.existAnt($event));

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
        //this.addItemAnticProvider($event);
    }

    addtOtrosList() {
        this.OtrosList = this.cashForm.get('OtrosList') as FormArray;
        this.OtrosList.push(this.createItemOtros());
    }

    removeItemOtrosList(indice: number) {
        this.OtrosList.removeAt(indice);
    }

    addItemAnticProvider($event) {
        // this.proveedorAnticipoList = this.cashForm.get('proveedorAnticipoList') as FormArray;
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

    setlubri() {
        let a = this.otherForm.get('lubricante').value;
        this.bankForm.get('lubricanteVal').setValue(a);
    }

    setSoatRef() {
        let a = this.otherForm.get('soatRef').value;
        this.bankForm.get('seguroDet').setValue(a, this.emitFalse);
        let b = this.otherForm.get('soatValue').value;
        this.bankForm.get('seguroVal').setValue(b);
    }

    assignData(val: EntDailySheet) {
        this.pagBank = 0;
        this.deleteAllClient();
        // this.deleteAllProvider(); Se comenta para evitar eliminar proveedores insertados
        this.dataDaily = val;
        this.clienteList = this.otherForm.get('clienteList') as FormArray;

        if (val.PLA_DIA_PAG_CLI && val.PLA_DIA_PAG_CLI.length > 0) {
            val.PLA_DIA_PAG_CLI.forEach(e => {
                if (e.FORMA_PAGO && e.FORMA_PAGO == 1) {
                    this.pagBank += e.VALOR;
                }
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
        if (!(this.bankForm.get('recaudo').value && this.bankForm.get('recaudo').value > 0)) {
            this.bankForm.get('recaudo').setValue(this.pagBank);
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

    removeItemClient(pos: number) {
        this.utilService.confirm('¿Desea eliminar este pago de esta planilla?', res => {
            if (res) {
                this.clienteList = this.otherForm.get('clienteList') as FormArray;
                this.clienteList.removeAt(pos);
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

    get btnCombustible() {
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
        } else {
            return;
        }
    }

    createDailySheet() {
        if (!this.fecha) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'El campo fecha está vacío.');
            return;
        } else if (!this.planilla) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'Selecciones el tipo de planilla.');
            return;
        } else if (this.btnCombustible != null) {
            if (this.btnCombustible) {
                this.getSalesTurn();
            } else {
                this.createCPL();
                //this.getcplorsales();
            }
        }
    }
    getcplorsales() {
        if (this.planilla == 'L' && !this.station.sisLiq) {
            // CPL
            this.carteraService.getCPL(this.station.idEstacion, this.fecha).subscribe(result => {
                this.utilService.loader(false);
                if (result.length == 1) {
                    this.assignCPLToEdit(result[0]);
                    this.principalComponent.showMsg('info', 'INFORMACION', 'Se encontró datos de CPL');
                } else {
                    this.principalComponent.showMsg('info', 'CPL', 'CPL sin Datos');
                }
            }, error => {
                console.log(error);
                this.utilService.loader(false);
                this.principalComponent.showMsg('error', 'Error', error.error.message);
            });
        }
    }
    assignCPLToEdit(val: EntCPL) {
        this.cpl = val;
        this.CplDetail = val.DETALLE;
        const arraySum = [];
        this.cplTotalGalones = 0;
        this.CplDetail.map(e => {
            e.TOTAL = (e.LEC_FIN - e.LEC_INI) * e.PRECIO;
            e.NUM_MAN = e.COD_MAN;
            e.DET_ART = this.articles.find(a => a.ID == e.COD_ART).DESCRIPCION || '';
            arraySum.push(e.TOTAL);
            this.cplTotalGalones += e.CANTIDAD;
        });
        this.cplSum = Math.round( arraySum.reduce((a, b) => a + b, 0));
        this.TotalSumaEnc = this.cplSum;
    }


    get ventaTotal() {
        return this.cplSum + (this.salesTurn ?  Math.round(this.salesTurn.VALOR) : 0) + this.otherForm.get('total').value;
    }

    get efectivoRecibido() {
        return this.ventaTotal - this.paymentForm.get('total').value;
    }

    get saldoCaja() {
        return this.efectivoRecibido + this.cajaCustodia - this.cashForm.get('total').value - this.bankForm.get('total').value;
    }

    createCPL() {
        if (!(this.station.turno && Number.isInteger(this.station.turno))) {
            this.principalComponent.showMsg('error', 'Error', 'No tiene configurado la cantidad de turnos.');
            return;
        }
        this.carteraService.getDailySheet(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
            if (res && res.length > 0) {
                this.principalComponent.showMsg('error', 'Error', 'La planilla con esa fecha ya existe.');
            } else {
                this.assignplanillaAnterior();
                this.utilService.loader(true);
                this.carteraService.getHose(this.station.idEstacion).subscribe(result => {
                    this.utilService.loader(false);
                    if (result.length > 0) {
                        this.assignCPL(result);
                    } else {
                        this.principalComponent.showMsg('info', 'Información', 'Sin resultados.');
                    }
                }, error => {
                    this.utilService.loader(false);
                    console.log(error);
                    this.principalComponent.showMsg('error', 'Error', error.error.message);
                });
                this.lock = true;
                this.show[0] = true;
            }
        });
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
        var date = new Date(this.fecha);
        date.setDate(date.getDate() - 1);
        let newFecha = date.toISOString().split('T')[0];
        this.utilService.loader(true);

        // Obtiene las ultimas Lecturas
        this.carteraService.getCPL(this.station.idEstacion, newFecha).subscribe(result => {
            this.utilService.loader(false);
            if (result.length == 1) {

                this.loadBeforeValues(result[0]);
            }
            this.getcplorsales();
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    loadBeforeValues(value: EntCPL) {
        let NumTurn = value.DETALLE[value.DETALLE.length - 1].NUM_TUR;
        this.CplDetail.map(e => {
            if (e.NUM_TUR === 1) {
                try {
                    e.LEC_INI = value.DETALLE.find(f => f.NUM_TUR === NumTurn && e.COD_MAN === f.COD_MAN).LEC_FIN;
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
                this.show[5] = true;
                // focusById(this.station.manual ? 'CAJA_CUST' : 'BTN_SAVE');
                break;
            case 5:
                this.show[5] = false;
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

    assignplanillaAnterior() {
        this.carteraService.getDataToDailySheet(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
            if (res && res.length == 1) {
                this.assignData(res[0]);
            }
        });
        this.carteraService.getDailySheetBefore(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
            if (res.length == 1) {
                this.bankForm.get('lubricanteDet').setValue(res[0].CB_LUBRI_DET);
                this.bankForm.get('liquidoDet').setValue(res[0].CB_LIQ_DET);
                this.bankForm.get('gasDet').setValue(res[0].CB_GAS_DET);
                this.bankForm.get('cusianaDet').setValue(res[0].CB_CUSIANA_DET);
                this.cajaCustodia = res[0].SAL_FIN_CAJA;
                this.cajaGenMen = res[0].CAJA_GRAL_MEN;
            }
        }, error => {
            this.principalComponent.showMsg('error', 'Error', error.error.message);
            console.log(error);
        });
    }

    getSalesTurn() {
        this.carteraService.getDailySheet(this.station.idEstacion, this.planilla, this.fecha).subscribe(res => {
            if (res && res.length > 0) {
                this.principalComponent.showMsg('error', 'Error', 'La planilla con esa fecha ya existe.');
            } else {
                this.utilService.loader(true);
                this.carteraService.getSalesTurn(this.station.idEstacion, this.planilla, true, null, this.fecha, this.fecha).subscribe(result => {
                    this.utilService.loader(false);
                    if (result.length == 1) {
                        this.cant = result[0].DETALLE.reduce((a, b) => a + b.CANTIDAD, 0);
                        this.salesTurn = result[0];
                        this.salesTurn.VALOR = Math.round(this.salesTurn.VALOR );
                        this.show[0] = true;
                        this.salesTurnBefore = JSON.parse(JSON.stringify(result[0]));
                        this.lock = true;
                        // datos anteriores
                        this.assignplanillaAnterior();
                    } else {
                        this.principalComponent.showMsg('info', 'Información', 'Sin resultados');
                    }
                }, error => {
                    console.log(error);
                    this.utilService.loader(false);
                    this.principalComponent.showMsg('error', 'Error', error.error.message);
                });
            }
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

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    assignSheet(val: string) {
        this.planilla = val;
        if (val === 'G') {
            this.otherForm.get('presLiq').setValue(null, [Validators.required, Validators.min(0)]);
            this.otherForm.get('cusiana').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('bonoCumple').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('bonoPunto').setValue(null, [Validators.required, Validators.min(0)]);
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
            this.bankForm.get('gasVal').setValue(null, [Validators.required, Validators.min(0)]);
            this.bankForm.get('gasDet').setValue('');
            this.bankForm.get('cusianaVal').setValue(null, [Validators.required, Validators.min(0)]);
            this.bankForm.get('cusianaDet').setValue('');
            if (this.station.tipoEstacion === 3) {
                this.otherForm.get('lubricante').setValue(0, this.emitFalse);
                this.otherForm.get('soatValue').setValue(0, this.emitFalse);
                this.otherForm.get('soatCom').setValue(0, this.emitFalse);
                this.otherForm.get('soatVen').setValue(0, this.emitFalse);
                this.otherForm.get('soatAnu').setValue(0, this.emitFalse);
                this.otherForm.get('soatReem').setValue(0);
                this.cashForm.get('reembolso').setValue(0, this.emitFalse);
                this.cashForm.get('servicioVal').setValue(0, this.emitFalse);
                this.cashForm.get('otroVal').setValue(0);
                this.bankForm.get('lubricanteVal').setValue(0, this.emitFalse);
                this.bankForm.get('seguroVal').setValue(0, this.emitFalse);
                this.bankForm.get('recaudo').setValue(0);
            }
        } else if (val === 'L') {
            this.paymentForm.get('descuento').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('devolucion').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('donacion').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('mantenimiento').setValue(null, [Validators.required, Validators.min(0)]);
            this.paymentForm.get('prestamo').setValue(null, [Validators.required, Validators.min(0)]);
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
            this.otherForm.get('prestamoVal').setValue(null, [Validators.required, Validators.min(0)]);
            this.otherForm.get('prestamoNom').setValue(null, [Validators.required, Validators.min(0)]);
            this.otherForm.get('prestamoVal').enable();
            this.otherForm.get('prestamoNom').enable();
            this.bankForm.get('liquidoVal').enable();
            this.bankForm.get('liquidoDet').enable();
            this.bankForm.get('liquidoVal').setValue(null, [Validators.required, Validators.min(0)]);
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
        if (this.existItem(val) == -1) {
            let a = this.proveedorList.controls[this.indexselProvider] as FormGroup;
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
    existAnt(val: any) {
        console.log(this.proveedorAnticipoList.controls);
        console.log(val);
        return this.proveedorAnticipoList.controls.findIndex(e => e.get('nitProveedor').value == val.proveedor);
    }
    boolProvider(val) {
        this.indexselProvider = val;
        this.boolSearchProvider = true;
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

    fileChange($event, item: number) {
        if ($event.target.files.length > 0) {
            // let size = $event.target.files[0].size / 1024 / 1024;
            // if (size > 2) {
            //   this.principalComponent.showMsg('error', 'Error', 'El tamaño del archivo excede los 2 MB');
            //   this.clearRouteAttach(item);
            //   return;
            // }
            // if ($event.target.files[0].type != "application/pdf") {
            //   this.principalComponent.showMsg('error', 'Error', 'Se permite solo archivos PDF');
            //   this.clearRouteAttach(item);
            //   return;
            // }
            this.readThis($event.target.files[0], item);
        } else {
            this.clearRouteAttach(item);
        }
    }

    readThis(inputValue: File, item: number): void {
        this.utilService.loader(true);
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.fileToUp[item] = { name: inputValue.name, code: myReader.result, type: item };
            this.utilService.loader(false);
        };

        myReader.readAsDataURL(inputValue);
        let item2 = this.attachedTypes.controls.find(e => e.get('ID').value === item);
        item2.get('RUTAVIEW').setValue(inputValue.name);
    }

    clearRouteAttach(item: number) {
        this.fileToUp[item] = null;
        let itemAttached = this.attachedTypes.controls.find(e => e.get('ID').value == item);
        itemAttached.get('RUTA').setValue(null);
        itemAttached.get('RUTAVIEW').setValue(null);
    }

    get attachedTypes(): FormArray { return this.attachedForm.get('attachedTypes') as FormArray; }

    assignAttachedTypes(items: EntDailyAttachedType[]) {
        this.fileToUp = [];
        items.map(e => {
            this.fileToUp.push(null);
            const item = this.fb.group({
                ID: [e.ID, Validators.required],
                DESCRIPCION: [e.DESCRIPCION, Validators.required],
                RUTA: null,
                RUTAVIEW: null
            });
            this.attachedTypes.push(item);
        });
    }

    resetAttachedForm() {
        this.attachedTypes.controls.map(e => {
            this.clearRouteAttach(e.get('ID').value);
        });
    }


}
