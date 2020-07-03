export interface ICarteraForStation {
    ID: number;
    FECHA: string;
    TIPO: number;
    COD_CLIENTE: number;
    NOMBRE: string;
    TIPO_CUPO: number;
    PAGADO: number;
    VENDIDO: number;
    SALDO: number;
    ANTERIOR: number;
    DESCUENTO: number;
    RETENCION: number;
}

export interface iParamRPTCartera {
    station: number;
    dateIni: string;
    dateEnd: string;
    type: string;
    option: string;
    month: boolean;
}

export interface IRPTStationTurnLiq {
    FECHA: string;
    TURNO: number;
    ACPM: number;
    CORRIENTE: number;
    EXTRA: number;
}

export interface IRPTStationTurnGas {
    DIA: string;
    TURNO1: number;
    TURNO2: number;
    TURNO3: number;
    TURNO4: number;
    TOTAL: number;
}

export interface iParamRPTTurn {
    station: number;
    date: string;
    type: string;
}
