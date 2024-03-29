import { EntNoveltyInvoice } from './EntNoveltyInvoice';
import { EntArticleType } from './EntArticleType';
import { EntPago_Pro } from './EntPago_Pro';

export class EntInvoice {
  id: number;
  numero: number;
  proveedor: number;
  subtotal: number;
  descuento: number;
  iva: number;
  retencion: number;
  anticipo: number;
  pagoPlanilla: number;
  valor: number;
  saldo: number;
  estado: number;
  perfil: string;
  rol: number;
  estacion: number;
  fecha: string;
  fechaRec: string;
  fechaVen: string;
  fechaReg: string;
  fechaPag: string;
  detalle: string;
  novedadFactura?: EntNoveltyInvoice[];
  rutaPago: string;
  egreso: number;
  historial: string;
  recibido?: string;
  cargado?: number;
  guia?: string;
  planta: number;
  articulos?: EntArticleType[];
  nombre?: string;
  pagaEstacion: boolean;
  pagos?: EntPago_Pro[];
}
