import { INoveltyTypes } from './inovelty-types';

export const ADVANCENOVELTYTYPES: INoveltyTypes[] = [
    { id: 0, name: 'Creado', rol: [] },
    { id: 1, name: 'Autorizado', rol: [11, 1] },
    { id: 2, name: 'Anulado', rol: [11, 1] },
    { id: 3, name: 'Pagado', rol: [3, 1] },
    { id: 4, name: 'Procesado', rol: [] }
];
