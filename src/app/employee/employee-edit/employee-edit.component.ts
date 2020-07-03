import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { EntEmployee } from '../../Class/EntEmployee';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntStation } from '../../Class/EntStation';
import { EducationLevel } from '../../Class/EntEducationLevel';
import { EntRelationship } from '../../Class/EntRelationship';
import { EntPosition } from '../../Class/EntPosition';
import { NominaService } from '../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../principal/principal.component';
import { EntEmployeeBiometric } from '../../Class/EntEmployeeBiometric';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BasicDataService } from '../../services/basic-data.service';
import { UtilService } from '../../services/util.service';
import { EntAdministrator } from '../../Class/EntAdministrator';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  animations: [fadeTransition()]
})

export class EmployeeEditComponent implements OnInit {

  empleadoBiometric = new EntEmployeeBiometric();
  empleado = new EntEmployee();
  employeeForm: FormGroup;
  estaciones: EntStation[];
  educationlevels: EducationLevel[];
  relationships: EntRelationship[];
  positions: EntPosition[];
  selectedStation: EntStation;
  selectedEducationLevel: EducationLevel;
  selectedRelationship: EntRelationship;
  selectedPosition: EntPosition;
  fechaIni: Date;
  iniStringDate: string;
  nacStringDate: string;
  param;
  epsAdmin: EntAdministrator[];
  afpAdmin: EntAdministrator[];
  sending = false;

  constructor(
    private nominaService: NominaService,
    private fb: FormBuilder,
    private title: Title,
    private principalComponent: PrincipalComponent,
    private location: Location,
    private route: ActivatedRoute,
    private basicDataService: BasicDataService,
    private utilService: UtilService
  ) {
    this.title.setTitle('Editar Empleado - Simovil');
    this.buildForm();
  }

  ngOnInit() {
    this.getDataBasic();
    this.empleadoBiometric.EnrollNumber = 0;
  }

  getDataBasic() {
    this.nominaService.GetAdminsitrator().subscribe(result => {
      this.epsAdmin = result.filter(e => e.tipoAdministradora == 1);
      this.afpAdmin = result.filter(e => e.tipoAdministradora == 2);
      this.positions = this.basicDataService.getPositions();
      this.estaciones = this.basicDataService.getStations();
      this.relationships = this.basicDataService.getRelationships();
      this.educationlevels = this.basicDataService.getEducationLevels();
      if (this.positions == null) {
        this.basicDataService.getBasicDataObsservable()
          .subscribe(([res1, res2, res3, res4]) => {
            this.estaciones = res1;
            this.educationlevels = res2;
            this.positions = res3;
            this.relationships = res4;
            this.GetParam();
          });
      } else
        this.GetParam();
    }, error => console.log(error));
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.empleado.numDocumento = +id;
      this.searchByParam(id);
      this.param = id;
    }
  }

  searchByParam(id) {
    this.empleado.numDocumento = id;
    this.getEmployee();
  }

  getEmployee() {
    this.nominaService.GetEmployee(this.empleado.numDocumento, null, null, true).subscribe(data => {
      this.assingEmployee(data[0]);
    }, error => console.log(error));
  }

  buildForm() {
    this.employeeForm = this.fb.group({
      numDocumento: ['', [Validators.required, Validators.minLength(4)]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      direccion: ['', Validators.required],
      barrio: ['', Validators.required],
      telefono: ['', Validators.required],
      fNacimiento: ['', Validators.required],
      educacion: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      parentesco: ['', Validators.required],
      fIngreso: ['', Validators.required],
      fEgreso: [''],
      estacion: ['', Validators.required],
      cargo: ['', Validators.required],
      cuentaBancaria: [''],
      estado: [''],
      eps: ['', Validators.required],
      afp: ['']
    });
  }

  assingEmployee(employee: EntEmployee) {
    this.employeeForm.get('numDocumento').setValue(employee.numDocumento);
    this.employeeForm.get('primerNombre').setValue(employee.primerNombre);
    this.employeeForm.get('segundoNombre').setValue(employee.segundoNombre);
    this.employeeForm.get('primerApellido').setValue(employee.primerApellido);
    this.employeeForm.get('segundoApellido').setValue(employee.segundoApellido);
    this.employeeForm.get('direccion').setValue(employee.direccion);
    this.employeeForm.get('barrio').setValue(employee.barrio);
    this.employeeForm.get('telefono').setValue(employee.telefono);
    this.employeeForm.get('fNacimiento').setValue(this.setDate(employee.fechaNacimiento));
    this.employeeForm.get('educacion').setValue(this.educationlevels.find(e => e.idNivelEdu == employee.nivelEducativo));
    this.employeeForm.get('nombreContacto').setValue(employee.contatoNombre);
    this.employeeForm.get('telefonoContacto').setValue(employee.contactoTelefono);
    this.employeeForm.get('parentesco').setValue(this.relationships.find(e => e.idParentesco == employee.contactoParentesco));
    this.employeeForm.get('fIngreso').setValue(this.setDate(employee.fechaIngreso));
    this.employeeForm.get('fEgreso').setValue(this.setDate(employee.fechaEgreso));
    this.employeeForm.get('estacion').setValue(this.estaciones.find(e => e.idEstacion == employee.estacion));
    this.employeeForm.get('cargo').setValue(this.positions.find(e => e.idCargo == employee.cargo));
    this.employeeForm.get('cuentaBancaria').setValue(employee.cuentaBancaria);
    this.employeeForm.get('estado').setValue(employee.estado);
    this.employeeForm.get('eps').setValue(this.epsAdmin.find(e => e.idAdministradora == employee.eps));
    this.employeeForm.get('afp').setValue(this.afpAdmin.find(e => e.idAdministradora == employee.afp));
    this.employeeForm.get('numDocumento').disable();
  }

  submit() {
    this.empleado.numDocumento = Number(this.employeeForm.get('numDocumento').value);
    this.empleado.primerNombre = String(this.employeeForm.get('primerNombre').value).trim().toUpperCase();
    this.empleado.segundoNombre = this.employeeForm.get('segundoNombre').value == null ? null : String(this.employeeForm.get('segundoNombre').value).trim().toUpperCase();
    this.empleado.primerApellido = String(this.employeeForm.get('primerApellido').value).trim().toUpperCase();
    this.empleado.segundoApellido = this.employeeForm.get('segundoApellido').value == null ? null : String(this.employeeForm.get('segundoApellido').value).trim().toUpperCase();
    this.empleado.direccion = String(this.employeeForm.get('direccion').value).trim().toUpperCase();
    this.empleado.barrio = this.employeeForm.get('barrio').value == null ? null : String(this.employeeForm.get('barrio').value).trim().toUpperCase();
    this.empleado.telefono = this.employeeForm.get('telefono').value == null ? null : String(this.employeeForm.get('telefono').value).trim().toUpperCase();
    this.empleado.fechaNacimiento = String(this.employeeForm.get('fNacimiento').value);
    this.empleado.nivelEducativo = this.employeeForm.get('educacion').value == null ? null : this.employeeForm.get('educacion').value.idNivelEdu;
    this.empleado.contatoNombre = String(this.employeeForm.get('nombreContacto').value).trim().toUpperCase();
    this.empleado.contactoTelefono = String(this.employeeForm.get('telefonoContacto').value).trim().toUpperCase();
    this.empleado.contactoParentesco = this.employeeForm.get('parentesco').value.idParentesco;
    this.empleado.fechaIngreso = this.employeeForm.get('fIngreso').value;
    this.empleado.fechaEgreso = this.employeeForm.get('fEgreso').value;
    this.empleado.estado = Boolean(this.employeeForm.get('estado').value);
    this.empleado.estacion = +this.employeeForm.get('estacion').value.idEstacion;
    this.empleado.cargo = +this.employeeForm.get('cargo').value.idCargo;
    this.empleado.cuentaBancaria = this.employeeForm.get('cuentaBancaria').value;
    this.empleado.eps = this.employeeForm.get('eps').value ? this.employeeForm.get('eps').value.idAdministradora : null;
    this.empleado.afp = this.employeeForm.get('afp').value ? this.employeeForm.get('afp').value.idAdministradora : null;

    console.log(this.empleado);
    this.updateEmployee(this.empleado);
  }

  updateEmployee(empleado: EntEmployee): void {
    this.sending = true;
    this.utilService.loader(true);
    this.nominaService.UpdateEmployee(empleado)
      .subscribe(data => {
        this.principalComponent.showMsg('success', 'Éxito', 'Empleado actualizado correctamente.')
        this.utilService.loader(false);
        if (this.param != null)
          this.cancel();
        this.employeeForm.reset();
        this.employeeForm.get('numDocumento').enable();
      }, error => {
        this.principalComponent.showMsg('warn', 'Error', error.error.message);
        this.utilService.loader(false);
        console.log(error);
      }, () => this.sending = false);
  }

  validarCedula(value: string) {
    if (value.length == 0)
      return;
    this.nominaService.GetEmployee(value, null, null, true)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.empleadoBiometric.EnrollNumber = 0;
          this.principalComponent.showMsg('error', 'Error', 'Empleado no encontrado.');
        } else {
          this.assingEmployee(data[0]);
          this.employeeForm.get('numDocumento').disable();
        }
      }, error => console.log("Sin registro"));
  }

  reset() {
    if (this.param == null) {
      this.employeeForm.reset();
      this.empleadoBiometric.EnrollNumber = 0;
      this.employeeForm.get('numDocumento').enable();
    } else
      this.searchByParam(this.param);
  }

  cancel() {
    this.location.back();
  }

  setDate(fecha) {
    if (fecha == null)
      return null
    return fecha.split("T")[0];
  }

}
