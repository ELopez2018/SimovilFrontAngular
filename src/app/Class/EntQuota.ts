import { EntDiscount } from "./EntDiscount";

export class EntQuota {
    idCupo: number;
    codCliente: number;
    cupoAsignado: number;
    cupoDisponible: number;
    tipoCupo: number;
    estadoCupo: boolean;
    editable: boolean;
    descuento: EntDiscount[];
}
