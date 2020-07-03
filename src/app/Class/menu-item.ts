export interface MenuItem {
    ID? : number;
    DESCRIPCION: string;
    ESTADO?: boolean;
    ICONO: string;
    URL?: string;
    HIJO?: MenuItem[];
}
