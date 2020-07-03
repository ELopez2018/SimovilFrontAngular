import { EntCPL_Detalle } from './EntCPL_Detalle';

export class EntCPL {
    public ID?: number;
    public ID_ESTACION: number;
    public FECHA: string;
    public VALOR: number;
    public DETALLE: EntCPL_Detalle[];
}
