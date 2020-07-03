import { Component, OnInit } from '@angular/core';
import { EntTask } from '../Class/EntTask';
import { CarteraService } from '../services/cartera.service';
import { PrincipalComponent } from '../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { EntClient } from '../Class/EntClient';
import { EntQuota } from '../Class/EntQuota';
import { EntBasicClient } from '../Class/EntBasicClient';
import { fadeTransition } from '../routerAnimation';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
  animations: [fadeTransition()]
})
export class AuditComponent implements OnInit {
  tasks: EntTask[];
  cols: any[];
  client: EntClient;
  disabledControl = [];
  idQuotaEdit;
  basicClients: EntBasicClient[];

  constructor(
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title
  ) {
    title.setTitle('Auditoría - Simovil');
  }

  ngOnInit() {
    this.getTask()
    this.client = new EntClient();
    this.disabledControl[0] = true;
    this.getBasicClient();
  }


  getTask() {
    this.tasks = null;
    this.carteraService.GetTask(null, true).subscribe(tasks => {
      this.tasks = tasks;
    }, error => {
      console.log(error);
    });
    this.cols = [
      { field: 'id', header: 'Id', width: '5%' },
      { field: 'estado', header: 'Estado', width: '10%' },
      { field: 'detalle', header: 'Detalle', width: '50%' },
      { field: 'solicitante', header: 'Solicitante', width: '15%' },
      //{ field: 'observacion', header: 'Observación' }
    ];
  }

  validarCedula(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.GetClient(value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.disabledControl[0] = true;
          this.principalComponent.showMsg('warn', 'Advertencia', 'Cliente no existe');
          return;
        }
        this.client = data[0];
        this.disabledControl[0] = false;
      }, error => {
        console.log("Sin registro");
        this.disabledControl[0] = true;
      });
  }

  EditEnabled(numDocument: number) {
    let quota = new EntQuota();
    quota.codCliente = numDocument;
    quota.editable = true;
    this.carteraService.UpdateQuota(quota, 'Habilitar edición por Aditoría').subscribe(fila => {
      this.principalComponent.showMsg('success', 'Éxito', 'Edición del cupo del cliente ' + quota.codCliente + ' habilitado correctamente');
      this.idQuotaEdit = null;
      // this.clientSearchForm.reset();
      // this.clientSearchForm.disable();
      // this.editClientSearch = false;
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', 'Error al habilitar edición del cupo del Cliente ' + quota.codCliente);
    })  //por modificar
  }

  DeleteTask(task: EntTask) {
    console.log(task);
    task.estado = false;
    this.tasks = this.tasks.filter(t => t != task);
    this.carteraService.DeleteTask(task).subscribe(
      file => {
        console.log(file);
        this.principalComponent.showMsg('success', 'Éxito', 'Tarea actualizada correctamente');
      }, error => {
        this.principalComponent.showMsg('error', 'Error', 'Tarea no actualizada');
      });
  }

  getBasicClient() {
    this.carteraService.getBasicClient().subscribe(data => {
      this.basicClients = data;
      this.basicClients = this.filtrar(this.basicClients);
    }, error => console.log(error));
  }

  filtrar(array) {
    var newArray = [];
    newArray = array.filter(e =>
      e.estadoCupo == false);
    return this.eliminateDuplicates(newArray, 'codCliente');
  }

  eliminateDuplicates(arr, prop) {
    var nuevoArray = [];
    var lookup = {};
    for (var i in arr) {
      lookup[arr[i][prop]] = arr[i];
    }
    for (i in lookup) {
      nuevoArray.push(lookup[i]);
    }
    return nuevoArray;
  }

  HabilitarCupo(codCliente) {
    console.log(codCliente);
    let cupo = new EntQuota;
    cupo.codCliente = codCliente;
    cupo['block'] = true;
    cupo.estadoCupo = true;
    this.carteraService.UpdateQuota(cupo, null);
    this.basicClients = this.basicClients.filter(e => e.codCliente !== codCliente);
    this.carteraService.UpdateQuota(cupo, null).subscribe(data => {
      this.principalComponent.showMsg('success', 'Éxito', 'Cupo habilitado correctamente');
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }
}
