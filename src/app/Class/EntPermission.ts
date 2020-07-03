export class EntPermission {
    ID: number;
    DESCRIPCION: string;
    OPCION_PADRE: number;
    MODULO: number;
    URL: string;
    ICONO: string;
    ESTADO: boolean;
    VISIBLE: boolean;
    ORDEN_MENU: number;
    ID_PERFIL: number;
    ID_OPCION: number;
    TODO: boolean;
    CREAR: boolean;
    LEER: boolean;
    ACTUALIZAR: boolean;
    BORRAR: boolean;
    IMPRIMIR: boolean;
    USUARIO : string;
    ULTIMA_MODIFICACION : string;
    HIJO: EntPermission[];
}