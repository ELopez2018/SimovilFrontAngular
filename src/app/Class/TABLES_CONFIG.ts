
export const TABLEINVOICEPENDING: iTableConfig[] = [
    { name: 'Número', visible: true },
    { name: 'Proveedor', visible: true },
    { name: 'Nombre', visible: true },
    { name: 'Recibido', visible: false },
    { name: 'Vence', visible: true },
    { name: 'Estado', visible: true },
    { name: 'Egreso', visible: false },
    { name: 'Historial', visible: false },
    { name: 'Estación', visible: true },
    { name: 'Valor', visible: true },
    { name: 'Saldo', visible: true }
];

export const TABLEADVANCEPENDING: iTableConfig[] = [
    { name: 'Número', visible: true },
    { name: 'Proveedor', visible: true },
    { name: 'Nombre', visible: true },
    { name: 'Fecha', visible: true },
    { name: 'Estado', visible: true },
    { name: 'Valor', visible: true }
];

export class iTableConfig {
    name: string;
    visible: boolean;
}