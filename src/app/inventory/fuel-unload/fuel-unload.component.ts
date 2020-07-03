import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { EntFuelUnload } from '../../Class/EntFuelUnload';
import { UtilService } from '../../services/util.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateToISOString, focusById } from '../../util/util-lib';
import { EntFuelTransfer } from '../../Class/EntFuelTransfer';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fuel-unload',
  templateUrl: './fuel-unload.component.html',
  styleUrls: ['./fuel-unload.component.css'],
  animations: [fadeTransition()]
})
export class FuelUnloadComponent implements OnInit {

  stationCod: number;
  pending: EntFuelUnload[];
  pendingTrans: EntFuelTransfer[];
  fuelUnloadItem: EntFuelUnload;
  fuelTransferedUnloadItem: EntFuelTransfer;
  showModal = false;
  formFuel: FormGroup;
  transfered: boolean = null;

  constructor(
    private carteraService: CarteraService,
    private storageService: StorageService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private fb: FormBuilder
  ) {
    this.stationCod = this.storageService.getCurrentStation();
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
      PENDIENTE: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  getFuelUnloadPending() {
    this.utilService.loader();
    forkJoin(this.carteraService.GetFuelUnloadPending(this.stationCod),
      this.carteraService.GetFuelTransferedUnloadPending(this.stationCod)
    ).subscribe(([res1, res2]) => {
      this.utilService.loader(false);
      this.pending = res1;
      this.pendingTrans = res2;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  selitem(item: EntFuelUnload, transfered: boolean) {
    this.transfered = transfered;
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
      PENDIENTE2: item.PENDIENTE
    });
    this.showModal = true;
    setTimeout(() => {
      focusById('cant');
    }, 10);
  }

  saveFuelUnload() {
    let val = new EntFuelUnload();
    let rawVal = this.formFuel.getRawValue() as EntFuelUnload;
    val.ID_INVENTARIO = rawVal.ID_INVENTARIO;
    val.FECHA = rawVal.FECHA;
    val.CANTIDAD = rawVal.PENDIENTE;
    this.utilService.loader();
    this.carteraService.InsertFuelUnload(val, this.transfered).subscribe(res => {
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
    this.transfered = null;
  }
}
