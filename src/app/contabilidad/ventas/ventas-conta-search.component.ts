import { EntVentasClient } from './../../Class/ent-ventas-client';
import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { UtilService } from './../../services/util.service';
import { EntConsumptionClient } from './../../Class/EntConsumptionClient';
import { EntClient } from './../../Class/EntClient';
import { NominaService } from './../../services/nomina.service';
import { StorageService } from './../../services/storage.service';
import { EntStation } from './../../Class/EntStation';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { rangedate, dateToISOString, focusById, ObjToCSV} from '../../util/util-lib';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-ventas-conta-search',
    templateUrl: './ventas-conta-search.component.html',
    styleUrls: ['./ventas-conta-search.component.css'],
    standalone: false
})
export class VentasContaSearchComponent implements OnInit {

    @ViewChild('tabla_de_ventas') tabla_de_ventas: ElementRef;
    formulario: boolean = false;
    stationCode: number = null;
    stationSel: EntStation= new EntStation();
    stationsAll: EntStation[] =[];
    booleanClient = false;
    client: EntClient;
    id;
    searchVentaFechaIni;
    searchVentaFechaFin;
    searchVentas: EntVentasClient[] = [];
    estilos: string =
        'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';
    tipoEstacion = [{id: 0, tipo: 'G', detalle: 'GAS'}, {id: 1, tipo: 'L', detalle: 'LIQUIDOS'}];
    tipoEstacionSel;
    detalleEstacion: string;

  constructor(private storageService: StorageService,
    private nominaService: NominaService,
    private utilService: UtilService,
    private carteraService: CarteraService,
    private principal: PrincipalComponent) {
    this.stationCode = this.storageService.getCurrentStation();
    this.GetEstaciones();
  }

  ngOnInit(): void {
    this.client = new EntClient();
    let fechas = rangedate(dateToISOString(new Date()), 0);
    this.searchVentaFechaIni = dateToISOString(fechas[0]);
        this.searchVentaFechaFin = dateToISOString(fechas[1]);
  }

  GetEstaciones() {
    this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                console.log('estación seleccionada: '+JSON.stringify(this.stationSel));
            }
        }, (error) => console.error(error.error.message)
    );
}

visitarElementoPadre(){
    this.formulario = true;
}

leaveElementoPadre(){
 this.formulario = false;
}

openModCli() {
    this.booleanClient = true;
    setTimeout(() => {
        focusById('searchCli');
    }, 10);
}

getVentasSearch() {
    if (!this.stationSel) {
        this.stationSel = new EntStation();
        this.stationSel.idEstacion = null;
    }
    this.utilService.loader(true);
    this.carteraService.getVentas(this.client.codCliente, this.searchVentaFechaIni, this.searchVentaFechaFin, this.stationSel.idEstacion, this.tipoEstacionSel).subscribe(
            (ventas) => {
                if(!ventas || ventas.length <= 0) {
                    this.principal.showMsg('warn','SIN RESULTADOS','No se encontraron registros')
                }
                this.searchVentas = ventas;
                console.log('ventas diarias de combustible: '+JSON.stringify(this.searchVentas));//b
                this.utilService.loader(false);
                if (
                    this.searchVentas.length > 0 &&
                    this.searchVentas !== null
                ) {
                    this.estilos =
                        'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center pb-2';
                } else {
                    this.estilos =
                        'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';
                }
            },
            (error) => {
                console.log(error);
                this.utilService.loader(false);
                this.principal.showMsg('error', 'Error', error.error.message);
            },
            () => this.utilService.loader(false)
        );
}

getNameStation(id: number) {
    if (this.stationsAll == null || id == null) return;
    return this.stationsAll.find((e) => e.idEstacion == id).nombreEstacion;
}

sumConsumption() {
    let array: EntVentasClient[];
    var suma = 0;
    array = this.searchVentas;
    array.forEach((element) => {
        suma += element.VALOR;
    });
    return suma;
}

totalDescuento(){
    let arrayDto: EntVentasClient[];
    var sumaDto = 0;
    arrayDto = this.searchVentas;
    arrayDto.forEach(d => {
        sumaDto += d.DESCTO;
    });
    return sumaDto;
}

totalDeRegistros(){
    let arrayDeRegistros: EntVentasClient[];
    arrayDeRegistros = this.searchVentas;

    return arrayDeRegistros.length;
}

sumTotalCantidad(){
    let array2: EntVentasClient[];
    var suma2 = 0;
    array2 = this.searchVentas;
    array2.forEach((element) => {
        suma2 += element.CANTIDAD;
    });
    return suma2;
}
sumTotalValor(){
    let array3: EntVentasClient[];
    var suma3 = 0;
    array3 = this.searchVentas;
    array3.forEach((element) => {
        suma3 += element.VALOR;
    });
    return suma3;
}

prueba(){
    console.log('tipo de estación seleccionada: '+this.tipoEstacionSel);
    if(this.tipoEstacionSel == 'G'){
        this.detalleEstacion = 'GAS';
    }
    if(this.tipoEstacionSel == 'L'){
        this.detalleEstacion = 'LIQUIDOS';
    }
}

exportarVentasToExcel(){
    /* const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_ventas.nativeElement, {dateNF: 'yyyy/mm/dd;@', cellDates: true, raw: true}); */
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_ventas.nativeElement, {dateNF: 'dd/mm/yyyy;@', cellDates: true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Ventas_de_Gas_Pavitos.xlsx');
}

exportarVentasToCSV(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_ventas.nativeElement, {dateNF: 'dd/mm/yyyy;@', cellDates: true, raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Ventas_de_Gas_Pavitos.csv');
}

}
