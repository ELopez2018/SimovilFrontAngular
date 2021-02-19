import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CarteraService } from '../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../principal/principal.component';
import { UtilService } from '../../services/util.service';
import { EntCalibration } from '../../Class/EntCalibration';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-station-admin-calibration',
  templateUrl: './station-admin-calibration.component.html',
  styleUrls: ['./station-admin-calibration.component.css'],
  animations: [fadeTransition()]
})
export class StationAdminCalibrationComponent implements OnInit {
  calitrations: EntCalibration[];
  calibrationForm: FormGroup;
  stationCode: number;
  ocultarInput: boolean;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Agregar Calibración - Simovil');
    this.stationCode = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    this.buildForm();
  }

  basicdata() {
    if (this.stationCode == null) {
      this.calibrationForm.disable();
      this.principalComponent.showMsg('error', 'Error', 'No es un usuario estación')
    }
    else {
      this.utilService.loader(true);
      this.carteraService.getArticleTypes2(this.stationCode, 'L').subscribe(res => {
        this.list.controls = [];
        res.map(e => {

            console.log(res);

              if(e.DESCRIPCION == 'OTROS'){
            this.list.push(
            this.fb.group({

              ID: e.ID,
              DESCRIPCION: e.DESCRIPCION,
              CANTIDAD: [{value: e.DESCRIPCION, disabled: true}, [Validators.required, Validators.min(0)]]
            }));
            //this.ocultarInput = true;
        }
        if(e.DESCRIPCION != 'OTROS'){
            this.list.push(
            this.fb.group({

              ID: e.ID,
              DESCRIPCION: e.DESCRIPCION,
              CANTIDAD: [null, [Validators.required, Validators.min(0)]]
            }));
            //this.ocultarInput = false;
        }
        });
        this.utilService.loader(false);
      }, error => {
        console.log(error);
        this.utilService.loader(false);
      });
    }
  }


  buildForm() {
    this.calibrationForm = this.fb.group({
      date: [null, Validators.required],
      station: [this.stationCode, Validators.required],
      list: this.fb.array([])
    });
    this.basicdata();
  }

  get list() {
    return this.calibrationForm.get('list') as FormArray;
  }

  reset() {
    this.calibrationForm.reset();
  }

  submiterForm() {
    let form = this.calibrationForm.getRawValue();
    if (this.stationCode == null) {
      this.principalComponent.showMsg('error', 'Error', 'No es un usuario de estación.')
    } else {
      this.utilService.loader();
      this.carteraService.InsertCalibration(form).subscribe(res => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('success', 'Éxito', 'Calibración creada correctamente.');
        this.calibrationForm.reset();
        this.list.controls = [];
      }, error => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('error', 'Error', error.error.message)
        console.log(error);
      });
    }
  }
}
