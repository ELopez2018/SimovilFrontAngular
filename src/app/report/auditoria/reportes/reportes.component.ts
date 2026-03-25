import { PrincipalComponent } from './../../../principal/principal.component';
import { UtilService } from './../../../services/util.service';
import { NominaService } from './../../../services/nomina.service';
import { EntStation } from './../../../Class/EntStation';
import { Component, OnInit } from '@angular/core';
import { dateToISOString, rangedate } from '../../../util/util-lib';
import { EntClient } from '../../../Class/EntClient';

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css'],
    standalone: false
})
export class ReportesComponent implements OnInit {

    paramSel;
    treeParams = [{id: 0, text: 'Cambio de precios en combustible', report: 'auditoria/RPT_preciosCPLySERVIPUNTO', width: 100},
                  {id: 1, text: 'Reembolso por caja menor', report: 'auditoria/RPT_ReembolsoCaja', width: 100}];
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
    edsBoolean: boolean = false;
    fechaSinceBoolean: boolean = false;
    fechaToBoolean: boolean = false;

  constructor(private nominaService: NominaService,
    private principal: PrincipalComponent)
    {
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

  getFechaDesdeHasta(){
    this.dateIni = dateToISOString(this.dateL[0]);
    this.dateEnd = dateToISOString(this.dateL[1]);
  }

  changeReport(){}

  getBoolean(){
      if(this.paramSel.id == 0){
          this.edsBoolean = true;
          this.fechaSinceBoolean = false;
          this.fechaToBoolean = false;
      }
      if(this.paramSel.id == 1){
          this.edsBoolean = false;
          this.fechaSinceBoolean = true;
          this.fechaToBoolean = true;
      }
  }

  get validSearch(){
    if(this.paramSel && this.stationSel){
        return true;
    }else {
        return false;
    }
}

get validaOpcionDeSeleccion(){
    if(this.paramSel){
        return true;
    }else{
        return false;
    }
}

  getReport($element) {

    if(this.paramSel == undefined){
        this.principal.showMsg('warn', 'Atención', 'Favor seleccione una opción de la lista de reportes: '+this.paramSel);
        return;
    }

    if(!this.validSearch && this.paramSel.id == 0){
        this.principal.showMsg('info', 'Atención', 'Por favor seleccione la Estación: '+this.stationSel);
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

    if(this.paramSel.id == 0){
    this.params.push([this.stationSel.idEstacion, 'idEstacion']);
    }

    if(this.paramSel.id == 1){
        this.params.push([this.dateIni, 'Fini']);
        this.params.push([this.dateEnd, 'Fin']);
    }

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
