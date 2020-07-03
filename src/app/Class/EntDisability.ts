import { EntDisabilityNovelty } from './EntDisabilityNovelty';

export class EntDisability {
    id: number;
    novedadId: number;
    motivo: number;
    administradora: number;
    dias: number;
    valor: number;
    saldo: number;
    valorPagado: number;
    estado: number;
    fechaIni: string;
    fechaFin: string;
    diasReal: number;
    radicado: number;
    radicar: boolean;
    novedadIncapacidad: EntDisabilityNovelty[];
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    detalle: string;
}
