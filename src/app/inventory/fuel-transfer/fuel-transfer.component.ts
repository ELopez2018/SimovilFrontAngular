import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { UtilService } from '../../services/util.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { dateToISOString, focusById } from '../../util/util-lib';
import { EntFuelUnload } from '../../Class/EntFuelUnload';
import { EntStation } from '../../Class/EntStation';
import { NominaService } from '../../services/nomina.service';
import { EntFuelTransfer } from '../../Class/EntFuelTransfer';

@Component({
  selector: 'app-fuel-transfer',
  templateUrl: './fuel-transfer.component.html',
  styleUrls: ['./fuel-transfer.component.css'],
  animations: [fadeTransition()]
})
export class FuelTransferComponent implements OnInit {

  stationCod: number;
  pending: EntFuelUnload[];
  fuelUnloadItem: EntFuelUnload;
  showModal = false;
  formFuel: FormGroup;
  stations: EntStation[];

  constructor(
    private carteraService: CarteraService,
    private storageService: StorageService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private nominaService: NominaService,
    private fb: FormBuilder
  ) {
    this.stationCod = this.storageService.getCurrentStation();
    this.nominaService.GetStations().subscribe(res => {
      let stationcurrent = res.find(e => e.idEstacion == this.stationCod);
      this.stations = res.filter(e => e.ciudadEstacion == stationcurrent.ciudadEstacion && e.idEstacion != 90 && e.idEstacion != this.stationCod);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
    });
  }

  ngOnInit() {
    this.getFuelUnloadPending();
    this.build();
  }

  build() {
    this.formFuel = this.fb.group({
      ID_INVENTARIO: [null, [Validators.required]],
      NOMBRE: [{ value: null, disabled: true }, [Validators.required]],
      NUMERO: [{ value: null, disabled: true }, [Validators.required]],
      FECHA2: [{ value: null, disabled: true }, [Validators.required]],
      TIPO_ARTICULO: [{ value: null, disabled: true }, [Validators.required]],
      DESCRIPCION: [{ value: null, disabled: true }, [Validators.required]],
      CANTIDAD: [{ value: null, disabled: true }, [Validators.required]],
      PENDIENTE2: [{ value: null, disabled: true }, [Validators.required]],
      FECHA: [null, [Validators.required]],
      ESTACION: [null, [Validators.required]],
      DETALLE: [null, [Validators.required]],
      PENDIENTE: [null, [Validators.required, Validators.min(0.01)]]
    });
  }
  getFuelUnloadPending() {
    this.utilService.loader();
    this.carteraService.GetFuelUnloadPending(this.stationCod).subscribe(res => {
      this.utilService.loader(false);
      this.pending = res;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  selitem(item: EntFuelTransfer) {
    this.formFuel.setValue({
      ID_INVENTARIO: item.ID_INVENTARIO,
      NOMBRE: item.NOMBRE,
      NUMERO: item.NUMERO,
      FECHA2: dateToISOString(item.FECHA),
      FECHA: dateToISOString(item.FECHA),
      TIPO_ARTICULO: item.TIPO_ARTICULO,
      DESCRIPCION: item.DESCRIPCION,
      CANTIDAD: item.CANTIDAD,
      PENDIENTE: item.PENDIENTE,
      PENDIENTE2: item.PENDIENTE,
      DETALLE: null,
      ESTACION: null
    });
    this.showModal = true;
    setTimeout(() => {
      focusById('cant');
    }, 10);
  }

  saveFuelTransfer() {
    let val = new EntFuelTransfer();
    let rawVal = this.formFuel.getRawValue() as EntFuelTransfer;
    val.ID_INVENTARIO = rawVal.ID_INVENTARIO;
    val.FECHA = rawVal.FECHA;
    val.CANTIDAD = rawVal.PENDIENTE;
    val.DETALLE = rawVal.DETALLE;
    val.ESTACION = (rawVal.ESTACION as any as EntStation).idEstacion;
    val.USUARIO = this.storageService.getCurrentUserDecode().Usuario;
    console.log(val);
    this.utilService.loader();
    this.carteraService.InsertFuelTranfer(val).subscribe(res => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'Proceso terminado correctamente.');
      this.clearInsert();
      this.getFuelUnloadPending();
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  clearInsert() {
    this.showModal = false;
    this.formFuel.reset();
  }
}
