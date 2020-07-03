import { Component, OnInit } from '@angular/core';
import { EntEmployee } from '../../Class/EntEmployee';
import { EntStation } from '../../Class/EntStation';
import { NominaService } from '../../services/nomina.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import { StorageService } from '../../services/storage.service';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css'],
  animations: [fadeTransition()]
})
export class EmployeeSearchComponent implements OnInit {
  employees: EntEmployee[];
  searchEmployee: string = '';
  searchEmployeeStatus: boolean;
  stations: EntStation[];

  constructor(
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private storageService: StorageService,
    private basicDataService: BasicDataService
  ) {
    this.title.setTitle('Simovil - Buscar Empleado')
  }

  ngOnInit() {
    this.getStations();
    this.GetParam();
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.searchEmployee = id;
      this.searchByParam(id);
    }
  }

  searchByParam(id) {
    this.searchEmployee = id;
    this.getEmployee();
  }

  getStations() {
    this.nominaService.GetStations().subscribe(data =>
      this.stations = data,
      error => console.log(error));
  }

  getEmployee() {
    if (this.searchEmployee != null) {
      this.router.navigate(['/employee/search/' + this.searchEmployee]);
    }
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchEmployee.trim() == '') {
      buscar = null;
    } else {
      buscar = this.searchEmployee.trim().replace(' ', "%");
    }
    let stationcode = this.storageService.getCurrentStation();
    this.nominaService.GetEmployee(buscar, this.searchEmployeeStatus, stationcode, null).subscribe(result => {
      this.employees = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clearEmployee() {
    this.employees = [];
    this.searchEmployee = '';
    this.searchEmployeeStatus = null;
  }

  deleteUser(employee: EntEmployee) {
    if (this.basicDataService.checkPermisionUrl('/employee/delete')) {
      this.utilService.confirm('Eliminará el empleado ' + employee.primerNombre + ' ' + employee.primerApellido + ' ¿Desea continuar?', result => {
        if (result) {
          this.nominaService.DeleteEmployee(employee).subscribe(result => {
            this.principal.showMsg('success', 'Éxito', 'Usuario ' + employee.numDocumento + ' eliminado correctamente.');
            this.employees = this.employees.filter(e => e.numDocumento != employee.numDocumento);
          }, error => {
            this.principal.showMsg('error', 'Error', error.error.message);
            console.log(error);
          });
        }
      });
    } else {
      this.principal.showMsg('info', 'Información', 'No tiene permiso para esta acción');
    }
  }

  editEmployee(employee: EntEmployee) {
    if (this.basicDataService.checkPermisionUrl('/employee/edit')) {
      this.router.navigate(['/employee/edit/' + employee.numDocumento]);
    } else {
      this.principal.showMsg('info', 'Información', 'No tiene permiso para esta acción');
    }
  }

  addNovelty(employee: EntEmployee) {
    if (this.basicDataService.checkPermisionUrl('/employee/novelty/add')) {
      this.router.navigate(['/employee/novelty/add/' + btoa('' + employee.numDocumento)]);
    } else {
      this.principal.showMsg('info', 'Información', 'No tiene permiso para esta acción');
    }
  }

  getStationName(station) {
    if (station && this.stations) {
      return this.stations.find(e => e.idEstacion == station).nombreEstacion;
    }
  }

}
