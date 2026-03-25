import { TanquesDeCombustible } from './../../../Class/tanques-de-combustible';
import { PrincipalComponent } from './../../../principal/principal.component';
import { NominaService } from './../../../services/nomina.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tanques-liq',
    templateUrl: './tanques-liq.component.html',
    styleUrls: ['./tanques-liq.component.css'],
    standalone: false
})
export class TanquesLiqComponent implements OnInit {

    tanques: TanquesDeCombustible[]=[];
    idEstacion: number = 91;
    tanque15Pavitos: number = 0;
    tanque17Pavitos:number;
    tanque21Pavitos:number;
    tp: any;
    estacionesLiquido = [96, 91];
    //tanques de estaciones
    tanqueCatama: TanquesDeCombustible[]=[];
    tanqueCusiana: TanquesDeCombustible[]=[];
    tanqueJordan: TanquesDeCombustible[]=[];
    tanquePasoGanadero: TanquesDeCombustible[]=[];
    tanquePavitos: TanquesDeCombustible[]=[];
    tanqueColombia: TanquesDeCombustible[]=[];
    tanqueSraVillavicencio: TanquesDeCombustible[]=[];
    tanqueLaMolienda: TanquesDeCombustible[]=[];
    tanqueGalarza: TanquesDeCombustible[]=[];
    tanqueJardin: TanquesDeCombustible[]=[];
    tanqueElCarmen: TanquesDeCombustible[]=[];
    tanqueLaVictoria: TanquesDeCombustible[]=[];
    tanqueCalle13: TanquesDeCombustible[]=[];
    tanqueCra5Ta: TanquesDeCombustible[]=[];
    tanqueGasollanos: TanquesDeCombustible[]=[];
    booleanTanquesEds: boolean = false;
    dataTanqueEds: TanquesDeCombustible[]=[];
    tanqueGenerico: TanquesDeCombustible[]=[];

  constructor(private nominaService: NominaService,
    private principal: PrincipalComponent) {
    }

  ngOnInit(){
      this.setTanque(91);
  }

    setTanque(estacion){
            this.nominaService.getINivelTanque(estacion).subscribe(data =>{
                this.tanques = data;
                this.tanques.forEach(eds=>{
                    if(eds.eds == 'CATAMA'){
                        this.tanqueCatama.push(eds);
                    }
                    if(eds.eds == 'CUSIANA'){
                        this.tanqueCusiana.push(eds);
                    }
                    if(eds.eds == 'JORDAN'){
                        this.tanqueJordan.push(eds);
                    }
                    if(eds.eds == 'PASO GANADERO'){
                        this.tanquePasoGanadero.push(eds);
                    }
                    if(eds.eds == 'PAVITOS'){
                        this.tanquePavitos.push(eds);
                    }
                    if(eds.eds == 'COLOMBIA'){
                        this.tanqueColombia.push(eds);
                    }
                    if(eds.eds == 'SEÑORA VILLAVICENCIO'){
                        this.tanqueSraVillavicencio.push(eds);
                    }
                    if(eds.eds == 'LA MOLIENDA'){
                        this.tanqueLaMolienda.push(eds);
                    }
                    if(eds.eds == 'GALARZA'){
                        this.tanqueGalarza.push(eds);
                    }
                    if(eds.eds == 'JARDIN'){
                        this.tanqueJardin.push(eds);
                    }
                    if(eds.eds == 'EL CARMEN'){
                        this.tanqueElCarmen.push(eds);
                    }
                    if(eds.eds == 'LA VICTORIA'){
                        this.tanqueLaVictoria.push(eds);
                    }
                    if(eds.eds == 'CALLE 13'){
                        this.tanqueCalle13.push(eds);
                    }
                    if(eds.eds == 'CARRERA 5TA'){
                        this.tanqueCra5Ta.push(eds);
                    }
                    if(eds.eds == 'GASOLLANOS'){
                        this.tanqueGasollanos.push(eds);
                    }
                });
            });

    }

    getTanques(){
        console.log('data tanques: '+JSON.stringify(this.tanques));
    }

    verTanquesEds(data){
        this.booleanTanquesEds = true;
        this.tanqueGenerico = data;
    }

    clear(){
        this.tanques = [];
    }

}
