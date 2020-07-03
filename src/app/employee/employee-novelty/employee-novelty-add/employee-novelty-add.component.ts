import { Component, OnInit } from '@angular/core';
import { BasicDataService } from '../../../services/basic-data.service';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { EntEmployee } from '../../../Class/EntEmployee';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { fadeTransition } from '../../../routerAnimation';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { EntEmployeeNoveltyType } from '../../../Class/EntEmployeeNoveltyType';
import { UtilService } from '../../../services/util.service';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { EntEmployeeNovelty } from '../../../Class/EntEmployeeNovelty';

@Component({
  selector: 'app-employee-novelty-add',
  templateUrl: './employee-novelty-add.component.html',
  styleUrls: ['./employee-novelty-add.component.css'],
  animations: [fadeTransition()]
})
export class EmployeeNoveltyAddComponent implements OnInit {

  empleado = new EntEmployee();
  employeeForm: FormGroup;
  estaciones: EntStation[];
  administrators: EntAdministrator[];
  employeeNoveltyTypes: EntEmployeeNoveltyType[];
  fechaIni: Date;
  param;
  codStation;
  boolNovelty = false;
  user;

  constructor(
    private basicDataService: BasicDataService,
    private fb: FormBuilder,
    private nominaService: NominaService,
    private utilService: UtilService,
    private principalComponent: PrincipalComponent,
    private route: ActivatedRoute,
    private title: Title,
    private location: Location,
    private storageService: StorageService
  ) {
    this.title.setTitle('Agregar novedad - Simovil');
    this.buildForm();
    this.codStation = this.storageService.getCurrentStation();
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.getDataBasic();
  }

  getDataBasic() {
    this.nominaService.GetEmployeeNoveltyType().subscribe(result => {
      this.employeeNoveltyTypes = result;
      // this.employeeNoveltyTypes = [{ idTipoNovedad: 1, detalleTipoNovedad: "Incapacidad" }]
    }, error => console.log(error));
    this.estaciones = this.basicDataService.getStations();
    if (this.estaciones == null) {
      this.basicDataService.getBasicDataObsservable()
        .subscribe(([res1]) => {
          this.estaciones = res1;
          this.GetParam();
        });
    } else
      this.GetParam();
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.empleado.numDocumento = +atob(id);
      this.searchByParam(atob(id));
    }
  }

  searchByParam(id) {
    this.param = id;
    this.empleado.numDocumento = id;
    this.validarCedula('' + id);
  }

  assingEmployee(employee: EntEmployee) {
    let nombre = (employee.primerNombre + ' ' + (employee.segundoNombre || '') + ' ' + employee.primerApellido + ' ' + (employee.segundoApellido || '')).replace('  ', ' ');
    this.boolNovelty = true;
    this.employeeForm.get('numDocumento').setValue(employee.numDocumento);
    this.employeeForm.get('nombre').setValue(nombre);
    this.employeeForm.get('estacion').setValue(this.estaciones.find(e => e.idEstacion == employee.estacion));
    if (this.employeeNoveltyTypes && this.employeeNoveltyTypes.length == 1)
      this.employeeForm.get('tipoNovedad').setValue(this.employeeNoveltyTypes[0]);
    this.employeeForm.get('tipoNovedad').enable();

  }

  buildForm() {
    this.employeeForm = this.fb.group({
      numDocumento: ['', [Validators.required, Validators.minLength(4)]],
      nombre: ['', Validators.required],
      estacion: ['', Validators.required],
      tipoNovedad: ['', Validators.required]
    });
    this.employeeForm.disable();
    this.employeeForm.get('numDocumento').enable();
  }

  SelectedNoveltyType() {
    return this.employeeForm.get('tipoNovedad').value;
  }

  validarCedula(value: string) {
    if (value.length == 0)
      return;
    this.utilService.loader(true);
    this.nominaService.GetEmployee(value, null, this.codStation, true)
      .subscribe(data => {
        this.utilService.loader(false);
        if (typeof (data[0]) === "undefined") {
          this.principalComponent.showMsg('error', 'Error', 'Empleado no encontrado.');
        } else {
          this.assingEmployee(data[0]);
          this.getEmployeeAdminsitrator(data[0]);
          this.employeeForm.get('numDocumento').disable();
        }
      }, error => {
        console.log("Sin registro")
        this.utilService.loader(false);
      });
  }

  getEmployeeAdminsitrator(employee) {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator(null, null, employee.numDocumento).subscribe(result => {
      this.utilService.loader(false);
      result = result.filter(e => e.tipoAdministradora == 1 || e.tipoAdministradora == 4);
      if (result && result.length > 0) {
        this.administrators = result;
      } else
        this.principalComponent.showMsg('error', 'Error', 'No tiene administradoras responsables del pago')
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  reset() {
    this.employeeForm.reset();
    this.employeeForm.disable();
    this.employeeForm.get('numDocumento').enable();
    this.boolNovelty = false;
  }

  cancel() {
    this.location.back();
  }

  submitEmployeeForm() {
    this.boolNovelty = true;
    // this.validForm();
  }

  validForm() {
    if (!this.SelectedNoveltyType())
      return;
    if (this.SelectedNoveltyType().idTipoNovedad == 1)
      this.boolNovelty = true;
  }

  addNovelty(novelty: INovedad) {
    this.utilService.loader(true);
    let employeeNovelty = new EntEmployeeNovelty();
    employeeNovelty.empleado = this.employeeForm.get('numDocumento').value;
    employeeNovelty.tipo = this.SelectedNoveltyType().idTipoNovedad;
    employeeNovelty.usuario = this.user;
    employeeNovelty.dias = novelty.dias;
    employeeNovelty.fechaIni = novelty.fechaIni;
    employeeNovelty.fechaFin = novelty.fechaFin;
    employeeNovelty.horaIni = novelty.horaIni;
    employeeNovelty.horaFin = novelty.horaFin;
    employeeNovelty.horas = novelty.horas;
    employeeNovelty.detalle = novelty.detalle;
    this.nominaService.InsertNovelty(employeeNovelty, novelty).subscribe(result => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Novedad #' + (result.idnovedad || '_') + ' insertada correctamente');
      if (this.param != null)
        this.cancel();
      this.reset();
    }, error => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
      console.log(error);
    });
  }
}

interface INovedad {
  fechaIni: string;
  fechaFin: string;
  horaIni: string;
  horaFin: string;
  horas: number;
  motivo: string;
  dias: number;
  diasReal: number;
  administradora: number;
  detalle: string;
}
