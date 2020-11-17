import { Time } from '@angular/common';

export class EntConsumptionClient {
    id: number;
    idIdentificador: number;
    fechaConsumo: Date;
    horaConsumo: Time;
    cantidad: number;
    valor: number;
    estacionConsumo: number;
    ConsecutivoEstacion: number;
    cuentaCobro: number;
    numCuentaCobro: number;
    romIdentificador: string;
    placa: string;
    codCliente: number;
    estacionCliente: number;
    nombreCliente: string;
    idPedido: number;
    combustible: number;
    manual: boolean;
    fecha: string;
    usuario: string;
    DESCRIPCION: string;
    TipoCombustible: string;
}
