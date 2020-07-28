import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { rangedate, dateToISOString, numToCurrent, isoDateToLocalString, focusById } from '../../../util/util-lib';
import { UtilService } from '../../../services/util.service';
import { ICarteraForStation, iParamRPTCartera } from '../../../Class/iRPT';
import { fadeTransition } from '../../../routerAnimation';
import { PrincipalComponent } from '../../../principal/principal.component';
import { PrintService } from '../../../services/print.service';
import { formatDate, formatCurrency } from '@angular/common';

@Component({
    selector: 'app-cartera-planilla',
    templateUrl: './cartera-planilla.component.html',
    styleUrls: ['./cartera-planilla.component.css'],
    animations: [fadeTransition()]
})
export class CarteraPlanillaComponent implements OnInit {
    @Input() params: iParamRPTCartera;
    dateIni: string;
    dateEnd: string;
    dateL: Date[];
    stations: EntStation[];
    stationSel: EntStation;
    options = [{ id: 'D', text: 'Detallado' }, { id: 'C', text: 'Por cliente' }, { id: 'F', text: 'Por fecha' }];
    optionSel: { id, text };
    types = [{ id: null, text: 'TODOS' }, { id: 'L', text: 'LIQUIDOS' }, { id: 'G', text: 'GAS' }];
    typeSel: { id, text };
    month: boolean;
    tdTitle: any[];
    tdData: any[][];
    order: boolean;
    lastColOrder = null;
    lastQuery;
    stationCod;

    constructor(
        private carteraService: CarteraService,
        private storageService: StorageService,
        private nominaService: NominaService,
        private utilService: UtilService,
        private principal: PrincipalComponent,
        private printService: PrintService
    ) {
        this.dateL = rangedate(dateToISOString(new Date()), 1)
        this.stationCod = this.storageService.getCurrentStation();
        console.log(this.dateL );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.params) {
            this.tdData = null;
            this.tdTitle = null;
            this.stationSel = this.stations.find(e => e.idEstacion == this.params.station);
            this.dateIni = dateToISOString(this.params.dateIni);
            this.dateEnd = dateToISOString(this.params.dateEnd);

            this.month = this.params.month;
            this.typeSel = this.types.find(e => e.id == this.params.type);
            setTimeout(() => {
                focusById('btnSearchCartera');
            }, 10);
        }
    }

    ngOnInit() {
        this.nominaService.GetStations().subscribe(res => {
            this.stations = res;
            if (this.stationCod) {
                this.stationSel = this.stations.find(e => e.idEstacion == this.stationCod);
            }
        }, error => {
            console.log(error);
        });
        this.dateIni = dateToISOString(this.dateL[0]);
        this.dateEnd = dateToISOString(this.dateL[1]);
        this.optionSel = this.options[0];
        this.typeSel = this.types[0];
    }

    // get showParam() { return this.params ? false : true; }
    get showRes() { return this.tdData && this.tdData.length > 0 ? true : false; }

    get validSearch() {
        if (this.dateIni && this.stationSel && this.optionSel && this.typeSel) {
            return true;
        } else {
            return false;
        }
    }
    getReport() {
        if (!this.validSearch) {
            this.principal.showMsg('info', 'Error', 'Tiene campos por completar');
            return;
        }
        this.lastQuery = this.optionSel.id;
        this.dateEnd = this.dateEnd == '' ? null : this.dateEnd;
        this.utilService.loader()
        this.carteraService.GetCarteraForStation(this.stationSel.idEstacion, this.dateIni, this.dateEnd, this.optionSel.id, this.typeSel.id, this.month).subscribe(res => {
            this.utilService.loader(false)
            console.log(res);
            this.assignData(res);
        }, error => {
            this.utilService.loader(false)
            console.log(error);
            this.principal.showMsg('error', 'Error', error.error.message);
        });
    }

    assignData(data: ICarteraForStation[]) {
        this.tdData = [];
        this.tdTitle = [];
        switch (this.optionSel.id) {
            case 'D':
                this.tdTitle = [['Fecha', 'text-center', 'f'], ['Tipo', 'text-center', ''], ['Nit Cliente', 'text-center', ''], ['Cliente', 'text-left', ''], ['Tipo Cupo', 'text-center', ''], ['Pagado', 'text-right', 'c'], ['Vendido', 'text-right', 'c']];
                data.map(e => {
                    this.tdData.push([e.FECHA, e.TIPO, e.COD_CLIENTE, e.NOMBRE, this.getNameQuotaType(e.TIPO_CUPO), e.PAGADO, e.VENDIDO]);
                    // this.tdData.push([e.FECHA.split('T')[0], e.TIPO, e.COD_CLIENTE, e.NOMBRE, this.getNameQuotaType(e.TIPO_CUPO), e.PAGADO, e.VENDIDO]);
                });
                break;
            case 'C':
                this.tdTitle = [['Nit Cliente', 'text-center', ''], ['Cliente', 'text-left', ''], ['Tipo', 'text-center', ''], ['Saldo Ant', 'text-right', 'c'], ['Pagado', 'text-right', 'c'], ['Vendido', 'text-right', 'c'], ['Decuento', 'text-right', 'c'], ['Retención', 'text-right', 'c'], ['Saldo', 'text-right', 'c']];
                data.map(e => {
                    this.tdData.push([e.COD_CLIENTE, e.NOMBRE, this.getNameQuotaType(e.TIPO_CUPO)[0], e.ANTERIOR, e.PAGADO, e.VENDIDO, e.DESCUENTO, e.RETENCION,  e.SALDO ]);
                });
                break;
            case 'F':
                this.tdTitle = [['Fecha', 'text-center', 'f'], ['Tipo Cupo', 'text-center', ''], ['Pagado', 'text-right', 'c'], ['Vendido', 'text-right', 'c'], ['Saldo', 'text-right', 'c']];
                data.map(e => {
                    this.tdData.push([e.FECHA.split('T')[0], this.getNameQuotaType(e.TIPO_CUPO), e.PAGADO, e.VENDIDO, e.SALDO]);
                });
                break;
        }
    }

    valueShow(val, position) {
        if (this.tdTitle[position][2] == 'f') {
            return formatDate(val, 'dd/MM/yy', 'en-US', '+0000');
        }
        // return isoDateToLocalString(val);
        if (this.tdTitle[position][2] == 'c') {
            return formatCurrency(val, 'en-US', '$', null, '1.0-0');
        }
        // return numToCurrent(val);
        return val;
    }

    clear() {
        this.params = null;
        this.dateIni = null;
        this.dateEnd = null;
        this.dateL = null;
        this.optionSel = null;
        this.typeSel = null;
        this.month = null;
        this.tdData = null;
        this.tdTitle = null;
        if (this.stationCod == null) {
            this.stationSel = null;
        }
    }

    getNameQuotaType(val) {
        switch (val) {
            case 1:
                return 'Crédito'
            case 2:
                return 'Anticipo'
            case 3:
                return 'Sin cupo'
        }
    }

    orderBy(num: number) {
        let ord;
        if (num != this.lastColOrder) {
            ord = 1;
        } else if (this.order) {
            ord = -1;
        } else {
            ord = 1;
        }
        this.tdData.sort((a, b) => {
            if (a[num] > b[num]) {
                return 1 * ord;
            }
            if (a[num] < b[num]) {
                return -1 * ord;
            }
            return 0;
        });
        this.order = (ord == 1);
        this.lastColOrder = num;
    }

    download() {
        var csv = '';
        this.tdTitle.map(e => {
            csv += e[0] + ',';
        });
        csv = csv.slice(0, -1);
        this.tdData.map(e => {
            csv += '\r\n' + e.join(',');
        });
        csv = csv.replace(/,/g, ';');
        this.printService.downloadCSV(csv, 'cartera-' + this.lastQuery);
    }

}
