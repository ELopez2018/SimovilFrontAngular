export class EntCplLecturasIniciales {
    constructor(
        public ID: number,
        public NUM_ISL: number,
        public DET_ISL: string,
        public NUM_TUR: number,
        public NUM_SUR: number,
        public DET_SUR: string,
        public COD_MAN: number,
        public COD_ART: number,
        public DETALLE_MAG: string,
        public DESCRIPCIO_ART: string,
        public PRECIO: number,
        public LEC_INI: number,
        public LEC_FIN: number,
        public CANTIDAD: number,
        public TOTAL: number
    ) { }
}
