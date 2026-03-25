import { NominaService } from './../../services/nomina.service';
import { TanquesDeCombustible } from './../../Class/tanques-de-combustible';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-inventario-fisico',
    templateUrl: './inventario-fisico.component.html',
    styleUrls: ['./inventario-fisico.component.css'],
    standalone: false
})
export class InventarioFisicoComponent implements OnInit {

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
    tanqueKennedy: TanquesDeCombustible[]=[];
    tanqueBolivar: TanquesDeCombustible[]=[];

    combustiblePavitos: number;//b
    objetoPavitos;//b
    dataEds = [];
    sumaDataPavitos: number = 0;
    pavitosT0;//b
    pavitosT1;//b
    pavitosT2;//b

  constructor(private nominaService: NominaService) {
    }

  ngOnInit(){
      this.setTanque();
  }
    fechaActual(){
        return new Date().toJSON().slice(0, 10);
    }

  setCombustible(ev: any, combustible: any, eds: any){
    var fechaHoy = new Date().toJSON().slice(0,10);

    console.log('fecha de hoy: '+fechaHoy);//b

    console.log('evento id del tanque: '+ev.target.id+', tipo: '+Object.prototype.toString.call(parseInt(ev.target.id)));//b
    console.log('combustible: '+combustible+', tipo: '+Object.prototype.toString.call(combustible));//b

    var galonaje = parseInt(ev.target.value);
    if(isNaN(galonaje)){
        galonaje = 0;
    }

    var id_tanque = parseInt(ev.target.id);

    console.log('encontrado: '+this.dataEds.findIndex(e => (e.id_tanque == id_tanque)));//b

    this.dataEds.forEach(e => console.log('elemento = '+JSON.stringify(e)));//b

    if(this.dataEds.findIndex(e => (e.id_tanque == id_tanque)) < 0){

        this.dataEds.push({"eds": eds, "combustible": combustible, "id_tanque": id_tanque, "fecha": fechaHoy, "cantidad": galonaje});
    }

    if(this.dataEds.findIndex(e => (e.id_tanque == id_tanque)) >= 0){

        this.dataEds[this.dataEds.findIndex(e => (e.id_tanque == id_tanque))].cantidad = galonaje;
    }

    console.log('%c Consulta de tanques: '+JSON.stringify(this.tanqueKennedy), 'color: #45E718; background: #000;');//b
    console.log('%c Data a enviar de eds: '+JSON.stringify(this.dataEds), 'color: #A7F10E; background: #580EF1;');//b

  }

  getCombustiblePavitos(){
    var suma = 0;
    this.dataEds.forEach(e =>
        {
            if(e.eds == "PAVITOS"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustiblesra(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "SEÑORA VILLAVICENCIO"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleColombia(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "COLOMBIA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleCatama(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "CATAMA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleCusiana(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "CUSIANA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleGasollanos(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "GASOLLANOS"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleKennedy(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "KENNEDY"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleCalle13(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "CALLE 13"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustiblePasoGanadero(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "PASO GANADERO"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleJordan(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "JORDAN"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleCra5ta(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "CARRERA 5TA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleGalarza(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "GALARZA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleBolivar(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "BOLIVAR"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleJardin(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "JARDIN"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleMolienda(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "LA MOLIENDA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleCarmen(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "EL CARMEN"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

  getCombustibleVictoria(){
    var suma = 0;
    this.dataEds.forEach(e => {
        if(e.eds == "LA VICTORIA"){suma += parseInt(e.cantidad);}
    });
      return suma;
  }

    setTanque(){
            this.nominaService.getInventarioCombustible().subscribe(data =>{
                this.tanques = data;
                //console.log('tanques: '+JSON.stringify(this.tanques));//b
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
                    if(eds.eds == 'KENNEDY'){
                        this.tanqueKennedy.push(eds);
                    }
                    if(eds.eds == 'BOLIVAR'){
                        this.tanqueBolivar.push(eds);
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

