import { TanquesDeCombustible } from './../../../tanques-de-combustible';
import { NominaService } from './../../../../services/nomina.service';
export class Tanque {

    idEstacion;
    nominaService: NominaService;
    dataTanque: TanquesDeCombustible[] = [];

    constructor(idEstacion,
        nominaService: NominaService){
        this.idEstacion = idEstacion;
        this.nominaService = nominaService;
        //this.crearTanque();
    }

    crearTanque(){
        this.nominaService.getINivelTanque(this.idEstacion).subscribe(data =>{
            this.dataTanque = data;
            console.log(this.dataTanque);
        });
    }

    creado(){
        return this.dataTanque;
    }
}
