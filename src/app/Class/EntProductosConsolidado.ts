export class EntProductosConsolidado {
    Id: number;
    CodContable: string;
    Descripcion: string;
    InvInicial: number;
    InvFinal: number;
    Compras: number;
    Ventas: number;
    Bajas: number;
    PrecioCompra: number;
    PrecioVenta: number;
    categoria?: number;
    PrecioCostoInicial?: number;
    Utilidad: number;
    tamano: number;
    ganancia: number;
    traslados: number;
    acredito: number;
    trasladosRecibidos: number;
}
