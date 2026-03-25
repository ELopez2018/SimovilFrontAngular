import { PrincipalComponent } from './../../principal/principal.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-informes-rh',
    templateUrl: './informes-rh.component.html',
    styleUrls: ['./informes-rh.component.css'],
    standalone: false
})
export class InformesRHComponent implements OnInit {

        reportes = [{id: 0,
                    nombre: 'Control de asistencia por dia',
                    ruta: 'GestionHumana/RPT_ControlAsistencia',
                    width: 100},
                    {id: 1,
                    nombre: 'Control de asistencia por rango de fecha',
                    ruta: 'GestionHumana/RPT_ControlAsistenciaPorFecha',
                    width: 100}];
        paramSel;
        dia: String;
        params: any[];
        nameReport;
        widthReport;
        showReport = false;
        eventSearch = true;
        fechaHasta: String;
        hasta: boolean = false;
        desde: boolean = false;
        diaBoolean: boolean = true;

  constructor(private principalComponent: PrincipalComponent) { }

  ngOnInit(): void {
  }

    get validaOpcionListaDeSeleccion(){
        if(this.paramSel){
            return true;
        }else{
            return false;
        }
    }

    get validaFechaDia(){
        if(this.dia){
            return true;
        }else{
            return false;
        }
    }

    get validaFechaHasta(){
        if(this.fechaHasta){
            return true;
        }else{
            return false;
        }
    }

    getReport($element){
        if(!this.validaOpcionListaDeSeleccion){
            this.principalComponent.showMsg('info', 'Atención', 'Aún tiene opciones por diligenciar, '
            +'por favor seleccione el reporte que desea visualizar: '+this.paramSel);
            return;
        }

        if(!this.validaFechaDia){
            this.principalComponent.showMsg('warn', 'Atención', 'Aún tiene opciones por diligenciar, '
            +'por favor seleccione el día que desea visualizar: '+this.dia);
        }

        if((!this.validaFechaHasta) && (this.paramSel.id == 1)){
            this.principalComponent.showMsg('error', 'Atención', 'Aún tiene opciones por diligenciar, '
            +'por favor seleccione la (fecha-hasta) que desea consultar: '+this.fechaHasta);
        }

        if(this.paramSel && this.paramSel.nombre){
            this.stringReport($element);
        } else {
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
        this.params.push([this.dia, 'Dia']);
        }

        if(this.paramSel.id == 1){
            this.params.push([this.dia, 'Fini']);
            this.params.push([this.fechaHasta, 'Fin']);
        }

        this.nameReport = this.paramSel.ruta;
        this.widthReport = this.paramSel.width;
        this.showReport = true;
        setTimeout(() => {
            $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
        }, 300);
    }

    getBooleanos(){
        if(this.paramSel.id == 0){
            this.hasta = false;
            this.desde = false;
            this.diaBoolean = true;
        }
        if(this.paramSel.id == 1){
            this.hasta = true;
            this.desde = true;
            this.diaBoolean = false;
        }
    }

}
