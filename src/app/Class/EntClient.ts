import { TaxesModel } from './Taxes.model';
export class EntClient {
    codCliente: number;
    nombre: string;
    tipoDoc: number;
    fechaCreacion: Date;
    ciudad: number;
    direccion: string;
    telefono: string;
    email: string;
    estado: boolean;
    tipoPeriodoCobro: boolean;
    periodoDiaCobro: number;
    estacion: number;
    retenedor: boolean;
    sistema: boolean;
    nitAlt: string;
    nombreAlt: string;
    todasEstaciones: boolean;
    credito: boolean;
    infoCupo: any;
    retenciones: TaxesModel[];
}
