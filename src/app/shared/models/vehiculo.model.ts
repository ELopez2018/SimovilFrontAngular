export interface VehiculoModel {
  descripcion: string;
  modelo: string;
  placa: string;
  tipo: string;
  nroSerie: string;
  nroMotor: string;
  nroChasis: string;
  cc: string;
  pasajeros: number;
  peso: number;
  fechaExpedicion: Date;
  fecheVigencia: Date;
}
