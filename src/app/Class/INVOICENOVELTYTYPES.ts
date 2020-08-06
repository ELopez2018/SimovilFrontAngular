import { INoveltyTypes } from './inovelty-types';

export const INVOICENOVELTYTYPES: INoveltyTypes[] = [
    { id: 0, name: 'Creado', rol: [] },
    { id: 1, name: 'Enviado', rol: [5, 6, 1, 12, 9, 14, 16, 18, 19] },
    { id: 2, name: 'Recibido', rol: [5, 6, 12, 1, 9, 3, 18, 5, 14, 16, 19] },
    { id: 3, name: 'Revisado', rol: [10, 1] },
    { id: 4, name: 'Autorizado', rol: [11, 1] },
    { id: 5, name: 'Devuelto', rol: [10, 11, 1, 9, 12, 14, 16] },
    { id: 6, name: 'Causado', rol: [ 9, 14, 1, 16, 19] },
    { id: 7, name: 'Pagado', rol: [3, 1, 18] },
    { id: 8, name: 'Cambiada', rol: [] },
    { id: 9, name: 'Anulada', rol: [ 1, 19] },
    { id: 10, name: 'Nota Auditoria', rol: [5, 1, 19 ] },
    { id: 11, name: 'Revisado Auditoria', rol: [5, 1, 19] },
    { id: 12, name: 'Editado', rol: [] },
    { id: 13, name: 'Revisado CoorContable', rol: [14, 1] }
];
