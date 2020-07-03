import { EntSalesTurnDetail } from "./EntSalesTurnDetail";

export class EntSalesTurn {
    ID: number;
    ID_ESTACION: number;
    FECHA: string;
    TIPO: string;
    VALOR: number;
    TEMPORAL: boolean;
    EDITADO: boolean;
    DETALLE: EntSalesTurnDetail[];
    NOMBRE_ESTACION: string;
}