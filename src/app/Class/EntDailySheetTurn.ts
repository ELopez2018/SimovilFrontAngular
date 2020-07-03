import { EntDailySheetTurnDet } from './EntDailySheetTurnDet';

export class EntDailySheetTurn {
    ID?: number;
    ID_PLANILLA?: number;
    NUM_TUR: number;
    CANT_VENTA: number;
    TOTAL: number;
    PLA_DIA_TUR_VEN: EntDailySheetTurnDet[];
}
