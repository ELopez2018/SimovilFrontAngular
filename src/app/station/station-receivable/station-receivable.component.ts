import { EntStation } from './../../Class/EntStation';
import { EntRole } from './../../Class/EntRole';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EntReceivable } from '../../Class/EntReceivable';
import { EntClient } from '../../Class/EntClient';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { EntConsumptionClient } from '../../Class/EntConsumptionClient';
import { NominaService } from '../../services/nomina.service';
import { PrintService } from '../../services/print.service';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import {
    rangedate,
    dateToISOString,
    focusById,
    ObjToCSV,
} from '../../util/util-lib';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as XLSX from 'xlsx';
import { showMessage } from 'igniteui-angular/lib/core/deprecateDecorators';

@Component({
    selector: 'app-station-receivable',
    templateUrl: './station-receivable.component.html',
    styleUrls: ['./station-receivable.component.css'],
    animations: [fadeTransition()],
    standalone: false
})
export class StationReceivableComponent implements OnInit {

    @ViewChild('tabla_de_cuentas_de_cobro') tabla_de_cuentas_de_cobro: ElementRef;
    searchReceivable: EntReceivable[];
    codEstation;
    stationCode: number = null;
    stationSel: EntStation = new EntStation();
    client: EntClient;
    searchFechaIni;
    searchFechaFin;
    searchStatus: boolean = null;
    id;
    stationsAll;
    DiaSemaforo = [7, 16];
    booleanClient = false;
    rolSistemas: boolean = false;
    rol: EntRole;
    cuentaRoja: boolean = false;
    cuentaVerde: boolean = false;
    cuentaAmarilla: boolean = false;
    cuentaBlanca: boolean = false;

    constructor(
        private nominaService: NominaService,
        private carteraService: CarteraService,
        private storageService: StorageService,
        private principal: PrincipalComponent,
        private route: ActivatedRoute,
        private location: Location,
        private printService: PrintService,
        private utilService: UtilService
    ) {
        this.stationCode = this.storageService.getCurrentStation();
    }

    ngOnInit() {
        this.GetEstaciones();
        const fechas = rangedate(dateToISOString(new Date()), 1);
        this.searchFechaIni = dateToISOString(fechas[0]);
        this.searchFechaFin = dateToISOString(fechas[1]);
        this.client = new EntClient();
        this.GetParam();
        focusById('btnSearch');
        this.getRolAdmin();
    }

    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        if (id != null) {
            this.searchByParam(id);
        }
    }

    Eliminar(CuentaCobro, i) {
        Swal.fire({
            title: '¿ESTA SEGURO?',
            text:
                `Está a punto de eliminar la cuenta de cobro N° ${this.searchReceivable[i].num} de ${this.searchReceivable[i].nombre}. ¿Desea Continuar`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
        }).then((result) => {
            if (result.value) {
                this.carteraService.DeleteRecievable(CuentaCobro).subscribe((resp) => {
                        this.principal.showMsg('success', 'CUENTA COBRO ELIMINADA', resp[0].resp);
                        this.searchReceivable.splice(i, 1);
                    });
            } else {
                return;
            }
        });
    }

    searchByParam(id) {
        this.carteraService.GetClient(id).subscribe(
            (client) => {
                this.client = client[0];
            },
            (error) => {
                console.log(error);
                this.location.back();
            }
        );
    }

    searchClient() {
        if (this.client.codCliente == null) {
            return;
        }
        this.searchReceivable=[];
        this.carteraService.GetClient(this.client.codCliente).subscribe(
            (client) => {
                if (client.length != 0) {
                    this.client = client[0];
                } else {
                    this.principal.showMsg('info', 'Información', 'Cliente no encontrado.');
                }
            },
            (error) => {
                console.log(error);
                this.principal.showMsg('error', 'Error', error.error.message);
            }
        );
    }

    getReceivableSearch() {
        this.searchReceivable=[];
        this.utilService.loader(true);
        this.carteraService.getReceivable(this.client.codCliente, this.searchStatus, this.searchFechaIni, this.searchFechaFin, null, this.stationSel.idEstacion).subscribe(
                receivable => {this.searchReceivable = receivable;
                               if(this.searchReceivable.length == 0){
                                   this.principal.showMsg('warn', 'No hay registros', 'correspondientes entre la estación: '+this.stationSel.nombreEstacion+', y el cliente: '+this.client.nombre+', por favor verifique sus datos de consulta');
                                   return;
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

    GetEstaciones() {
        this.nominaService.GetStations().subscribe(data => {
                this.stationsAll = data;
                if (this.stationCode) {
                    this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                }
            }, (error) => console.error(error.error.message)
        );
    }

    sumReceivables() {
        let array: EntReceivable[];
        var suma = 0;
        array = this.searchReceivable;
        array.forEach((element) => {
            suma += element.valor;
        });
        return suma;
    }

    cleanReceivableSearch() {
        this.searchFechaIni = null;
        this.searchFechaFin = null;
        this.searchReceivable = null;
        this.searchStatus = null;
    }

    printReceivableSearch(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-receivables').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Consumos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Cuentas de cobro del ${this.searchFechaIni} al ${this.searchFechaFin}</h4>
          ${printContents}
        </body>
      </html>`);
        popupWin.document.close();
    }

    back() {
        this.location.back();
    }

    addDate(value) {
        var da = new Date(value);
        return da.setDate(da.getDate() + 15);
    }

    // porCobrar(fecha: string) {
    //   let fechamod = new Date(fecha);
    //   var actual = new Date();
    //   var diff = actual.getTime() - fechamod.getTime();
    //   if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[0])
    //     return 'tb sem1';
    //   else if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[1])
    //     return 'tb sem2';
    //   else
    //     return 'tb sem3';
    // }

    printReceivable(receivable: EntReceivable, preView: boolean= false ) {
        this.utilService.loader(true);
        var consumosC: EntConsumptionClient[];
        this.carteraService.getConsumption(receivable.codCliente, null, null, receivable.id, receivable.idEstacion).subscribe(
                (consumos) => {
                    consumosC = consumos;
                    // console.log('receivable', consumos);                    
                    this.printService.printReceivable(receivable, consumosC, this.stationsAll.find((e) => e.idEstacion == receivable.idEstacion),                        
                        (result) => {
                            this.utilService.loader(false);
                        },
                        preView
                    );
                },
                (error) => console.log(error)
            );
    }

    porCobrar(receivable: EntReceivable) {
        if (receivable.estado == false) {
            return;
        }
        let fechamod = new Date(receivable.fecha);
        var actual = new Date();
        var diff = actual.getTime() - fechamod.getTime();
        /* console.log('dia semaforo'+this.DiaSemaforo[0]);
        console.log(diff);
        console.log(receivable.num); */
        if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[0]) {
            this.cuentaRoja = false;
            this.cuentaVerde = true;
            return 'tb sem1';
        } else if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[1]) {
            this.cuentaRoja = false;
            this.cuentaVerde = false;
            return 'tb sem2';
        } else {
            this.cuentaRoja = true;
            this.cuentaVerde = false;
            return 'tb sem3';
        }
    }

    resultClient(client: EntClient) {
        this.searchReceivable = [];
        this.client = client;
        this.booleanClient = false;
        focusById('btnSearch');
    }

    openModCli() {
        this.booleanClient = true;
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }

    csvReceivableSearch() {
        let title = [
            'num',
            'fecha',
            'codCliente',
            'nombre',
            'periodoIni',
            'periodoFin',
            'estado',
            'valor',
            'saldo',
        ];
        let titleB = [
            'Número',
            'Fecha',
            'Nit',
            'Nombre',
            'Desde',
            'Hasta',
            'Estado',
            'Valor',
            'Saldo',
        ];
        let item = JSON.parse(JSON.stringify(this.searchReceivable));
        item.map((e) => {
            e.fecha = formatDate(e.fecha, 'dd/MM/yyyy', 'en-US', '+0000');
            e.periodoIni = formatDate(
                e.periodoIni,
                'dd/MM/yyyy',
                'en-US',
                '+0000'
            );
            e.periodoFin = formatDate(
                e.periodoFin,
                'dd/MM/yyyy',
                'en-US',
                '+0000'
            );
        });
        this.printService.downloadCSV(
            ObjToCSV(item, title, titleB),
            'cuenta_cobro'
        );
    }

    getRolAdmin(){
        this.carteraService.getRolAdmin().subscribe(data => {
            this.rol = data[0];
               if((this.rol.ID == this.storageService.getCurrentUserDecode().idRol) && (this.rol.ID_AREA == this.storageService.getCurrentUserDecode().Area))
                    {
                    this.rolSistemas = true;
                    console.log('hola sistemas:)');
                    }
        }, error => console.log(error));
    }

    exportarCuentaCobroToExcel(){
        console.log('¡Exportando, exportando!');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_cuentas_de_cobro.nativeElement, {dateNF: 'yyyy/mm/dd;@', cellDates: true, raw: true});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Cuentas_de_cobro_de_Cartera.xlsx');
    }
}
