export class EntAdtvaDatosEstaciones {
    constructor(
        public idEstacion: number,
        public nombreEstacion: string,
        public fechaUltimoRegistro: Date,
        public ventaBruta: number,
        public utilidad: number,
        public IdtipoEstacion: number,
        public tipoEstacion: string,
    ) { }
}
