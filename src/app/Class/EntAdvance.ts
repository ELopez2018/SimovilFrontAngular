import { EntNoveltyAdvance } from './EntNoveltyAdvance';

export class EntAdvance {
    idAnticipo?: number;
    proveedor: number;
    valor: number;
    detalle: string;
    estado: number;
    factura: number;
    fecha: string;
    rutaPago: string;
    novedadAnticipo?: EntNoveltyAdvance[];
    nombreProvee?: string;
    idEstacion?: number;
}
