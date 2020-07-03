import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { EntEmployeeBiometric } from '../../Class/EntEmployeeBiometric';
import { EntEmployee } from '../../Class/EntEmployee';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntStation } from '../../Class/EntStation';
import { EducationLevel } from '../../Class/EntEducationLevel';
import { EntRelationship } from '../../Class/EntRelationship';
import { NominaService } from '../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../principal/principal.component';
import { EntPosition } from '../../Class/EntPosition';
import { BasicDataService } from '../../services/basic-data.service';
import { EntAdministrator } from '../../Class/EntAdministrator';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
  animations: [fadeTransition()]
})
export class EmployeeAddComponent implements OnInit {

  empleadoBiometric: EntEmployeeBiometric;
  empleado: EntEmployee;
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
  epsAdmin: EntAdministrator[];
  afpAdmin: EntAdministrator[];
  sending = false;

  constructor(
    private nominaService: NominaService,
    private fb: FormBuilder,
    title: Title,
    private principalComponent: PrincipalComponent,
    private basicDataService: BasicDataService
  ) {
    title.setTitle('Empleados - Simovil');
    this.buildForm();
  }

  ngOnInit() {
    this.getDataBasic();
    this.empleado = new EntEmployee();
    this.empleadoBiometric = new EntEmployeeBiometric();
    this.empleadoBiometric.EnrollNumber = 0;
    this.fechaIni = new Date(Date.now());
    this.iniStringDate = this.fechaIni.toISOString().split('T')[0];
  }

  getDataBasic() {
    this.nominaService.GetAdminsitrator().subscribe(result => {
      this.epsAdmin = result.filter(e => e.tipoAdministradora == 1);
      this.afpAdmin = result.filter(e => e.tipoAdministradora == 2);
    }, error => console.log(error));
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
        });
    }
  }

  getStations(): void {
    this.nominaService.GetStations()
      .subscribe(estaciones => this.estaciones = estaciones);
  }

  getEducationLevel(): void {
    this.nominaService.GetEducationLevel()
      .subscribe(educationlevel => this.educationlevels = educationlevel);
  }

  getRelationship(): void {
    this.nominaService.GetRelationship()
      .subscribe(relationships => this.relationships = relationships);
  }

  getPosition(): void {
    this.nominaService.GetPosition()
      .subscribe(positions => this.positions = positions);
  }


  buildForm() {
    this.employeeForm = this.fb.group({
      numDocumento: ['', Validators.compose([Validators.required])],
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: [''],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: [''],
      direccion: ['', Validators.compose([Validators.required])],
      barrio: ['', Validators.compose([Validators.required])],
      telefono: ['', Validators.compose([Validators.required])],
      fNacimiento: [''],
      educacion: ['', Validators.required],
      nombreContacto: ['', Validators.compose([Validators.required])],
      telefonoContacto: ['', Validators.compose([Validators.required])],
      parentesco: ['', Validators.required],
      fIngreso: [''],
      estacion: ['', Validators.required],
      cargo: ['', Validators.required],
      cuentaBancaria: [''],
      eps: ['', Validators.required],
      afp: ['']
    });
  }

  submit() {
    let  pass = String(this.employeeForm.get('numDocumento').value);
    if (pass.length < 4 || pass.length > 15) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'El campo cédula debe tener minimo 4 y maximo 15 caracteres');
      return;
    }
    this.empleado.numDocumento = Number(this.employeeForm.get('numDocumento').value);
    this.empleado.primerNombre = String(this.employeeForm.get('primerNombre').value).trim().toUpperCase();
    this.empleado.segundoNombre = String(this.employeeForm.get('segundoNombre').value).trim().toUpperCase();
    this.empleado.primerApellido = String(this.employeeForm.get('primerApellido').value).trim().toUpperCase();
    this.empleado.segundoApellido = String(this.employeeForm.get('segundoApellido').value).trim().toUpperCase();
    this.empleado.direccion = String(this.employeeForm.get('direccion').value).trim().toUpperCase();
    this.empleado.barrio = String(this.employeeForm.get('barrio').value).trim().toUpperCase();
    this.empleado.telefono = String(this.employeeForm.get('telefono').value).trim().toUpperCase();
    this.empleado.fechaNacimiento = this.nacStringDate;
    this.empleado.nivelEducativo = +this.selectedEducationLevel.idNivelEdu;
    this.empleado.contatoNombre = String(this.employeeForm.get('nombreContacto').value).trim().toUpperCase();
    this.empleado.contactoTelefono = String(this.employeeForm.get('telefonoContacto').value).trim().toUpperCase();
    this.empleado.contactoParentesco = +this.selectedRelationship.idParentesco;
    this.empleado.fechaIngreso = this.iniStringDate;
    this.empleado.fechaEgreso = '';
    this.empleado.estado = true;
    this.empleado.estacion = +this.selectedStation.idEstacion;
    this.empleado.cargo = +this.selectedPosition["idCargo"];
    this.empleado.cuentaBancaria = String(this.employeeForm.get('cuentaBancaria').value).trim().toUpperCase();
    this.empleado.eps = this.employeeForm.get('eps').value ? this.employeeForm.get('eps').value.idAdministradora : null;
    this.empleado.afp = this.employeeForm.get('afp').value ? this.employeeForm.get('afp').value.idAdministradora : null;

    this.empleadoBiometric.Password = pass.substring(pass.length - 4, pass.length);
    console.log(this.empleado);
    this.InsertEmployee(this.empleado);
  }

  InsertEmployee(empleado: EntEmployee): void {
    this.sending = true;
    this.nominaService.InsertEmployee(empleado)
      .subscribe(data => {
        if (data["EnrollNumber"] != null) {
          this.empleadoBiometric.EnrollNumber = +data.EnrollNumber;
          this.employeeForm.reset();
          this.principalComponent.showMsg('success', 'Éxito', 'Empleado ingresado correctamente.')
        } else
          this.principalComponent.showMsg('warn', 'Error', 'Error al guardar el empleado.');
      }, error => {
        this.principalComponent.showMsg('warn', 'Error', error.error.message);
        console.log(error);
      }, () => this.sending = false);
  }

  validarCedula(value: string) {
    if (value.length == 0)
      return;
    this.nominaService.GetEmployeeBiometric(value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.empleadoBiometric.EnrollNumber = 0;
          return;
        }
        this.empleadoBiometric = data[0];
        this.principalComponent.showMsg('warn', 'Info Message', 'Empleado ya registrado con EnrollNumber : ' + this.empleadoBiometric.EnrollNumber);
      }, error => console.log("Sin registro"));
  }

  reset() {
    this.empleadoBiometric.EnrollNumber = 0;
  }

  getDate(value, fecha) {
    if (fecha == 'ini') {
      this.iniStringDate = value;
    } else {
      this.nacStringDate = value;
    }
  }

}
