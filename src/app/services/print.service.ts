import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { EntReceivable } from '../Class/EntReceivable';
import { EntConsumptionClient } from '../Class/EntConsumptionClient';
import { EntStation } from '../Class/EntStation';
import { CarteraService } from './cartera.service';
import { EntCompany } from '../Class/EntCompany';
import { EntBank } from '../Class/EntBank';
import { MOVILGAS, CUSIANA, LOG_MOVILGAS } from '../Class/LETTERHEAD';
import { EntDailySheet } from '../Class/EntDailySheet';
import { BasicDataService } from './basic-data.service';
import { getNameMonth, addDays, dateToISOString } from '../util/util-lib';
import { isArray } from 'util';
import { EntDailySheetTurn } from '../Class/EntDailySheetTurn';
import { EntDailySheetTurnDet } from '../Class/EntDailySheetTurnDet';
import { forkJoin } from 'rxjs';
import { UtilService } from './util.service';
import { NominaService } from './nomina.service';

@Injectable()
export class PrintService {

    empresas: EntCompany[];
    bancos: EntBank[];
    stationsAll: EntStation[];

    constructor(
        private carteraService: CarteraService,
        private utilService: UtilService,
        private nominaService: NominaService
    ) {
        this.getBasicData();
    }

    private getBasicData() {
        forkJoin(
            this.carteraService.getCompany(),
            this.carteraService.getBank(),
            this.nominaService.GetStations()
        ).subscribe(([res1, res2, res3]) => {
            this.empresas = res1;
            this.bancos = res2;
            this.stationsAll = res3;
        }, error => console.log(error));
    }

    downloadFile(base64: string, name: string = 'prueba') {
        var blob;
        blob = this.converBase64toBlob(base64, 'application/pdf');
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
    }

    downloadCSV(csv: any, name: string = 'fileCSV') {
        // var blob;
        // blob = new Blob([csv], { type: 'text/csv' })
        // var blobURL = URL.createObjectURL(blob);
        // window.open(blobURL);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + '\uFEFF' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = name + '.csv';
        hiddenElement.click();
    }

    private converBase64toBlob(content, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = window.atob(content); //method which converts base64 to binary
        var byteArrays = [
        ];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {
            type: contentType
        }); //statement which creates the blob
        return blob;
    }

    private sumObj(obj1, obj2) {
        const keys = Object.keys(obj2);

        let obj = {};
        keys.forEach(e => {

            if (isArray(obj1[e]) && isArray(obj2[e])) {
                null;
            } else {
                obj[e] = obj1[e] + obj2[e];
            }
        });
        return obj;
    }

    private isfirtsAcum(val: EntDailySheet): boolean {
        let res = true
        const arri = Object.keys(val);
        arri.forEach(el => {
            if (val[el] != 0 && val[el] != null) {
                res = false;
            }
        });
        return res;
    }

    printSheetDailyEasy(planilla: EntDailySheet, view, err) {

        this.utilService.loader(true);
        let company: EntCompany;
        let acum: EntDailySheet;
        const station = this.stationsAll.find(e => e.idEstacion == planilla.ID_ESTACION);
        // console.log(station);
        forkJoin(
            this.carteraService.getDailySheetAcum(planilla.ID_ESTACION, planilla.TIPO, dateToISOString(addDays(planilla.FECHA, -1))),
            this.carteraService.getCompany(station.empresa)

        ).subscribe(([res1, res2]) => {
            // console.log(res1, res2);
            this.utilService.loader(false);
            if (res2.length == 1 && res1.length == 1) {
                this.utilService.loader(true);

                acum = res1[0];

                company = res2[0];
                this.printSheetDaily(planilla, station, company, acum, view, res => {
                    this.utilService.loader(false);
                });
            } else {
                err('Imposible obtener datos de la empresa de las estación');
            }
            //   this.principal.showMsg('error', 'Error', 'Imposible obtener datos de la empresa de las estación.');
        }, error => {
            this.utilService.loader(false);
            console.log(error);
            err(error.error.message);
        });
    }

    private printSheetDaily(planilla: EntDailySheet, station: EntStation, company: EntCompany, acum: EntDailySheet, open?: boolean, callback?) {
        const acum2 = this.sumObj(planilla, acum) as EntDailySheet;
        acum2.PLA_DIA_TUR = [];
        let facPag = '';
        let ArrayPagoProveedor: any[] = [];
        let ArrayAnticiposProveedor: any[] = [];
        let ArrayOtrosPagos: any[] = [];
        let TotalAnticipos = 0;

        if (planilla.PLA_DIA_PAG_PRO && planilla.PLA_DIA_PAG_PRO.length > 0) {
            planilla.PLA_DIA_PAG_PRO.map(e => {
                facPag += e.NUMERO + ',';
            });
            facPag = facPag.slice(0, -1);
        }
        // Construccion de Nuevo Array de pagos a Proveedores
        if (planilla.PLA_DIA_PAG_PRO && planilla.PLA_DIA_PAG_PRO.length > 0) {
            ArrayPagoProveedor.push(
                [{ text: 'PAGO A PROVEEDORES', style: 'sub', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: 'FACTURA', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: 'VALOR', style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'total', border: [false, false, true, false] }],
            );

            planilla.PLA_DIA_PAG_PRO.map((e: any) => {
                ArrayPagoProveedor.push(
                    [{ text: 'PROVEEDOR: ' + e.NOMBRE, colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: 'No # ' + e.NUMERO, border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: e.VALOR.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, true, false] }],
                );
            });

            ArrayPagoProveedor.push(
                [{ text: 'TOTAL PAGO A PROVEEDORES', style: 'tituloTotal', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: planilla.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM. TOTAL PAGO A PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }],
            );
        } else {

            ArrayPagoProveedor.push(
                [{ text: 'TOTAL PAGO A PROVEEDORES', style: 'tituloTotal', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: planilla.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM. TOTAL PAGO A PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }],
            );
        }

        // Construccion de Nuevo Array de Anticipo a Proveedores
        if (planilla.DE_ANT_PROV && planilla.DE_ANT_PROV.length > 0) {
            ArrayAnticiposProveedor.push(
                [{ text: 'ANTICIPOS A PROVEEDORES', style: 'sub', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: '', style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'total', border: [false, false, true, false] }],
            );

            planilla.DE_ANT_PROV.map(e => {
                TotalAnticipos += e.valor;
                ArrayAnticiposProveedor.push(
                    [{ text: 'PROVEEDOR: ' + e.nombreProvee, colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: e.valor.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, true, false] }],
                );
            });

            ArrayAnticiposProveedor.push(
                [{ text: 'TOTAL ANTICIPOS A PROVEEDORES', style: 'tituloTotal', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: TotalAnticipos.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'TOTAL ACUM ANTICIPOS PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.DE_ACUM_ANTICIPOS.toLocaleString(), style: 'total', border: [false, false, true, false] }],
            );
        } else {
            if (planilla.DE_ACUM_ANTICIPOS && planilla.DE_ACUM_ANTICIPOS > 0) {
                ArrayAnticiposProveedor.push(
                    [{ text: 'TOTAL ANTICIPOS A PROVEEDORES', style: 'tituloTotal', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: TotalAnticipos.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'TOTAL ACUM ANTICIPOS PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.DE_ACUM_ANTICIPOS.toLocaleString(), style: 'total', border: [false, false, true, false] }],
                );
            }
        }
        if (planilla.DE_OTROS_PAGOS && planilla.DE_OTROS_PAGOS.length > 0) {
            ArrayOtrosPagos.push(
                [{ text: 'OTROS', style: 'sub', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, false], colSpan: 3, style: 'center' }, {}, {}, {}, { text: 'VALOR', style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'total', border: [false, false, true, false] }],
            );
            planilla.DE_OTROS_PAGOS.map((e: any) => {
                ArrayOtrosPagos.push(
                    [{ text: ' DETALLES: ' + e.detalles, colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, false], colSpan: 3, style: 'center' }, {}, {}, {}, { text: e.valor.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: '', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, true, false] }],
                );
            });

            ArrayOtrosPagos.push(
                [{ text: 'TOTAL OTROS', style: 'tituloTotal', colSpan: 2, border: [true, false, false, false] }, {}, { text: '', style: 'center', colSpan: 4, border: [false, false, false, false] }, {}, {}, {}, {}, { text: planilla.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'TOTAL ACUMULADOS OTROS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            );

        } else {
            ArrayOtrosPagos.push(
                [{ text: 'TOTAL OTROS', style: 'tituloTotal', colSpan: 2, border: [true, false, false, false] }, {}, { text: '', style: 'center', colSpan: 4, border: [false, false, false, false] }, {}, {}, {}, {}, { text: planilla.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'TOTAL ACUMULADOS OTROS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],

            );
        }


        if (acum.PLA_DIA_TUR && acum.PLA_DIA_TUR.length > 0) {

            planilla.PLA_DIA_TUR.map(e => {
                const a = acum.PLA_DIA_TUR.find(f => f.NUM_TUR == e.NUM_TUR);
                var arr: EntDailySheetTurnDet[] = [];
                if (a) {
                    e.PLA_DIA_TUR_VEN.map(s => {
                        const b = a.PLA_DIA_TUR_VEN.find(f => f.COD_ART == s.COD_ART);
                        if (b != null) {
                            var g = (this.sumObj(s, b) as EntDailySheetTurnDet)
                            g.COD_ART = s.COD_ART;
                            arr.push(g);
                        } else {
                            arr.push(s);
                        }
                    });
                    acum2.PLA_DIA_TUR.push({ NUM_TUR: e.NUM_TUR, CANT_VENTA: e.CANT_VENTA + a.CANT_VENTA, TOTAL: e.TOTAL + a.TOTAL, PLA_DIA_TUR_VEN: arr });
                    arr = [];
                }
            });
        } else {



            acum2.PLA_DIA_TUR = planilla.PLA_DIA_TUR;
        }
        const yesterday = addDays(planilla.FECHA, -1);
        const arrayLineA: boolean[] = [];
        const mes = getNameMonth(yesterday.getUTCMonth() + 1).toUpperCase();
        const dia = yesterday.getUTCDate();
        const tipoPlanilla = planilla.TIPO == 'L' ? 'LIQUIDOS' : planilla.TIPO == 'G' ? 'GAS' : 'NULL';
        let ingresosObj = [];

        if (planilla.TIPO == 'L') {

            planilla.PLA_DIA_TUR.map(e => {
                let acumItem;
                if (acum2.PLA_DIA_TUR.find(ac => ac.NUM_TUR == e.NUM_TUR) !== null) {
                    acumItem = acum2.PLA_DIA_TUR.find(ac => ac.NUM_TUR == e.NUM_TUR);
                }

                ingresosObj.push(
                    [{ text: 'TURNO ' + e.NUM_TUR, border: [true, true, false, false], fillColor: '#ddebf7', colSpan: 3 }, {}, {}, { text: 'VTA GL', style: 'center', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: '', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: 'PRECIO x GL', style: 'center', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: '', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: 'VENTA $ TURNO ' + e.NUM_TUR, fillColor: '#ddebf7', style: 'center', border: [false, true, true, false] }, {}, { text: '', border: [true, true, false, false], fillColor: '#ddebf7', colSpan: 2 }, {}, { text: 'ACUM. VTA GL.', style: 'center', border: [false, true, false, false], fillColor: '#ddebf7' }, { text: 'ACUM VTA $ TURNO ' + e.NUM_TUR, style: 'center', border: [false, true, true, false], fillColor: '#ddebf7' }]
                );
                arrayLineA.push(true);

                e.PLA_DIA_TUR_VEN.map(r => {


                    const acItm = acumItem.PLA_DIA_TUR_VEN.find(pdt => pdt.COD_ART == r.COD_ART);
                    ingresosObj.push(
                        [{ text: r.NOM_ART, colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: r.CANTIDAD.toLocaleString(), style: 'right', border: [false, false, false, true] }, {}, { text: r.PRECIO.toLocaleString(), style: 'right', border: [false, false, false, true] }, {}, { text: r.VENTA.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: r.NOM_ART, colSpan: 2, border: [true, false, false, false] }, {}, { text: acItm.CANTIDAD.toLocaleString(), style: 'right', border: [false, false, false, true] }, { text: acItm.VENTA.toLocaleString(), style: 'right', border: [false, false, true, true] }]
                    );
                    arrayLineA.push(false);
                });
                arrayLineA.push(true);
                ingresosObj.push(
                    [{ text: '', border: [true], colSpan: 2 }, {}, {}, { text: e.CANT_VENTA.toLocaleString(), style: 'right' }, {}, {}, {}, { text: e.TOTAL.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: '', border: [true], colSpan: 2 }, {}, { text: acumItem.CANT_VENTA.toLocaleString(), style: 'right' }, { text: acumItem.TOTAL.toLocaleString(), style: 'right', border: [false, false, true, true] }],
                );

            });
            arrayLineA.push(true);

        } else if (planilla.TIPO == 'G') {
            ingresosObj.push(
                [{ text: '', border: [true, true, false, false], fillColor: '#ddebf7', colSpan: 2 }, {}, { text: '', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: 'VTA MT', style: 'center', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: '', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: 'PRECIO x MT', style: 'center', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: '', fillColor: '#ddebf7', border: [false, true, false, false] }, { text: 'VENTA $', fillColor: '#ddebf7', style: 'center', border: [false, true, true, false] }, {}, { text: '', border: [true, true, false, false], fillColor: '#ddebf7', colSpan: 2 }, {}, { text: 'ACUM. VTA MT.', style: 'center', border: [false, true, false, false], fillColor: '#ddebf7' }, { text: 'ACUM VTA $', style: 'center', border: [false, true, true, false], fillColor: '#ddebf7' }],
                [{ text: ' ', colSpan: 8, border: [true, false, true] }, {}, {}, {}, {}, {}, {}, {}, {}, { text: '', colSpan: 4, border: [true, false, true] }, {}, {}, {}]
            );

            planilla.PLA_DIA_TUR.map(e => {
                const acitem = acum2.PLA_DIA_TUR.find(ac => ac.NUM_TUR == e.NUM_TUR);
                e.PLA_DIA_TUR_VEN.map(r => {
                    const pdtv = acitem.PLA_DIA_TUR_VEN.find(it => it.COD_ART == r.COD_ART);
                    ingresosObj.push(
                        [{ text: 'TURNO ' + e.NUM_TUR, border: [true, false, false, false], colSpan: 3 }, {}, {}, { text: r.CANTIDAD.toLocaleString(), style: 'right', border: [false, false, false, true] }, {}, { text: r.PRECIO.toLocaleString(), style: 'right', border: [false, false, false, true] }, {}, { text: r.VENTA.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'TURNO ' + e.NUM_TUR, border: [true, false, false, false], colSpan: 2 }, {}, { text: pdtv.CANTIDAD.toLocaleString(), style: 'right', border: [false, false, false, true] }, { text: pdtv.VENTA.toLocaleString(), style: 'right', border: [false, false, true, true] }]
                    );
                    arrayLineA.push(false);
                });
            });
        }
        if (this.isfirtsAcum(acum)) {
            acum2.CAJ_CUST_SALDO = planilla.CAJ_CUST_SALDO;
        } else {
            acum2.CAJ_CUST_SALDO = acum.CAJ_CUST_SALDO;
        }
        acum2.SAL_FIN_CAJA = acum2.TOTAL_EFEC_REC + acum2.CAJ_CUST_SALDO - acum2.DE_TOTAL - acum2.CB_TOTAL;
        acum2.CAJA_GRAL_MEN = planilla.CAJA_GRAL_MEN;
        var testImageDataUrl = LOG_MOVILGAS;


        const inicio: any[] = [
            [{ stack: [{ image: testImageDataUrl, alignment: 'center', width: 50, height: 10, }], border: [true, true], rowSpan: 2 }, { text: '', border: [false, true], colSpan: 8 }, {}, {}, {}, {}, {}, {}, {}, { text: 'CUADRE DE CAJA PLANILLA DIARIA DE OPERACIONES ' + tipoPlanilla, style: 'center', colSpan: 4, rowSpan: 2, border: [false, true, true] }, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, { text: company.nit + '-' + company.codVerificacion, style: 'right' }, {}, {}, {}, {}, {}],
            [{ text: 'ESTACIÓN:', colSpan: 2, fillColor: '#ddebf7', border: [true, true, true, true] }, {}, { text: station.nombreEstacion, colSpan: 3, style: 'center', border: [true, true, true, true] }, {}, {}, { text: 'CIUDAD:', fillColor: '#ddebf7', border: [true, true, true, true] }, { text: station.nombreCiudad, colSpan: 2, style: 'center', border: [true, true, true, true] }, {}, { text: '', rowSpan: 4, fillColor: '#d0cece', border: [true, true, true, true] }, { text: 'FECHA', fillColor: '#ddebf7', colSpan: 3, style: 'center', border: [true, true, true, true] }, {}, {}, { text: 'PLANILLA No.', style: 'center', fillColor: '#ddebf7', rowSpan: 2, margin: [0, 6, 0, 0], border: [true, true, true, true] }],
            [{ text: 'ADMINISTRADORA:', colSpan: 2, fillColor: '#ddebf7', border: [true, true, true, true] }, {}, { text: planilla.NOM_ADM, colSpan: 6, alignment: 'center', border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, { text: 'DE PLANILLA:', colSpan: 2, fillColor: '#ddebf7', border: [true, true, true, true] }, {}, { text: planilla.FECHA.split('T')[0], fillColor: '#ddebf7', style: 'center', border: [true, true, true, true] }, {}],
            [{ text: 'DIRECCIÓN/TEL:', colSpan: 2, fillColor: '#ddebf7', border: [true, true, false, true] }, {}, { text: station.direccion, colSpan: 6, alignment: 'center', border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, { text: 'DE ELABORACIÓN:', colSpan: 2, fillColor: '#ddebf7', border: [true, true, true, true] }, {}, { text: planilla.CREADO.split('T')[0], style: 'center', fillColor: '#ddebf7', border: [true, true, true, true] }, { text: planilla.NUM ? planilla.NUM.toLocaleString() : 'Vista previa', border: [true, true, true, true], style: 'center' }],
            [{ text: 'INFORME DIARIO DE VENTAS', margin: [0, 0, 0, 2], colSpan: 8, alignment: 'center', border: [true, true, true, true], fillColor: '#d0cece' }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUMULADO VENTAS MENSUAL', fillColor: '#d0cece', colSpan: 4, alignment: 'center', border: [true, true, true, true] }, {}, {}, {}]
        ];


        const medioant: any[] = [
            [{ text: 'TOTAL VENTA ' + tipoPlanilla + ' DÍA', margin: [0, 0, 0, 2], border: [true, true, false, true], fillColor: '#d0cece', colSpan: 2 }, {}, { text: '', fillColor: '#d0cece', border: [false, true, false, true] }, { text: planilla.V_CANT.toLocaleString(), style: 'center', border: [false, true, false, true], fillColor: '#d0cece' }, { text: '', colSpan: 3, border: [false, true, false, true], fillColor: '#d0cece' }, {}, {}, { text: planilla.V_TOTAL.toLocaleString(), style: 'right', border: [false, true, true, true], fillColor: '#d0cece' }, {}, { text: 'ACUMULADO', border: [true, true, false, true], fillColor: '#d0cece', colSpan: 2 }, {}, { text: acum2.V_CANT.toLocaleString(), style: 'right', border: [false, true, false, true], fillColor: '#d0cece' }, { text: acum2.V_TOTAL.toLocaleString(), style: 'total', border: [false, true, true, true], fillColor: '#d0cece' }],
            [{ text: 'OTROS INGRESOS:', colSpan: 8, border: [true, true, true, false], fillColor: '#ddebf7', style: 'sub' }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUMULADO OTROS INGRESOS:', style: 'sub', colSpan: 4, border: [true, true, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
            [{ text: 'VENTA DE LUBRICANTES', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_LUBRICANTE.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'VENTA DE LUBRICANTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_LUBRICANTE.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'SOAT REF. NUMERO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_SOAT_REF, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'SOAT REF. NUMERO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'COMISION SOAT VENDIDO', colSpan: 2, border: [true, false, false, false] }, {}, { text: 'CANT. SOAT VENTIDOS No.', colSpan: 3 }, {}, {}, { text: planilla.OI_SOAT_VEN.toLocaleString(), style: 'right' }, {}, { text: planilla.OI_SOAT_COM.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'COMISION SOAT VENDIDO', colSpan: 2, border: [true, false, false, false] }, {}, { text: acum2.OI_SOAT_VEN.toLocaleString(), style: 'center' }, { text: acum2.OI_SOAT_COM.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'SOAT ANULADOS', colSpan: 2, border: [true, false, false, false] }, {}, { text: 'CANT. SOAT ANULADOS No.', colSpan: 3 }, {}, {}, { text: planilla.OI_SOAT_ANU.toLocaleString(), style: 'right' }, {}, { text: '', border: [false, false, true, true] }, {}, { text: 'SOAT ANULADOS', colSpan: 2, border: [true, false, false, false] }, {}, { text: acum2.OI_SOAT_ANU.toLocaleString(), style: 'center' }, { text: '', border: [false, false, true, true] }],
            [{ text: 'SOAT REEMPLAZADOS', colSpan: 2, border: [true, false, false, false] }, {}, { text: 'CANT. SOAT REEMPLAZADOS No.', colSpan: 3 }, {}, {}, { text: planilla.OI_SOAT_REEM.toLocaleString(), style: 'right' }, {}, { text: '', border: [false, false, true, true] }, {}, { text: 'SOAT REEMPLAZADOS', colSpan: 2, border: [true, false, false, false] }, {}, { text: acum2.OI_SOAT_REEM.toLocaleString(), style: 'center' }, { text: '', border: [false, false, true, true] }]
        ];
        const medioL: any[] = [
            [{ text: planilla.TIPO == 'L' ? 'PREMIOS' : 'RECAUDO PREMIOS CATALOGO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_PREMIO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: planilla.TIPO == 'L' ? 'PREMIOS' : 'RECAUDO PREMIOS CATALOGO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PREMIO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CUSIANA', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: 'CUSIANA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, false] }],
            [{ text: 'APROVECHAMIENTO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_APROV_DET, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_APROV.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'APROVECHAMIENTO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_APROV.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'PAGO CARTERA CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_PAG_CAR_CLI.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'PAGO CARTERA CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PAG_CAR_CLI.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'PAGO CARTERA DATAFONO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_PAG_CAR_CLI_DAT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'PAGO CARTERA DATAFONO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PAG_CAR_CLI_DAT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'ANTICIPO DE CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_PAG_ANT_CLI.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'ANTICIPO DE CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PAG_ANT_CLI.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'OTROS SERVICIOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_OTRO_DET, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'OTROS SERVICIOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'PRESTAMO VENTA DEL DÍA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_PRESTAMO_DET, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_PRESTAMO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'PRESTAMO VENTA DEL DÍA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PRESTAMO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL OTROS INGRESOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, true] }, {}, { text: 'ACUM. TOTAL OTROS INGRESOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, true] }],
            [{ text: 'TOTAL VENTA ' + tipoPlanilla + ' + OTROS INGRESOS', margin: [0, 0, 0, 2], colSpan: 7, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, {}, {}, {}, {}, { text: planilla.TOTAL_OI_VENTAS.toLocaleString(), style: 'right', border: [false, false, true, true], fillColor: '#d0cece' }, {}, { text: 'ACUM VENTA ' + tipoPlanilla + ' + OTROS INGRESOS', colSpan: 3, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, { text: acum2.TOTAL_OI_VENTAS.toLocaleString(), style: 'right', border: [false, false, true, true], fillColor: '#d0cece' }],
            [{ text: 'FORMAS DE PAGO', colSpan: 8, border: [true, false, true, false], fillColor: '#ddebf7', }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUMULADO TOTAL FORMAS DE PAGO', colSpan: 4, border: [true, false, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
            [{ text: 'BONOS SOAT', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_BONO_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BONOS SOAT', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_BONO_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CALIBRACIONES', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_CALIBRACION.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CALIBRACIONES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_CALIBRACION.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CLIENTES A CRÉDITO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_CLI_CRE.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CLIENTES A CRÉDITO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_CLI_CRE.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CLIENTES PAGOS ANTICIPO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_CLI_ANT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CLIENTES PAGOS ANTICIPO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_CLI_ANT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DATAFONO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_DATAFONO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'DATAFONO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_DATAFONO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DESCUENTOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_DESC.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'DESCUENTOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_DESC.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DEVOLUCIONES', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_DEV.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'DEVOLUCIONES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_DEV.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DONACIONES', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_DONACION.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'DONACIONES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_DONACION.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'MANTENIMIENTO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_MANT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'MANTENIMIENTO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_MANT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'PRESTAMO VENTA DEL DÍA', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_PREST.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'PRESTAMO VENTA DEL DÍA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_PREST.toLocaleString(), style: 'right', border: [false, false, true, true] }]
        ];
        const medioG: any[] = [
            [{ text: 'CARTERA CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: (planilla.OI_PAG_CAR_CLI + planilla.OI_PAG_CAR_CLI_DAT + planilla.OI_PAG_ANT_CLI).toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CARTERA CLIENTES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: (acum2.OI_PAG_CAR_CLI + acum2.OI_PAG_CAR_CLI_DAT + acum2.OI_PAG_ANT_CLI).toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'APROVECHAMIENTO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_APROV_DET, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_APROV.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'APROVECHAMIENTO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_APROV.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: planilla.TIPO == 'L' ? 'PREMIOS' : 'RECAUDO PREMIOS CATALOGO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_PREMIO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: planilla.TIPO == 'L' ? 'PREMIOS' : 'RECAUDO PREMIOS CATALOGO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PREMIO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'PRESTAMO LÍQUIDOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_PRESTAMO_LIQ.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: 'PRESTAMO LÍQUIDOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_PRESTAMO_LIQ.toLocaleString(), style: 'right', border: [false, false, true, false] }],
            [{ text: 'CUSIANA', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, false] }, {}, { text: 'CUSIANA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, false] }],
            [{ text: 'OTROS SERVICIOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.OI_OTRO_DET, style: 'right', colSpan: 2, border: [false, false, false, true] }, {}, { text: '', colSpan: 2 }, {}, { text: planilla.OI_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'OTROS SERVICIOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL OTROS INGRESOS', style: 'tituloTotal', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.OI_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, true] }, {}, { text: 'ACUM. TOTAL OTROS INGRESOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.OI_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, true] }],
            [{ text: 'TOTAL VENTA ' + tipoPlanilla + ' + OTROS INGRESOS', style: 'tituloTotal', margin: [0, 0, 0, 2], colSpan: 7, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, {}, {}, {}, {}, { text: planilla.TOTAL_OI_VENTAS.toLocaleString(), style: 'right', border: [false, false, true, true], fillColor: '#d0cece' }, {}, { text: 'ACUM VENTA ' + tipoPlanilla + ' + OTROS INGRESOS', colSpan: 3, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, { text: acum2.TOTAL_OI_VENTAS.toLocaleString(), style: 'right', border: [false, false, true, true], fillColor: '#d0cece' }],
            [{ text: 'FORMAS DE PAGO', colSpan: 8, border: [true, false, true, false], fillColor: '#ddebf7', }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUMULADO TOTAL FORMAS DE PAGO', colSpan: 4, border: [true, false, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
            [{ text: 'BONO AUTOPUNTOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_BONO_PUNTO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BONO AUTOPUNTOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_BONO_PUNTO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'BONO CUMPLEAÑOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_BONO_CUMPLE.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BONO CUMPLEAÑOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_BONO_CUMPLE.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'BONO SOAT', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_BONO_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BONO SOAT', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_BONO_SOAT.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CALIBRACIONES', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_CALIBRACION.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CALIBRACIONES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_CALIBRACION.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'CLIENTES A CRÉDITO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: (planilla.FP_CLI_CRE + planilla.FP_CLI_ANT).toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CLIENTES A CRÉDITO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: (acum2.FP_CLI_CRE + acum2.FP_CLI_ANT).toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DATAFONO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_DATAFONO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'DATAFONO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_DATAFONO.toLocaleString(), style: 'right', border: [false, false, true, true] }]
        ];
        let medioF: any[] = [
            [{ text: 'OTROS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.FP_OTRO_DET, style: 'center', colSpan: 3, border: [false, false, false, true] }, {}, {}, {}, { text: planilla.FP_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'OTROS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL FORMAS DE PAGO', style: 'tituloTotal', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.FP_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM TOTAL FORMAS DE PAGO', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.FP_TOTAL.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL EFECTIVO RECIBIDO', style: 'tituloTotal', margin: [0, 0, 0, 2], colSpan: 7, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, {}, {}, {}, {}, { text: planilla.TOTAL_EFEC_REC.toLocaleString(), style: 'right', border: [false, true, true, true], fillColor: '#d0cece' }, {}, { text: 'ACUM. TOTAL EFECTIVO RECIBIDO', colSpan: 3, border: [true, true, false, true], fillColor: '#d0cece' }, {}, {}, { text: acum2.TOTAL_EFEC_REC.toLocaleString(), style: 'right', border: [false, true, true, true], fillColor: '#d0cece' }],
            [{ text: 'SALDO CAJA EN CUSTODIA', colSpan: 3, border: [true, true, false, true] }, {}, {}, { text: 'DÍA', style: 'center', border: [false, true, false, true] }, { text: dia, border: [true, true, true, true], style: 'center' }, { text: mes, style: 'center', colSpan: 2, border: [true, true, true, true] }, {}, { text: planilla.CAJ_CUST_SALDO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'ACUM. SALDO CAJA EN CUSTODIA', colSpan: 3, border: [true, false, false, true] }, {}, {}, { text: acum2.CAJ_CUST_SALDO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'DISTRIBUCION DEL EFECTIVO', colSpan: 8, border: [true, false, true, false], fillColor: '#ddebf7', }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUM. DISTRIBUCION DEL EFECTIVO', colSpan: 4, border: [true, false, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
        ];

        ArrayPagoProveedor.map(e => {
            medioF.push(e);
        });

        ArrayAnticiposProveedor.map(e => {
            medioF.push(e);
        });

        medioF.push(
            // [{ text: 'ANTICIPOS  A PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: '', border: [false, false, false, true], colSpan: 3, style: 'center' }, {}, {}, {}, { text: planilla.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM. TOTAL PAGO A PROVEEDORES', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_PROV.toLocaleString(), style: 'total', border: [false, false, true, false] }],
            [{ text: 'GASTOS PAGADOS EN EFECTIVO', colSpan: 8, border: [true, false, true, false], fillColor: '#ddebf7', }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUM. GASTOS PAGADOS EN EFECTIVO', colSpan: 4, border: [true, false, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
            [{ text: 'REEMBOLSO DE CAJA MENOR N°', colSpan: 4, border: [true, false, false, false] }, {}, {}, {}, { text: planilla.DE_REEM_CAJ_MEN_NUM ? planilla.DE_REEM_CAJ_MEN_NUM.toLocaleString() : null, style: 'center', colSpan: 2, border: [false, false, false, true] }, {}, {}, { text: planilla.DE_REEM_CAJ_MEN.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'REEMBOLSO DE CAJA MENOR N°', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_REEM_CAJ_MEN.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'SERVICIOS PUBLICOS', colSpan: 2, border: [true, false, false, false] }, {}, { text: planilla.DE_SERV_PUB_DET, style: 'center', colSpan: 4, border: [false, false, false, true] }, {}, {}, {}, {}, { text: planilla.DE_SERV_PUB.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'SERVICIOS PUBLICOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_SERV_PUB.toLocaleString(), style: 'right', border: [false, false, true, true] }],
        );

        ArrayOtrosPagos.map(e => {
            medioF.push(e);
        });

        medioF.push(
            // [{ text: 'OTROS', colSpan: 2, border: [true, false, false, false] }, {}, { text: planilla.DE_OTRO_DET, style: 'center', colSpan: 4, border: [false, false, false, true] }, {}, {}, {}, {}, { text: planilla.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'OTROS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_OTRO.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL GASTOS PAGADOS EN EFECTIVO', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.DE_TOTAL_EFE.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM MES TOTAL PAGADOS X CAJA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.DE_TOTAL_EFE.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL EGRESOS', margin: [0, 0, 0, 2], colSpan: 7, border: [true, true, false, true], fillColor: '#f2b87b' }, {}, {}, {}, {}, {}, {}, { text: planilla.DE_TOTAL.toLocaleString(), style: 'right', border: [false, true, true, true], fillColor: '#f2b87b' }, {}, { text: 'TOTAL EGRESOS ACUMULADOS', colSpan: 3, border: [true, true, false, true], fillColor: '#f2b87b' }, {}, {}, { text: acum2.DE_TOTAL.toLocaleString(), style: 'right', border: [false, true, true, true], fillColor: '#f2b87b' }],
            [{ text: 'CONSIGNACIÓN EN BANCOS', colSpan: 8, border: [true, false, true, false], fillColor: '#ddebf7', }, {}, {}, {}, {}, {}, {}, {}, {}, { text: 'ACUM CONSIGNACIÓN EN BANCOS', colSpan: 4, border: [true, false, true, false], fillColor: '#ddebf7' }, {}, {}, {}],
            [{ text: 'BANCOLOMBIA LUBRICANTES CTA No.', colSpan: 4, border: [true, false, false, false] }, {}, {}, {}, { text: planilla.CB_LUBRI_DET, style: 'center', colSpan: 2, border: [false, false, false, true] }, {}, {}, { text: planilla.CB_LUBRI.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BANCOLOMBIA LUBRICANTES CTA No.', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.CB_LUBRI.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'BANCOLOMBIA ' + tipoPlanilla + ' CTA No.', colSpan: 4, border: [true, false, false, false] }, {}, {}, {}, { text: planilla.TIPO == 'L' ? planilla.CB_LIQ_DET : planilla.CB_GAS_DET, style: 'center', colSpan: 2, border: [false, false, false, true] }, {}, {}, { text: planilla.TIPO == 'L' ? planilla.CB_LIQ.toLocaleString() : planilla.CB_GAS.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'BANCOLOMBIA ' + tipoPlanilla + ' CTA No.', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: planilla.TIPO == 'L' ? acum2.CB_LIQ.toLocaleString() : acum2.CB_GAS.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'RECAUDO CARTERA', colSpan: 4, border: [true, false, false, false] }, {}, {}, {}, { text: planilla.CB_REC_CART_DET, style: 'center', colSpan: 2, border: [false, false, false, true] }, {}, {}, { text: planilla.CB_REC_CART.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'RECAUDO CARTERA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.CB_REC_CART.toLocaleString(), style: 'right', border: [false, false, true, true] }],

        )


        const medio = medioant.concat((planilla.TIPO == 'L' ? medioL : medioG), medioF);
        const cusiana = [{ text: 'CUSIANA', colSpan: 4, border: [true, false, false, false] }, {}, {}, {}, { text: planilla.CB_CUSIANA_DET, style: 'center', colSpan: 2, border: [false, false, false, true] }, {}, {}, { text: planilla.CB_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'CUSIANA', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.CB_CUSIANA.toLocaleString(), style: 'right', border: [false, false, true, true] }]
        // planilla.TIPO == 'G' ? medio.push(cusiana) : null;
        medio.push(cusiana);
        const final: any = [
            [{ text: 'SEGUROS DEL ESTADO REF.', colSpan: 2, border: [true, false, false, false] }, {}, { text: planilla.CB_SEG_EST_DET, style: 'center', colSpan: 4, border: [false, false, false, true] }, {}, {}, {}, {}, { text: planilla.CB_SEG_EST.toLocaleString(), style: 'right', border: [false, false, true, true] }, {}, { text: 'SEGUROS DEL ESTADO REF.', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.CB_SEG_EST.toLocaleString(), style: 'right', border: [false, false, true, true] }],
            [{ text: 'TOTAL CONSIGNACIÓN EN BANCOS', colSpan: 7, border: [true, false, false, false] }, {}, {}, {}, {}, {}, {}, { text: planilla.CB_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, false] }, {}, { text: 'ACUM CONSIGNACIÓN EN BANCOS', colSpan: 3, border: [true, false, false, false] }, {}, {}, { text: acum2.CB_TOTAL.toLocaleString(), style: 'total', border: [false, false, true, true] }],
            [{ text: 'SALDO FINAL DE CAJA', colSpan: 6, style: 'center', border: [true, true, false, true] }, {}, {}, {}, {}, {}, { text: '', border: [false, true, false, true] }, { text: planilla.SAL_FIN_CAJA.toLocaleString(), style: 'right', border: [false, true, true, true] }, {}, { text: 'SALDO FINAL ACUM DE CAJA', colSpan: 3, border: [true, true, false, true], style: 'center' }, {}, {}, { text: acum2.SAL_FIN_CAJA.toLocaleString(), style: 'right', border: [false, true, true, true] }],
            [{ text: 'CAJA GENERAL + CAJA MENOR', colSpan: 6, style: 'center', border: [true, true, false, true] }, {}, {}, {}, {}, {}, { text: '', border: [false, true, false, true] }, { text: planilla.CAJA_GRAL_MEN.toLocaleString(), style: 'right', border: [false, true, true, true] }, {}, { text: 'CAJA GENERAL + CAJA MENOR', colSpan: 3, border: [true, true, false, true], style: 'center' }, {}, {}, { text: acum2.CAJA_GRAL_MEN.toLocaleString(), style: 'right', border: [false, true, true, true] }],
            [{ text: 'ELABORÓ:', style: 'center', colSpan: 8, border: [true, true, true, true], fillColor: '#ddebf7' }, {}, {}, {}, {}, {}, {}, {}, { text: 'CONTABILIZA: AUXILIAR CONTABLE', style: 'center', colSpan: 5, border: [true, true, true, true], fillColor: '#ddebf7' }, {}, {}, {}, {}],
            [{ text: ' ', colSpan: 8, border: [true, true, true, false] }, {}, {}, {}, {}, {}, {}, {}, { text: '', colSpan: 5, border: [true, true, true, false] }, {}, {}, {}, {}],
            [{ text: planilla.NOM_REA ? planilla.NOM_REA : 'PREVISUALIZACIÓN', style: 'center2', colSpan: 8, border: [true, false, true, true] }, {}, {}, {}, {}, {}, {}, {}, { text: planilla.NOM_CONT, style: 'center2', colSpan: 5, border: [true, false, true, true] }, {}, {}, {}, {}]
        ];

        const finalbody = inicio.concat(ingresosObj, medio, final);
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        var dd = {
            pageSize: 'LETTER',
            pageMargins: [5, 30, 5, 5],
            content: [
                {
                    style: 'tam',
                    table: {
                        widths: [76, 39, 15, 28, 22, 30, 15, 49, 0, 44, 41, 57, 57],
                        body: finalbody
                    },
                    layout: {
                        defaultBorder: false,
                        hLineColor: function (i, node) {
                            if (i < 7 || i > node.table.body.length - 6) {
                                return 'black';
                            } else if (planilla.TIPO == 'L') {
                                if (i >= 7 && i - 7 <= arrayLineA.length) {
                                    return (arrayLineA[i - 7]) ? 'black' : '#e5e5e5';
                                } else {
                                    const num = i - 7 - arrayLineA.length;
                                    switch (num) {
                                        case 14:
                                        case 15:
                                        case 28:
                                        case 29:
                                        case 30:
                                        // case 31: es el campo de mostrar las facturas pagadas
                                        case 37:
                                        case 38:
                                            return 'black';
                                        default:
                                            return '#e5e5e5';
                                    }
                                }
                            } else {
                                if (i >= 7 && i - 7 <= arrayLineA.length) {
                                    return (arrayLineA[i - 7]) ? 'black' : '#e5e5e5';
                                } else {
                                    const num = i - 7 - arrayLineA.length;
                                    switch (num) {
                                        case 1:
                                        case 2:
                                        case 15:
                                        case 16:
                                        case 25:
                                        case 26:
                                        case 27:
                                        case 34:
                                        case 35:
                                            return 'black';
                                        default:
                                            return '#e5e5e5';
                                    }
                                }
                            }
                        },
                        vLineColor: 'black',
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
                        },
                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
                        },
                        paddingBottom: function (i, node) { return (i === 0) ? 2 : 0 },
                        hLineStyle: function (i, node) {
                            return (i < 7 || i > node.table.body.length - 6 || i === node.table.body.length) ? undefined : null;
                        },
                        // { dash: { length: 10, space: 4 } } : null;
                        // paddingLeft: function(i, node) { return 4; },
                        // paddingRight: function(i, node) { return 4; },
                        // paddingTop: function(i, node) { return 2; },
                    }
                },
            ],
            styles: {
                tam: {
                    fontSize: 5
                },
                right: {
                    alignment: 'right'
                },
                center: {
                    alignment: 'center'
                },
                center2: {
                    alignment: 'center',
                    fontSize: 8,
                    bold: true
                },
                sub: {
                    decoration: 'underline'
                },
                total: {
                    alignment: 'right',
                    decoration: 'underline',
                    bold: true,
                    fontSize: 5.5
                },
                tituloTotal: {
                    bold: true
                }
            }
        }
        if (open) {
            pdfMake.createPdf(dd).open();
        } else {
            pdfMake.createPdf(dd).download('PD' + (planilla.NUM ? planilla.NUM : '') + '.pdf');
        }
        callback ? callback(true) : null;
    }


    printReceivable(receivable: EntReceivable, consumos: EntConsumptionClient[], station: EntStation, result?) {
        // console.log(station);
        // console.log(consumos);
        const currentCompany = this.empresas.find(e => e.nit === station.empresa);
        const SomosGranContr = (station.empresa == 900127676 ? '' : 'Somos grandes contribuyentes');
        const currenBank = this.bancos.find(e => e.idBanco === station.banco);
        const date = new Date(receivable.fecha);
        const cliente = (receivable.nombreAlt && receivable.nombreAlt.length > 0) ? receivable.nombreAlt : receivable.nombre;
        const nitCliente = (receivable.nitAlt && receivable.nitAlt.length > 0) ? receivable.nitAlt : receivable.codCliente;
        const cuentacobro = receivable.num;
        const valorAnt = receivable.valorAnt || 0;
        const descuento = receivable.descuento || 0;
        const retencion = receivable.retencion || 0;
        const valor = receivable.valor;
        const valorSinDes = valorAnt - descuento;
        const valorEnLetra = this.NumeroALetras(valorSinDes, {});
        const dateini = new Date(receivable.periodoIni);
        dateini.setHours(dateini.getHours() + 5);
        const datefin = new Date(receivable.periodoFin);
        const dayIni = dateini.getUTCDate();
        const dayEnd = datefin.getUTCDate();
        const month = dateini.getUTCMonth();
        const year = dateini.getFullYear();
        const bodyTableReceivable = [];
        let espacio = null;
        let cantidadDeConsumoEnHoja = 6;
        let firmaAdministrador1 = null;
        let firmaAdministrador2 = null;

        const tableReceivable = {
            table: {
                headerRows: 1,
                widths: [65, 50, 50, 70, 75, 75],
                body: bodyTableReceivable
            },
            layout: 'lightHorizontalLines',
            alignment: 'center'
        };
        const firmaEDS = [
            {
                text: '\nNota: Favor abonar a la cuenta N° ' + station.cuentaBancaria + ' a nombre de ' + currentCompany.nombre + ' NIT ' + currentCompany.nit + '-' + currentCompany.codVerificacion + ' DE ' + currenBank.nombreBanco + '.',
                style: 'body',
                bold: true,
                italics: true
            }
            , {
                columns: [
                    {
                        text: ['\n\n\n\n',
                            { text: '.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t', decoration: 'underline', decorationColor: 'black', color: 'white' }, '\n',
                            {
                                text: station.administrador.toUpperCase() + '\nADMINISTRADOR(A) EDS ' + station.nombreEstacion.toUpperCase(),
                                style: 'firma'
                            },
                            {
                                text: '\nDirección: ' + station.direccion + '\nTel: ' + station.telefono,
                                bold: false,
                                fontSize: 11
                            }
                        ]
                    }, {
                        ul: ['Retención Aplicada',
                            { text: '.\t\t\t\t\t\t\t\t\t', decoration: 'underline', decorationColor: 'black', color: 'white', listType: 'none' },
                            'Valor cancelado',
                            { text: '.\t\t\t\t\t\t\t\t\t', decoration: 'underline', decorationColor: 'black', color: 'white', listType: 'none' },
                            'Fecha de pago:',
                            { text: '.\t\t\t\t\t\t\t\t\t', decoration: 'underline', decorationColor: 'black', color: 'white', listType: 'none' }],
                        fontSize: 10,
                        lineHeight: 1.5,
                        width: 150
                    }
                ]
            }
        ];
        bodyTableReceivable.push([
            { text: 'Fecha', style: 'headerTable' },
            { text: 'Placa', style: 'headerTable' },
            { text: 'Cantidad', style: 'headerTable' },
            { text: 'Producto', style: 'headerTable' },
            { text: 'Consecutivo', style: 'headerTable' },
            { text: 'Valor', style: 'headerTable' }
        ]);

        // inserta datos en la tabla
        consumos.forEach(element => {
            var dateconsumption = new Date(element.fechaConsumo);
            dateconsumption.setHours(dateconsumption.getHours() + 5);
            bodyTableReceivable.push([
                dateconsumption.toLocaleDateString(),
                element.placa,
                { text: element.cantidad.toLocaleString(), alignment: 'right' },
                element.combustible == 0 ? 'Gasolina' : element.combustible == 1 ? 'Diesel' : element.combustible == 2 ? 'Gas' : element.combustible == 3 ? 'Lubricantes' : '',
                element.ConsecutivoEstacion.toString(),
                { text: element.valor.toLocaleString(), alignment: 'right' }]);
        });

        // inserta pie de pagina de la tabla

        if (descuento > 0 || retencion > 0) {
            cantidadDeConsumoEnHoja -= 1;
            bodyTableReceivable.push(
                [
                    { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] },
                    { text: 'SubTotal', style: 'headerTable', colSpan: 2, border: [false, false, false, false] },
                    '',

                    { text: '$' + valorAnt.toLocaleString(), alignment: 'right' }
                ]);
        }
        if (descuento > 0) {
            cantidadDeConsumoEnHoja -= 1;
            bodyTableReceivable.push(
                [
                    { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] },
                    { text: 'Descuento', style: 'headerTable', colSpan: 2, border: [false, false, false, false] },
                    '',

                    { text: '$' + descuento.toLocaleString(), alignment: 'right' }
                ]);
        }
        if (retencion > 0) {
            cantidadDeConsumoEnHoja -= 1;
            // bodyTableReceivable.push(
            //     [
            //         { text: 'Retención', style: 'headerTable', colSpan: 6, border: [false, false, false, false] },
            //         '',
            //         '',
            //         '',
            //         '',
            //         { text: '$' + retencion.toLocaleString(), alignment: 'right' }
            //     ]);
        }
        bodyTableReceivable.push(
            [
                { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] },
                { text: 'Total', style: 'headerTable', colSpan: 2, border: [false, false, false, false] },
                '',

                { text: '$' + (valorAnt - descuento).toLocaleString(), alignment: 'right' }
            ]
        );
        // valida si pasa o no la tabla a otra hoja y acomoda los datos.
        if (consumos.length < cantidadDeConsumoEnHoja) {
            firmaAdministrador2 = firmaEDS;
        } else {
            tableReceivable['pageBreak'] = 'before';
            // espacio = '\nANEXO\n'
            firmaAdministrador1 = firmaEDS;
        }

        // espacio = [{ stack: null, border: [true, true], rowSpan: 2 }, { text: '', border: [false, true], colSpan: 8 }, {}, {}, {}, {}, {}, {}, {}, { text: 'CUADRE DE CAJA PLANILLA DIARIA DE OPERACIONES ' + tipoPlanilla, style: 'center', colSpan: 4, rowSpan: 2, border: [false, true, true] }, {}, {}, {}]
         var contenido = [{}, {}, {}, {}, {}, {}, {}, { text: 'texto', style: 'headerTable', border:[true, true, true, true] }, {}, {}, {}, {}, {}]

         espacio = {
             table: {
               // widths: ['auto', 'auto'],
               widths: [ '*','*','*' ],
                 body: [
                     [{text:' VALOR FACTURA ', alignment: 'center'}, {text:' DESCUENTO ', alignment: 'center'},{text:' VALOR TOTAL A PAGAR ', alignment: 'center'}],
                     [{text:'$' + valorAnt.toLocaleString(), alignment: 'center'} , {text:'$' + descuento.toLocaleString(), alignment: 'center'},{text:'$' + (valorAnt - descuento).toLocaleString(), alignment: 'center'}],
                 ],
             },
         };

        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        var dd = {
            background: function (page) {
                return [
                    {
                        image: 'membrete',
                        width: 612.00,
                        height: 792.00
                    }
                ];
            },
            pageSize: 'LETTER',
            pageMargins: [85, 110, 57, 100],
            content: [
                'Villavicencio, ' + date.getUTCDate() + ' de ' + this.mesEnLetra(date.getUTCMonth()).toLowerCase() + ' del ' + date.getUTCFullYear() + '.',
                {
                    text: 'CTA. DE COBRO No. ' + cuentacobro + '\n\n',
                    alignment: 'right'
                },
                {
                    text: cliente + '\nNit. ' + nitCliente + '\n\n',
                    style: 'header'
                },
                {
                    text: 'DEBE A\n\n',
                    style: 'header'
                },
                {
                    text: currentCompany.nombre + '\n' + currentCompany.marca + '\n' + currentCompany.nit + '\n\n',
                    style: 'header'
                },
                {
                    text: 'LA SUMA DE: ' + valorEnLetra + ' MCTE. ($' + valorSinDes.toLocaleString() + ')\n\n',
                    style: 'body',
                    fontSize: 12,
                    bold: true
                },
                {
                    text: [{ text: 'POR CONCEPTO DE', bold: true }, ': Suministro de combustible del ' + dayIni + ' al ' + dayEnd + ' del mes de ' + this.mesEnLetra(month).toLowerCase() + ' de ' + year + '.'],
                    style: 'body'
                },
                {
                    text: ['Según lo establecido en el literal del artículo 2 del DR 1001 de 1997 los distribuidores minoristas de combustible derivados del petróleo, no tienen obligación de expedir factura ni documento equivalente por estos productos.\n', {
                        text: SomosGranContr,
                        style: 'piedepagina',
                        bold: true
                    }],
                    style: 'piedepagina',
                    absolutePosition: { x: 85, y: 650 }
                },
                {}
                ,
                 espacio,
                firmaAdministrador1,
                tableReceivable,
                firmaAdministrador2
            ],
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center'
                },
                headerTable: {
                    bold: true,
                    alignment: 'center'
                },
                firma: {
                    bold: true,
                    alignment: 'left',
                    fontSize: 12,
                },
                body: {
                    fontSize: 12,
                    alignment: 'justify'
                },
                piedepagina: {
                    fontSize: 9,
                    alignment: 'center'
                }
            },
            images: { membrete: this.selectMembrete(station.empresa) }
        };

        pdfMake.createPdf(dd).download('CC-' + receivable.codCliente + '-' + receivable.num + '.pdf');
        if (result) {
            result(true);
        }
    }

    private selectMembrete(empresa) {
        switch (empresa) {
            case '900127676':
                return this.membreteCusiana;
            case '900045328':
                return this.membreteMovilgas;
            default:
                return this.membreteMovilgas;
        }
    }


    private membreteMovilgas = MOVILGAS;
    private membreteCusiana = CUSIANA;
    private NumeroALetras(num, currency) {
        currency = currency || {};
        const data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
            letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO'
        };

        if (data.enteros == 0) {
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        }
        if (data.enteros == 1) {
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        } else {
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        }
    };

    private mesEnLetra(num) {
        switch (num) {
            case 0: return 'ENERO';
            case 1: return 'FEBRERO';
            case 2: return 'MARZO';
            case 3: return 'ABRIL';
            case 4: return 'MAYO';
            case 5: return 'JUNIO';
            case 6: return 'JULIO';
            case 7: return 'AGOSTO';
            case 8: return 'SEPTIEMBRE';
            case 9: return 'OCTUBRE';
            case 10: return 'NOVIEMBRE';
            case 11: return 'DICIEMBRE';
        }
    }

    private Unidades(num) {

        switch (num) {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    private Decenas(num) {

        const decena = Math.floor(num / 10);
        const unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + this.Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + this.Unidades(unidad);
                }
            case 3: return this.DecenasY('TREINTA', unidad);
            case 4: return this.DecenasY('CUARENTA', unidad);
            case 5: return this.DecenasY('CINCUENTA', unidad);
            case 6: return this.DecenasY('SESENTA', unidad);
            case 7: return this.DecenasY('SETENTA', unidad);
            case 8: return this.DecenasY('OCHENTA', unidad);
            case 9: return this.DecenasY('NOVENTA', unidad);
            case 0: return this.Unidades(unidad);
        }
    }//Unidades()

    private DecenasY(strSin, numUnidades) {
        if (numUnidades > 0) {
            return strSin + ' Y ' + this.Unidades(numUnidades)
        }

        return strSin;
    }//DecenasY()

    private Centenas(num) {
        const centenas = Math.floor(num / 100);
        const decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0) {
                    return 'CIENTO ' + this.Decenas(decenas);
                }
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
            case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
            case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
        }

        //console.log('Centenas: ' + decenas + '1');
        return this.Decenas(decenas);
    }//Centenas()

    private Seccion(num, divisor, strSingular, strPlural) {
        const cientos = Math.floor(num / divisor)
        const resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0) {
            if (cientos > 1) {
                letras = this.Centenas(cientos) + ' ' + strPlural;
            } else {
                letras = strSingular;
            }
        }

        if (resto > 0) {
            letras += '';
        }
        return letras;
    }//Seccion()

    private Miles(num) {
        const divisor = 1000;
        const cientos = Math.floor(num / divisor)
        const resto = num - (cientos * divisor)

        const strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
        const strCentenas = this.Centenas(resto);

        if (strMiles == '') {
            return strCentenas;
        }

        return (strMiles + ' ' + strCentenas).trim();
    }//Miles()

    private Millones(num) {
        const divisor = 1000000;
        const cientos = Math.floor(num / divisor)
        const resto = num - (cientos * divisor)

        const strMillones = this.Seccion(num, divisor, this.millon(num, true), this.millon(num, false));
        const strMiles = this.Miles(resto);

        if (strMillones == '') {
            return strMiles;
        }

        return strMillones + ' ' + strMiles;
    }//Millones()

    private millon(num, singular) {
        var letraMillon = '';
        if (singular == true) {
            letraMillon = 'UN MILLON';
        } else {
            letraMillon = 'MILLONES'
        }
        if (num % 1000000 == 0) {
            letraMillon = letraMillon + ' DE'
        }
        return letraMillon;
    }
}
