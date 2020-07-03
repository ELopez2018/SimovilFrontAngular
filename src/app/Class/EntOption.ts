export class EntOption {
    ID: number;
    DESCRIPCION: string;
    OPCION_PADRE: number;
    MODULO: number;
    URL: string;
    ICONO: string;
    ESTADO: boolean;
    VISIBLE: boolean;
    ORDEN_MENU: number;
    HIJO : EntOption[];
}