import { PrincipalComponent } from './../../principal/principal.component';
import { NominaService } from './../../services/nomina.service';
import { EntStation } from './../../Class/EntStation';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calidad',
  templateUrl: './calidad.component.html',
  styleUrls: ['./calidad.component.css']
})
export class CalidadComponent implements OnInit {

    reportes = [{id: 0,
                nombre: 'Consolidado por partes',
                ruta: 'calidad/RPT_ConsolidadoPorPartes',
                width: 100 }];
    stations: EntStation[];
    stationSel: EntStation;
    paramSel;
    fecha: String;
    eventSearch = true;
    showReport = false;
    params: any[];
    nameReport;
    widthReport;

  constructor(private nominaService: NominaService,
    private principal: PrincipalComponent) { }

  ngOnInit(): void {
      this.getEstaciones();
  }

  get validaOpcionListaDeSeleccion(){
    if(this.paramSel){
        return true;
    }else{
        return false;
    }
}

get validaFecha(){
    if(this.fecha){
        return true;
    }else{
        return false;
    }
}

  getEstaciones() {
    this.nominaService.GetStations().subscribe(
        (res) => {
            this.stations = res;
        },
        (error) => {
            console.log(error);
        }
    );
}

get validaEstacion() {
    if (this.stationSel == undefined) {
        return true;
    } else {
        return false;
    }
}

getEstacionValidada() {
    if (this.validaEstacion) {
        this.principal.showMsg(
            'warn',
            'Atención',
            'Favor seleccione la estación que requiere consultar porque está: ' +
                this.stationSel
        );
        return;
    }
}

getReport($element){

    if(!this.validaOpcionListaDeSeleccion){
        this.principal.showMsg('info', 'Atención', 'Aún tiene opciones por diligenciar, '
        +'por favor seleccione el reporte que desea visualizar: '+this.paramSel);
        return;
    }
    if (this.paramSel.id == 0) {
        this.getEstacionValidada();
    }

    if((!this.validaFecha) && (this.paramSel.id == 0)){
        this.principal.showMsg('warn', 'Atención', 'Aún tiene opciones por diligenciar, '
        +'por favor seleccione la fecha que desea consultar: '+this.fecha);
    }

    if(this.paramSel && this.paramSel.nombre){
        this.stringReport($element);
    }else {
        this.eventSearch = !this.eventSearch;
        this.showReport = false;
        setTimeout(() =>{
            $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
        }, 300);
    }
}

stringReport($element){
    this.params = [];

    if(this.paramSel.id == 0){
        this.params.push([this.fecha, 'Fecha']);
        this.params.push([this.stationSel.idEstacion, 'IdEstacion']);
    }

    this.nameReport = this.paramSel.ruta;
    this.widthReport = this.paramSel.whidth;
    this.showReport = true;
    setTimeout(() => {
        $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }, 300);
}

}
