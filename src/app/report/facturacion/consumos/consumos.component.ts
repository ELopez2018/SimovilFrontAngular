import { PrincipalComponent } from './../../../principal/principal.component';
import { UtilService } from './../../../services/util.service';
import { CarteraService } from './../../../services/cartera.service';
import { NominaService } from './../../../services/nomina.service';
import { EntStation } from './../../../Class/EntStation';
import { Component, OnInit} from '@angular/core';
import { dateToISOString, rangedate } from '../../../util/util-lib';
import { EntClient } from '../../../Class/EntClient';

@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.css']
})
export class ConsumosComponent implements OnInit {

    paramSel;
    treeParams = [{id: 0, text: 'Consumos Facturación', report: 'Administracion/RPT_CONSUMOS_FACTURACION', width: 100}];
    stationCod;
    stationSel: EntStation;
    clienteSel: EntClient;
    stations: EntStation[];
    clientes: EntClient[];
    dateIni: String;
    dateL: Date[];
    dateEnd: string;
    porEstacion: boolean;
    utilService: UtilService;
    showReport = false;
    nameReport;
    widthReport;
    params: any[];
    eventSearch = true;

  constructor(
      private nominaService: NominaService,
      private PrincipalComponent: PrincipalComponent,
      private carteraService: CarteraService
  ) {
      this.dateL = rangedate(dateToISOString(new Date()), 1);
  }

  ngOnInit() {
      this.getEstaciones();
      this.getFechaDesdeHasta();
  }

  getEstaciones(){
    this.nominaService.GetStations().subscribe(res =>{
        this.stations = res;
        if(this.stationCod){
            this.stationSel = this.stations.find(e => e.idEstacion == this.stationCod)
        }
    }, error => {
        console.log(error);
    });
  }

  getClientes(){

        this.porEstacion = true;

        this.carteraService.getClientesConSaldosIniciales(this.stationSel.idEstacion).subscribe(data =>{
        this.clientes = data;
        if(this.stationCod){
        this.clienteSel = this.clientes.find(f => f.estacion == this.stationCod)
        }
        if(this.clientes.length == 0){
           console.log('Atención: Aún no hay clientes con saldo histórico para la estación:) '+this.stationSel.nombreEstacion);
           this.PrincipalComponent.showMsg('warn', 'Atención', 'Aún no hay clientes con saldo histórico para la estación: '+this.stationSel.nombreEstacion);
        }
    }, error => {
        console.log('Errores : ', error);
    })

  }

  getFechaDesdeHasta(){
    this.dateIni = dateToISOString(this.dateL[0]);
    this.dateEnd = dateToISOString(this.dateL[1]);
  }

  changeReport(){}

  get validSearch(){
    if(this.paramSel && this.stationSel && this.clienteSel){
        return true;
    }else {
        return false;
    }
}

  getReport($element) {

    if(!this.validSearch){
        this.PrincipalComponent.showMsg('info', 'Atención', 'Aún tiene opciones por diligenciar!, '
        +'seleccione el Reporte: '+this.paramSel+', la Estación: '+this.stationSel+', y el cliente: '+this.clienteSel);
        return;
    }

    if (this.paramSel && this.paramSel.report) {
        this.stringReport($element);
    } else {
        this.eventSearch = !this.eventSearch;
        this.showReport = false;
        setTimeout(() => {
            $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 300);
    }

}

stringReport($element) {
    if (!this.valid) {
        return;
    }
    this.params = [];
    this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
    this.params.push([this.dateIni, 'FECHAINI']);
    this.params.push([this.dateEnd, 'FECHAFIN']);
    this.params.push([this.clienteSel.codCliente, 'CODCLIENTE']);

    this.nameReport = this.paramSel.report;
    this.widthReport = this.paramSel.width;
    this.showReport = true;
    setTimeout(() => {
        $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, 300);
}

get valid() {
    if (this.stationSel) {
        return true;
    }
    return false;
}

clear(){
    this.paramSel = null;
    this.stationSel = null;
    this.clienteSel = null;
    this.dateIni = dateToISOString(this.dateL[0]);
    this.dateEnd = dateToISOString(this.dateL[1]);
}

}
