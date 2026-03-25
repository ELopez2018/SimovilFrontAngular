import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms'
import { EntClient } from '../../Class/EntClient';

import { CarteraService } from '../../services/cartera.service';
import { Message } from 'primeng/api';
import { PrincipalComponent } from '../../principal/principal.component';
import { EntVehicle } from '../../Class/EntVehicle';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../../routerAnimation';
import { TareaEnvioCorreo } from '../../Class/patrones/comportamiento/comando/tarea-envio-correo';

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.css'],
    animations: [fadeTransition()],
    standalone: false
})
export class VehicleComponent implements OnInit {
  collapsed = [true, true, true];
  msgs: Message[] = [];
  vehicleForm: UntypedFormGroup;
  vehicle: EntVehicle;
  client: EntClient;
  vehicles: EntVehicle[];
  fuelTypes: any[];
  selectedFuelType = null;
  enviaNombre;
  enviaCantidad;
  mensajes: string[]=[];

  constructor(
    private fb: UntypedFormBuilder,
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title
  ) {
    title.setTitle('Vehículos - Simovil');
  }

  ngOnInit() {
    this.buildForm();
    this.getVehicles();
    this.fuelTypes = [
      { id: 0, text: 'Gasolina' },
      { id: 1, text: 'Diesel' }
    ];
  }

  validarCedula(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.GetClient(value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.principalComponent.showMsg('warn', 'Advertencia', 'Cliente no encontrado');
          return;
        }
        this.client = new EntClient();
        this.client = data[0];
        this.vehicleForm.controls['identificacion'].setValue(this.client.codCliente);
        this.vehicleForm.controls['nombre'].setValue(this.client.nombre);
      }, error => console.log("Sin registro"));
  }


  validarPlaca(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.GetVehicle(null, value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          return;
        }
        this.principalComponent.showMsg('warn', 'Advertencia', 'La placa ya existe');
      }, error => console.log("Error al validar la placa."));
  }

  buildForm() {
    this.vehicleForm = this.fb.group({
      identificacion: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      placa: ['', Validators.compose([Validators.required])],
      marca: ['', Validators.compose([Validators.required])],
      modelo: ['', Validators.compose([Validators.required])],
      anio: ['', Validators.compose([Validators.required])],
      fuelType: ['', Validators.required],
      estado: ['']
    });
    this.vehicleForm.enable();
    this.vehicleForm.controls['identificacion'].disable();
    this.vehicleForm.controls['nombre'].disable();
  }

  submit() {
    this.vehicle = new EntVehicle();
    this.vehicle.codCliente = Number(this.vehicleForm.get('identificacion').value);
    this.vehicle.placa = String(this.vehicleForm.get('placa').value).trim().toUpperCase();
    this.vehicle.marca = String(this.vehicleForm.get('marca').value).trim().toUpperCase();
    this.vehicle.modelo = String(this.vehicleForm.get('modelo').value).trim().toUpperCase();
    this.vehicle.ano = Number(this.vehicleForm.get('anio').value);
    this.vehicle.combustible = Number(this.selectedFuelType.id);
    this.vehicle.estado = Boolean(this.vehicleForm.get('estado').value);

    console.log(this.vehicle);
    this.InsertVehicle(this.vehicle);
  }

  InsertVehicle(vehicle: EntVehicle) {
    this.carteraService.InsertVehicle(vehicle).subscribe(data => {
      console.log(data);
      this.vehicleForm.reset();
      this.principalComponent.showMsg('success', 'Éxito', 'Vehículo con placa: ' + vehicle.placa + ' registrado correctamente');
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  getVehicles() {
    this.vehicles = null;
    this.carteraService.GetVehicle(null, null).subscribe(vehicle => {
      this.vehicles = vehicle;
      if (this.vehicles.length > 0)
        this.collapsed[2] = false;
      else
        this.collapsed[2] = true;
    }, error => {
      console.log(error);
    });
  }

    prueba(nombre, cantidad){

       /*  let abcStock = new Stock(nombre, cantidad);//crear una clase de solicitud
        //let buyStockOrder = new BuyStock(abcStock);
        let sellStockOrder = new SellStock(abcStock);//encapsula la solicitud en un objeto
        let broker = new Broker();//llama al objeto de comando
        broker.addTarea(sellStockOrder); */
        //broker.placeOrders();
        //let st = new Broker();
        /* let gt = new GestorTareas();
        let p = new Stock(nombre, cantidad); */

        /* broker.verListadoDeOrdenes(); */
    }

    deshacerOrden(){
        /* let broker = new Broker();
        broker.deshacerOrden();
        broker.listOrders(); */
    }

    add(mensaje: string){
        this.mensajes.push(mensaje);
        this.verMensajes();
    }

    quitarMensaje(){
        this.mensajes.pop();
        this.verMensajes();
    }

    verMensajes(){
        console.log(this.mensajes);
    }
}
