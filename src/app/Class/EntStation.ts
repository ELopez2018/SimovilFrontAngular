import { EntIsland } from "./EntIsland";

export class EntStation {
    public idEstacion: number;
    public nombreEstacion: string;
    public ciudadEstacion: number;
    public direccion: string;
    public telefono: string;
    public listoSimovil: boolean;
    public administrador: string;
    public usuario: string;
    public cuentaBancaria: string;
    public banco: number;
    public empresa: number;
    public articulos: articulo_estacion[];
    public tipoEstacion: number;
    public sisLiq: boolean;
    public sisGas: boolean;
    public turno: number;
    public manual: boolean;
    public nom_cont: string;
    public nombreCiudad?: string;
    public num_caja : number;
    public islas : EntIsland[];
    public planta : number;
}

export interface articulo_estacion {
    ID_ARTICULO: number;
    ID_ESTACION: number;
    VALOR: number;
    VALOR_ANT: number;
    USUARIO: string;
    FECHA: string;
    TURNO: number;
    CAM_VAL: boolean;
}