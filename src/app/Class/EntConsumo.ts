import { Time } from '@angular/common';

export class EntConsumo {
    constructor (
        public consecutivo: number,
        public fecha: Date,
        public hora: Time,
        public cantidad: number,
        public valor: number,
        public placa: string,
        public combustible: number
    ) {

    }

}
