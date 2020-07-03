import { Component, OnInit } from '@angular/core';
import { EntReturn } from '../../Class/EntReturn';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CarteraService } from '../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../services/storage.service';
import { UtilService } from '../../services/util.service';
import { PrincipalComponent } from '../../principal/principal.component';

@Component({
  selector: 'app-returned',
  templateUrl: './returned.component.html',
  styleUrls: ['./returned.component.css']
})
export class ReturnedComponent implements OnInit {
  calitrations: EntReturn[];
  returnForm: FormGroup;
  stationCode: number;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Agregar Devolución - Simovil');
    this.stationCode = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    this.buildForm();
  }

  basicdata() {
    if (this.stationCode == null) {
      this.returnForm.disable();
      this.principalComponent.showMsg('error', 'Error', 'No es un usuario estación')
    }
    else {
      this.utilService.loader(true);
      this.carteraService.GetTank(this.stationCode).subscribe(res => {
        this.list.controls = [];
        res.map(e => {
          this.list.push(
            this.fb.group({
              ID: e.ID,
              DESCRIPCION: e.DESCRIPCION,
              CANTIDAD: [null, [Validators.required, Validators.min(0)]]
            }));
        });
        this.utilService.loader(false);
      }, error => {
        console.log(error);
        this.utilService.loader(false);
      });
    }
  }

  buildForm() {
    this.returnForm = this.fb.group({
      date: [null, Validators.required],
      station: [this.stationCode, Validators.required],
      list: this.fb.array([]),
      detail: [null, Validators.required]
    });
    this.basicdata();
  }

  get list() {
    return this.returnForm.get('list') as FormArray;
  }

  reset() {
    this.returnForm.reset();
  }

  submiterForm() {
    let form = this.returnForm.getRawValue();
    if (this.stationCode == null) {
      this.principalComponent.showMsg('error', 'Error', 'No es un usuario de estación.')
    } else {
      this.utilService.loader();
      this.carteraService.InsertReturn(form).subscribe(res => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('success', 'Éxito', 'Devolución creada correctamente.');
        this.returnForm.reset();
        this.list.controls = [];
        this.basicdata();
      }, error => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('error', 'Error', error.error.message)
        console.log(error);
      });
    }
  }
}
