export class EntOrder {
    idPedido: number;
    codCliente: number;
    controlado: boolean;
    todaEstacion: boolean;
    todoVehiculo: boolean;
    vigencia: number;
    valor: number;
    estado: boolean;
    fechaCreacion: Date;
    PedidoDetalleAuto: any;
    PedidoDetalleEstacion: any;
    saldo: number;
    consumido: number;
}
