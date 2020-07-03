import { Component, OnInit } from '@angular/core';
import { EntConsumptionClient } from '../Class/EntConsumptionClient';
import { CarteraService } from '../services/cartera.service';
import { PrincipalComponent } from '../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EntVehicle } from '../Class/EntVehicle';
import { NominaService } from '../services/nomina.service';
import { EntStation } from '../Class/EntStation';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollService } from '../services/scroll.service';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { EntOrder } from '../Class/EntOrder';
import { EntOrderDetail } from '../Class/EntOrderDetail';
import { EntCity } from '../Class/EntCity';
import { EntCityStation } from '../Class/EntCityStation';
import { EntIdentifier } from '../Class/EntIdentifier';
import { EntHomeClient } from '../Class/EntHomeClient';
import { StorageService } from '../services/storage.service';
import { EntReceivable } from '../Class/EntReceivable';
import { PrintService } from '../services/print.service';
import { EntPayment } from '../Class/EntPayment';
import { fadeTransition } from '../routerAnimation';
import { UtilService } from '../services/util.service';
import { currencyNotDecimal, ObjToCSV } from '../util/util-lib';
import { formatDate } from '@angular/common';
import { PAYMENTMETHODS } from '../Class/PAYMENTMETHODS';
import { EntArticleType } from '../Class/EntArticleType';

@Component({
  selector: 'app-client-self',
  templateUrl: './client-self.component.html',
  styleUrls: ['./client-self.component.css'],
  animations: [fadeTransition()]
})
export class ClientSelfComponent implements OnInit {
  notdecimal = currencyNotDecimal();
  homeClient: EntHomeClient;
  consumos: EntConsumptionClient[];
  orderForm: FormGroup;
  tabs = [];
  tabsVehicle = [];
  tabsSearch = [];
  orderTypes: any[];
  stationTypes: any[];
  valueTypes: any[];
  controlShow: any[] = [];
  vehicles: EntVehicle[];
  vehiclesAll: EntVehicle[];
  stations: EntStation[];
  stationsNews: EntStation[] = [];
  stationsAll: EntStation[] = [];
  vehiclesNews: EntVehicle[] = [];
  items: any[] = [];
  codClient = null;
  citiesStations: EntCityStation[];
  vehicleForm: FormGroup;
  vehicleEditForm: FormGroup;
  vehicle: EntVehicle;
  identifierForm: FormGroup;
  controlShowVehicles: any[] = [];
  assignForm: FormGroup;
  vehiclesFree: EntVehicle[];
  identifiersFree: EntIdentifier[];
  vehicleFreeSel: EntVehicle;
  identifierFreeSel: EntIdentifier;
  searchConsumoFechaIni;
  searchConsumoFechaFin;
  searchPedidoFechaIni;
  searchPedidoFechaFin;
  searchPedidoEstado;
  searchPagoFechaIni;
  searchPagoFechaFin;
  searchPagoEstado;
  searchCuentaCobroFechaIni;
  searchCuentaCobroFechaFin;
  searchCuentaCobroEstado;
  searchConsumos: EntConsumptionClient[];
  searchOrders: EntOrder[];
  searchReceivables: EntReceivable[];
  searchPayments: EntPayment[];
  vehicleToEdit: EntVehicle;
  identifiers: EntIdentifier[];
  identifierToEdit: EntIdentifier;
  editControl = [];
  controlSearchOrder = [];
  arrayOrderAutoStation = null;
  hoy = null;
  articlesTypes: EntArticleType[];
  selectedArticleType : EntArticleType;

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    private fb: FormBuilder,
    private scrollService: ScrollService,
    private storageService: StorageService,
    private printService: PrintService,
    private utilService: UtilService
  ) {
    this.title.setTitle('Mi cuenta - Simovil');
  }

  ngOnInit() {
    this.homeClient = new EntHomeClient();
    this.hoy = new Date();
    this.codClient = this.storageService.getCurrentUserDecode().Usuario;
    this.getHomeClient();
    this.getConsumption();
    this.tabs = [
      { estado: true, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' }
    ]
    this.setTab(this.tabs);
    this.tabsVehicle = [
      { estado: true, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' }
    ]
    this.setTab(this.tabsVehicle);
    this.tabsSearch = [
      { estado: true, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' },
      { estado: false, classTab: '', classPane: '' }
    ]
    this.setTab(this.tabsSearch);
    this.buildForm()
    this.orderTypes = [
      { id: 0, text: 'No controlado' },
      { id: 1, text: 'Controlado' }
    ];
    this.stationTypes = [
      { id: 0, text: 'Todas' },
      { id: 1, text: 'Seleccionar estaciones' }
    ];
    this.valueTypes = [
      { id: 0, text: 'Valor global' },
      { id: 1, text: 'Valor por vehículo' }
    ];
    this.getStations();
    this.getVehiclesWithoutOrder(this.codClient);
    this.getCitiesStations();
    this.getAllVehicles();
    this.getIdentifiers();
    this.getArticleTypes();
    this.controlShow[4] = true;
    this.editControl = [false, false];
  }

  setTab(tabl) {
    tabl.forEach(element => {
      if (element.estado == true) {
        element.classTab = 'active';
        element.classPane = 'show active';
      } else {
        element.classTab = '';
        element.classPane = '';
      }
    });
  }

  buildForm() {
    this.orderForm = this.fb.group({
      orderType: ['', Validators.required],
      validity: ['', [Validators.required, Validators.min(0), Validators.max(255)]],
      value: ['', Validators.required],
      stationType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      valueType: ['', Validators.required],
      value2: ['', Validators.required],
      validity2: ['', [Validators.required, Validators.min(0), Validators.max(255)]]
    })
    this.orderForm.disable();
    this.orderForm.get('orderType').enable();

    // vehicles
    this.vehicleForm = this.fb.group({
      placa: ['', Validators.compose([Validators.required])],
      marca: ['', Validators.compose([Validators.required])],
      modelo: ['', Validators.compose([Validators.required])],
      anio: ['', [Validators.required, Validators.min(1970), Validators.max(this.hoy.getFullYear() + 1)]],
      fuelType: ['', Validators.required],
      estado: ['']
    });

    // edit vehicles 
    this.vehicleEditForm = this.fb.group({
      placa: ['', Validators.compose([Validators.required])],
      marca: ['', Validators.compose([Validators.required])],
      modelo: ['', Validators.compose([Validators.required])],
      anio: ['', [Validators.required, Validators.min(1970), Validators.max(this.hoy.getFullYear() + 1)]],
      fuelType: ['', Validators.required],
      estado: ['']
    });

    // Identifier
    this.identifierForm = this.fb.group({
      chip: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      estado: ['']
    });

    // Identifier
    this.assignForm = this.fb.group({
      placa: ['', Validators.required],
      chip: ['', Validators.required]
    });
  }

  getHomeClient() {
    this.carteraService.getHomeClient(this.codClient).subscribe(data => {
      if (this.homeClient != data[0]) {
        this.homeClient = data[0];
      }
    }, error => console.log(error));
  }

  onChangeOrderType(value) {
    if (value == null)
      return;
    if (value.id == 0) {
      this.controlShow[0] = true;
      this.controlShow[1] = false;
      this.orderForm.get('value').enable();
      this.orderForm.get('validity').enable();
      this.orderForm.get('stationType').disable();
      this.orderForm.get('valueType').disable();
      this.orderForm.get('value2').disable();
      this.orderForm.get('validity2').disable();
    }
    else {
      this.controlShow[0] = false;
      this.controlShow[1] = true;
      this.orderForm.get('value').disable();
      this.orderForm.get('validity').disable();
      this.orderForm.get('stationType').enable();
      this.orderForm.get('valueType').enable();
      this.orderForm.get('value').disable();
      this.orderForm.get('validity').disable();
    }
    setTimeout(() => {
      this.scrollService.triggerScrollTo('anclaValue');
    }, 2);
  }

  onChangeStationType(value) {
    if (value == null)
      return;
    if (value.id == 0)
      this.controlShow[2] = false;
    else
      this.controlShow[2] = true;
    setTimeout(() => {
      this.scrollService.triggerScrollTo('selValueType');
    }, 2);
  }

  onChangeValueType(value) {
    if (value == null)
      return;
    if (value.id == 0) {
      this.controlShow[3] = false;
      this.orderForm.get('value2').enable();
      this.orderForm.get('validity2').enable();
    }
    else {
      this.controlShow[3] = true;
      this.orderForm.get('value2').disable();
      this.orderForm.get('validity2').disable();
    }


    setTimeout(() => {
      this.scrollService.triggerScrollTo('valueVehicle');
    }, 2);
  }

  getConsumption() {
    var hoy = new Date();
    var ini = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0]
    var fin = hoy.toISOString().split('T')[0];
    this.carteraService.getConsumption(this.codClient, ini, fin, null, null).subscribe(data => {
      this.consumos = data;
    }, error => console.log(error));
  }

  getAllVehicles() {
    this.carteraService.GetVehicle(this.codClient, null)
      .subscribe(data => {
        this.vehiclesAll = data;
      }, error => console.log(error)
      );
  }

  getConsumptionSearch() {
    if (this.searchConsumoFechaIni > this.searchConsumoFechaFin) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'La fecha inicial debe ser mayor a la final');
      return;
    }
    // if (this.searchConsumoFechaFin == null || this.searchConsumoFechaFin == '' || this.searchConsumoFechaIni == null || this.searchConsumoFechaIni == '') {
    //   this.principalComponent.showMsg('warn', 'Advertencia', 'Fechas no son validas para continuar');
    //   return;
    // }
    this.utilService.loader(true);
    this.carteraService.getConsumption(this.codClient, this.searchConsumoFechaIni, this.searchConsumoFechaFin, null, null).subscribe(data => {
      this.searchConsumos = data;
      this.utilService.loader(false);
    }, error => console.log(error));
  }

  tabClass(value: number) {
    if (this.tabs[value].estado == true)
      return;
    else {
      this.tabs.forEach(e => {
        e.estado = false;
        e.classTab = '';
        e.classPane = '';
      });
      if (this.tabs[value].estado == false) {
        this.tabs[value].estado = true;
        this.tabs[value].classTab = 'active';
        this.tabs[value].classPane = 'show active'
      }
    }
    switch (value) {
      case 0:
        this.getHomeClient();
        this.getConsumption();
        break;
      case 2:
        this.getStations();
        this.getVehiclesWithoutOrder(this.codClient);
        this.getCitiesStations();
        break;
    }
    return this.tabs[value] == true ? 'show active' : '';
  }

  tabClassVehicle(value: number) {
    if (this.tabsVehicle[value].estado == true)
      return;
    else {
      this.tabsVehicle.forEach(e => {
        e.estado = false;
        e.classTab = '';
        e.classPane = '';
      });
      if (this.tabsVehicle[value].estado == false) {
        this.tabsVehicle[value].estado = true;
        this.tabsVehicle[value].classTab = 'active';
        this.tabsVehicle[value].classPane = 'show active'
      }
    }
    if (value == 2) this.getFree();
    return this.tabsVehicle[value] == true ? 'show active' : '';
  }

  tabClassSearch(value: number) {
    if (this.tabsSearch[value].estado == true)
      return;
    else {
      this.tabsSearch.forEach(e => {
        e.estado = false;
        e.classTab = '';
        e.classPane = '';
      });
      if (this.tabsSearch[value].estado == false) {
        this.tabsSearch[value].estado = true;
        this.tabsSearch[value].classTab = 'active';
        this.tabsSearch[value].classPane = 'show active'
      }
    }
    switch (value) {
      case 2:
        this.getAllVehicles();
        break;
      case 3:
        this.getIdentifiers();
        break;
    }
    return this.tabsSearch[value] == true ? 'show active' : '';
  }

  getVehiclesWithoutOrder(client) {
    this.carteraService.GetVehicleWithoutOrder(client).subscribe(data => {
      this.vehicles = data;
      this.vehiclesNews.forEach(element => {
        this.vehicles = this.vehicles.filter(e => e == element);
      });
    }, error => console.log(error)
    );
  }

  getVehiclesFree(client) {
    this.carteraService.GetVehicleFree(client).subscribe(data => {
      this.vehiclesFree = data;
    }, error => console.log(error)
    );
  }

  getIdentifiersFree(client) {
    this.carteraService.GetIdentifierFree(client).subscribe(data => {
      this.identifiersFree = data;
    }, error => console.log(error)
    );
  }


  getIdentifiers() {
    this.carteraService.GetIdentifier(this.codClient, null).subscribe(data => {
      this.identifiers = data;
    }, error => console.log(error)
    );
  }

  getArticleTypes() {
    this.carteraService.getArticleTypes().subscribe(data => {
      this.articlesTypes = data;
    }, error => console.log(error)
    );
  }

  getStations() {
    this.nominaService.GetStations().subscribe(data => {
      this.stationsAll = data.filter(e => e.idEstacion != 90);
      this.stations = data.filter(e => e.listoSimovil == true);
      this.stationsNews.forEach(element => {
        this.stations = this.stations.filter(e => e == element);
      });
    }, error => console.log(error)
    );
  }

  getCitiesStations() {
    this.carteraService.getCityStation().subscribe(data => {
      this.citiesStations = data;
    }, error => console.log(error)
    );
  }

  getNameCities(id: number) {
    if (this.citiesStations == null)
      return;
    return this.citiesStations.find(
      e => e.idCiudadEstacion == id
    ).nombreCiudad;
  }

  getNameStation(id: number) {
    if (this.stationsAll == null || id == null || this.stationsAll.length == 0)
      return;
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }


  addStation(station) {
    var index = this.stations.indexOf(station);
    this.stationsNews.push(station);
    this.stations.splice(index, 1);
    this.stationsNews.sort((e, f) => e.idEstacion - f.idEstacion)
  }

  removeStation(station) {
    var index = this.stationsNews.indexOf(station);
    this.stations.push(station);
    this.stationsNews.splice(index, 1);
    this.stations.sort((e, f) => e.idEstacion - f.idEstacion);
  }

  addVehicle(vehicle) {
    var index = this.vehicles.indexOf(vehicle);
    this.vehiclesNews.push(vehicle);
    this.vehicles.splice(index, 1);
    this.vehiclesNews.sort(this.orderAlphabet);
  }

  removeVehicle(vehicle) {
    var index = this.vehiclesNews.indexOf(vehicle);
    this.vehicles.push(vehicle);
    this.vehiclesNews.splice(index, 1);
    this.vehicles.sort(this.orderAlphabet);
  }

  addAssignIdentifier(identifier: EntIdentifier) {
    if (identifier === this.identifierFreeSel) {
      this.identifierFreeSel = null;
      this.assignForm.get('chip').setValue(null);
    } else {
      this.assignForm.get('chip').setValue(identifier.romIdentificador);
      this.identifierFreeSel = identifier;
    }
  }

  addAssignVehicle(vehicle: EntVehicle) {
    if (vehicle === this.vehicleFreeSel) {
      this.vehicleFreeSel = null;
      this.assignForm.get('placa').setValue(null);
    } else {
      this.assignForm.get('placa').setValue(vehicle.placa);
      this.vehicleFreeSel = vehicle;
    }
  }

  orderAlphabet(a, b) {
    if (a.placa > b.placa)
      return 1;
    if (a.placa < b.placa)
      return -1;
    return 0;
  }

  submitOrderForm() {
    var order = new EntOrder();
    var stationList = [];
    order.codCliente = this.codClient;
    order.estado = true;
    var orderDetail: EntOrderDetail[] = [];
    if (this.orderForm.get('orderType').value && this.orderForm.get('orderType').value.id == 0) {
      // Insert no controlado
      order.valor = Number(this.orderForm.get('value').value);
      order.vigencia = Number(this.orderForm.get('validity').value);
      order.controlado = false;

      // fin insert no controlado
    }
    else {    // Es controlado
      if (!this.ValidaVehicles() || !this.ValidaStations())
        return;
      order.controlado = true;
      //Asigna las estaciones
      if (this.orderForm.get('stationType').value && this.orderForm.get('stationType').value.id == 0) //todas las estaciones
      {
        order.todaEstacion = true;
      } else {                            // algunas estaciones
        order.todaEstacion = false;
        this.stationsNews.forEach(element => {
          stationList.push(element.idEstacion);
        });
      }
      //Asigna los vehiculos.
      if (this.orderForm.get('valueType').value && this.orderForm.get('valueType').value.id == 0) {  //todos los autos.
        order.todoVehiculo = true;
        order.valor = Number(this.orderForm.get('value2').value);
        order.vigencia = Number(this.orderForm.get('validity2').value);
      } else {                          // algunos autos.
        order.todoVehiculo = false;
        this.vehiclesNews.forEach(element => {
          var item = new EntOrderDetail();
          item.automotor = element.placa;
          item.valor = element['value'];
          item.vigencia = element['validity'];
          orderDetail.push(item);
        });
      }
      // fin insert controlado  
    }
    this.insertOrder(order, orderDetail, stationList);
  }

  insertOrder(order, orderDetail, stationList) {
    this.carteraService.InsertOrder(order, orderDetail, stationList).subscribe(result => {
      console.log(result);
      this.principalComponent.showMsg('success', 'Correcto', 'Pedido #' + result["Pedido"] + ' creado correctamente');
      this.resetOrderForm();
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  ValidaStations() {
    let pass = true;
    if (this.orderForm.get('stationType').value && this.orderForm.get('stationType').value.id == 1) {
      if (this.stationsNews.length == 0)
        pass = false;
    }
    if (!pass) {
      this.principalComponent.showMsg('info', 'Información', 'Debe seleccionar al menos una estación.')
    }
    return pass;
  }

  ValidaVehicles() {
    let pass = true;
    let valid = true;
    if (this.orderForm.get('valueType').value && this.orderForm.get('valueType').value.id == 1) {
      if (this.vehiclesNews.length == 0) {
        this.principalComponent.showMsg('warn', 'Alerta', 'Debe seleccionar al menos un vehículo.')
        pass = false;
      } else {
        this.vehiclesNews.forEach(element => {
          if (element['value'] == null || element['validity'] == null)
            pass = false;
          if (element['validity'] < 0 || element['validity'] > 255)
            valid = false;
        });
        if (!pass)
          this.principalComponent.showMsg('warn', 'Alerta', 'Hay valores o vigencias vacías.')
        if (!valid) {
          this.principalComponent.showMsg('warn', 'Alerta', 'Vigencia debe estar entre 0 y 255.')
          pass = false;
        }
      }
    }
    return pass;
  }

  resetOrderForm() {
    this.getStations();
    this.getVehiclesWithoutOrder(this.codClient);
    this.stationsNews = [];
    this.vehiclesNews = [];
    this.controlShow = [];
    this.controlShow[4] = true;
    this.orderForm.reset();
    //this.buildForm();
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

  submitVehicleForm() {
    this.vehicle = new EntVehicle();
    this.vehicle.codCliente = this.codClient;
    this.vehicle.placa = String(this.vehicleForm.get('placa').value).trim().toUpperCase();
    this.vehicle.marca = String(this.vehicleForm.get('marca').value).trim().toUpperCase();
    this.vehicle.modelo = String(this.vehicleForm.get('modelo').value).trim().toUpperCase();
    this.vehicle.ano = Number(this.vehicleForm.get('anio').value);
    this.vehicle.combustible = this.vehicleForm.get('fuelType').value ? this.vehicleForm.get('fuelType').value.ID : null;
    this.vehicle.estado = Boolean(this.vehicleForm.get('estado').value);
    this.InsertVehicle(this.vehicle);
  }

  InsertVehicle(vehicle: EntVehicle) {
    this.carteraService.InsertVehicle(vehicle).subscribe(data => {
      this.vehicleForm.reset();
      this.principalComponent.showMsg('success', 'Éxito', 'Vehículo con placa: ' + vehicle.placa + ' registrado correctamente');
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  validarIdentificador(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.GetIdentifier(null, value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          return;
        }
        this.principalComponent.showMsg('warn', 'Advertencia', 'El identificador ya existe');
      }, error => console.log("Error al validar el identificador."));
  }

  submitIdentifierForm() {
    let identificador = new EntIdentifier();
    identificador.codCliente = this.codClient;
    identificador.romIdentificador = String(this.identifierForm.get('chip').value);
    identificador.estado = Boolean(this.identifierForm.get('estado').value);
    identificador.estado = true;
    this.InsertIdentifier(identificador);
  }

  InsertIdentifier(identifier: EntIdentifier) {
    this.carteraService.InsertIdenfier(identifier).subscribe(data => {
      this.identifierForm.reset();
      this.principalComponent.showMsg('success', 'Éxito', 'Identificador : ' + identifier.romIdentificador + ' registrado correctamente');
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  submitAssignForm() {
    this.utilService.loader(true);
    this.carteraService.LinkIdentifier(this.identifierFreeSel.id, this.vehicleFreeSel.placa).subscribe(data => {
      this.utilService.loader(false);
      this.resetAssignForm();
      this.principalComponent.showMsg('success', 'Éxito', 'Identificador asignado correctamente');
    }, error => {
      console.log(error)
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  getFree() {
    this.getVehiclesFree(this.codClient);
    this.getIdentifiersFree(this.codClient);
  }

  resetAssignForm() {
    this.assignForm.reset();
    this.getFree();
  }

  sumConsumption(value) {
    let array: EntConsumptionClient[];
    var suma = 0;
    if (value == 0)
      array = this.consumos;
    if (value == 1)
      array = this.searchConsumos;
    array.forEach(element => {
      suma += element.valor;
    });
    return suma;
  }

  actionSearchVehicle(vehicle: EntVehicle, toDo: number) {
    if (vehicle == null || toDo == null)
      return
    if (toDo == 0) { //edit
      this.editControl[0] = true;
      this.vehicleEditForm.get('placa').setValue(vehicle.placa);
      this.vehicleEditForm.get('marca').setValue(vehicle.marca);
      this.vehicleEditForm.get('modelo').setValue(vehicle.modelo);
      this.vehicleEditForm.get('anio').setValue(vehicle.ano);
      this.vehicleEditForm.get('fuelType').setValue(this.articlesTypes.find(fuelType => fuelType.ID === vehicle.combustible));
      this.vehicleEditForm.get('estado').setValue(vehicle.estado);
    }
    if (toDo == 1) { //delete
      this.deleteVehicle(vehicle);
    }
  }

  submitVehicleEditForm() {
    let vehicleToEdit = new EntVehicle();
    vehicleToEdit.codCliente = Number(this.codClient);
    vehicleToEdit.placa = String(this.vehicleEditForm.get('placa').value).trim().toUpperCase();
    vehicleToEdit.marca = String(this.vehicleEditForm.get('marca').value).trim().toUpperCase();
    vehicleToEdit.modelo = String(this.vehicleEditForm.get('modelo').value).trim().toUpperCase();
    vehicleToEdit.ano = Number(this.vehicleEditForm.get('anio').value);
    vehicleToEdit.combustible = Number(this.vehicleEditForm.get('fuelType').value.ID);
    vehicleToEdit.estado = Boolean(this.vehicleEditForm.get('estado').value);
    this.editVehicle(vehicleToEdit);
  }

  editVehicle(vehicle: EntVehicle) {
    this.carteraService.UpdateVehicle(vehicle).subscribe(result => {
      this.vehicleEditForm.reset();
      this.principalComponent.showMsg('success', 'Éxito', 'Vehículo actualizado con éxito.');
      // this.vehiclesAll.find(e => e.placa = vehicle.placa)
      let j = this.vehiclesAll.findIndex(e => e.placa === vehicle.placa);
      this.vehiclesAll[j] = vehicle;
      this.editControl[0] = false;
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  deleteVehicle(vehicle: EntVehicle) {
    this.utilService.confirm('Va a eliminar el Vehículo con placa ' + vehicle.placa + '. ¿Desea continuar?', result => {
      if (result) {
        this.carteraService.DeleteVehicle(vehicle).subscribe(result => {
          this.vehicleEditForm.reset();
          this.principalComponent.showMsg('success', 'Éxito', 'Vehículo eliminado con éxito.');
          this.vehiclesAll = this.vehiclesAll.filter(e => e.placa !== vehicle.placa);
        }, error => {
          this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  actionSearchIdentifier(identifier: EntIdentifier, toDo: number) {
    if (identifier == null || toDo == null)
      return;
    if (toDo == 0) { //active
      this.updateIdentifier(identifier);
    }
    if (toDo == 1) { //unlink
      this.unlinkIdentifier(identifier);
    }
    if (toDo == 2) { //delete
      this.deleteIdentifier(identifier);
    }
  }

  unlinkIdentifier(identifier: EntIdentifier) {
    this.utilService.confirm('Va a desvincular el identificador ' + identifier.romIdentificador + '. ¿Desea continuar?', resulta => {
      if (resulta) {
        this.carteraService.UnlinkIdentifier(identifier).subscribe(result => {
          this.principalComponent.showMsg('success', 'Éxito', 'Identificador desvinculado correctamente.');
          let i = this.identifiers.findIndex(e => e.id === identifier.id);
          this.identifiers[i].placa = null;
        }, error => {
          this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  deleteIdentifier(identifier: EntIdentifier) {
    this.utilService.confirm('Va a eliminar el identificador ' + identifier.romIdentificador + '. ¿Desea continuar?', result => {
      if (result) {
        this.carteraService.DeleteIdentifier(identifier).subscribe(result => {
          this.principalComponent.showMsg('success', 'Éxito', 'Identificador eliminado con éxito.');
          this.identifiers = this.identifiers.filter(e => e.id !== identifier.id);
        }, error => {
          this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  updateIdentifier(identifier: EntIdentifier) {
    let identifier2 = new EntIdentifier();
    identifier2.codCliente = identifier.codCliente;
    identifier2.estado = !identifier.estado;
    identifier2.id = identifier.id;
    identifier2.placa = identifier.placa;
    identifier2.romIdentificador = identifier.romIdentificador;
    this.carteraService.UpdateIdentifier(identifier2).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Identificador actualizado con éxito.');
      let i = this.identifiers.findIndex(e => e.id === identifier.id);
      this.identifiers[i].estado = !identifier.estado;
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  getOrderSearch() {
    if (this.searchPedidoFechaIni > this.searchPedidoFechaFin) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'La fecha inicial debe ser mayor a la final');
      return;
    }
    this.utilService.loader(true);
    this.carteraService.getOrder(this.codClient, this.searchPedidoFechaIni, this.searchPedidoFechaFin, this.searchPedidoEstado).subscribe(data => {
      this.searchOrders = data;
      this.orderAutoStationOrder(data);
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getPaymentSearch() {
    if (this.searchPagoFechaIni > this.searchPagoFechaFin) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'La fecha inicial debe ser mayor a la final');
      return;
    }
    this.utilService.loader(true);
    this.carteraService.getPayment2(this.codClient, this.searchPagoFechaIni, this.searchPagoFechaFin, this.searchPagoEstado).subscribe(data => {
      this.searchPayments = data;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  orderAutoStationOrder(dataOrigen) {
    this.arrayOrderAutoStation = [];
    dataOrigen.forEach(data => {
      var array = [[], [], [], []];
      let lengthPDE;
      let lengthPDA;
      if (data.PedidoDetalleEstacion == null) {
        lengthPDE = 0;
        data.PedidoDetalleEstacion = [];
      } else
        lengthPDE = data.PedidoDetalleEstacion.length;
      if (data.PedidoDetalleAuto == null) {
        lengthPDA = 0;
        data.PedidoDetalleAuto = [];
      } else
        lengthPDA = data.PedidoDetalleAuto.length;
      let maxlength = lengthPDA > lengthPDE ? lengthPDA : lengthPDE;
      for (let i = 0; i < maxlength; i++) {
        if (data.PedidoDetalleEstacion[i] != null) {
          array[0][i] = data.PedidoDetalleEstacion[i].estacion;
        }
        else
          array[0][i] = null;
        if (data.PedidoDetalleAuto[i] != null) {
          array[1][i] = data.PedidoDetalleAuto[i].automotor;
          array[2][i] = data.PedidoDetalleAuto[i].vigencia;
          array[3][i] = data.PedidoDetalleAuto[i].valor;
        }
        else {
          array[1][i] = null;
          array[2][i] = null;
          array[3][i] = null;
        }
      }
      this.arrayOrderAutoStation.push(array);
    });
  }

  getFormaPago(value) {
    if (value != null) {
      try {
        return PAYMENTMETHODS.find(e => e.id == value).text;
      } catch (error) {
        return null;
      }
    }
  }

  deleteOrder(order: EntOrder) {
    if (order == null)
      return;
    this.utilService.confirm('Va a eliminar la orden N° ' + order.idPedido + '. ¿Desea continuar?', result => {
      if (result) {
        order.estado = !order.estado;
        this.carteraService.UpdateOrder(order).subscribe(result => {
          this.principalComponent.showMsg('success', 'Éxito', 'Pedido actualizado con éxito.');
          let i = this.searchOrders.findIndex(e => e.idPedido === order.idPedido);
          this.searchOrders[i].estado = order.estado;
        }, error => {
          this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  cleanConsumptionSearch() {
    this.searchConsumoFechaIni = null;
    this.searchConsumoFechaFin = null;
    this.searchConsumos = null;
  }

  cleanOrderSearch() {
    this.searchPedidoEstado = null;
    this.searchPedidoFechaIni = null;
    this.searchPedidoFechaFin = null;
    this.searchOrders = null;
  }

  cleanPaymentSearch() {
    this.searchPagoEstado = null;
    this.searchPagoFechaIni = null;
    this.searchPagoFechaFin = null;
    this.searchPayments = null;
  }

  getReceivableSearch() {
    if (this.searchCuentaCobroFechaIni > this.searchCuentaCobroFechaFin) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'La fecha inicial debe ser mayor a la final');
      return;
    }
    this.utilService.loader(true);
    this.carteraService.getReceivable(this.codClient, this.searchCuentaCobroEstado, this.searchCuentaCobroFechaIni, this.searchCuentaCobroFechaFin, null, null).subscribe(data => {
      this.searchReceivables = data;
      this.utilService.loader(false);
    }, error => console.log(error)
    );
  }

  cleanReceivableSearch() {
    this.searchCuentaCobroEstado = null;
    this.searchCuentaCobroFechaIni = null;
    this.searchCuentaCobroFechaFin = null;
    this.searchReceivables = null;
  }

  csvConsumptionSearch() {
    let title = ['fechaConsumo', 'horaConsumo', 'ConsecutivoEstacion', 'cantidad', 'placa', 'combustible', 'valor', 'idPedido', 'estacionConsumo', 'cuentaCobro'];
    let titleB = ['Fecha', 'Hora', 'Tiquete', 'Cantidad', 'Placa', 'Combustible', 'Valor', 'Pedido', 'Estación', 'Cuenta de Cobro'];
    let item = JSON.parse(JSON.stringify(this.searchConsumos));
    item.map(e => {
      e.fechaConsumo = formatDate(e.fechaConsumo, 'dd/MM/yyyy', 'en-US', '+0000');
      e.horaConsumo = formatDate(e.horaConsumo, 'mediumTime', 'en-US', '+0000');
      e.combustible = this.articlesTypes.find(f => f.ID == e.combustible).DESCRIPCION;
    })
    this.printService.downloadCSV(ObjToCSV(item, title, titleB), 'consumos');
  }

  csvReceivableSearch() {
    let title = ['num', 'fecha', 'periodoIni', 'periodoFin', 'estado', 'valor', 'saldo'];
    let titleB = ['Número', 'Fecha', 'Desde', 'Hasta', 'Estado', 'Valor', 'Saldo'];
    let item = JSON.parse(JSON.stringify(this.searchReceivables));
    item.map(e => {
      e.fecha = formatDate(e.fecha, 'dd/MM/yyyy', 'en-US', '+0000');
      e.periodoIni = formatDate(e.periodoIni, 'dd/MM/yyyy', 'en-US', '+0000');
      e.periodoFin = formatDate(e.periodoFin, 'dd/MM/yyyy', 'en-US', '+0000');
    });
    this.printService.downloadCSV(ObjToCSV(item, title, titleB), 'cuenta_cobro');
  }

  csvOrderSearch() {
    let title = ['idPedido', 'controlado', 'todaEstacion', 'todoVehiculo', 'vigencia', 'valor', 'saldo', 'consumido', 'estado', 'fechaCreacion'];
    let item = JSON.parse(JSON.stringify(this.searchOrders));
    item.map(e => {
      e.fechaCreacion = formatDate(e.fechaCreacion, 'dd/MM/yyyy', 'en-US', '+0000');
    });
    this.printService.downloadCSV(ObjToCSV(item, title), 'pedidos');
  }

  csvPaymentSearch() {
    let title = ['idPago', 'fecha', 'fechaPago', 'formaPago', 'valor', 'numCuentaCobro', 'estado'];
    let titleB = ['Id', 'Fecha ', 'Fecha de Pago', 'Forma de Pago', 'Valor', 'Cuenta de cobro', 'Estado'];
    let item = JSON.parse(JSON.stringify(this.searchPayments));
    item.map(e => {
      e.fecha = formatDate(e.fecha, 'dd/MM/yyyy', 'en-US', '+0000');
      e.fechaPago = formatDate(e.fechaPago, 'dd/MM/yyyy', 'en-US', '+0000');
      e.formaPago = this.getFormaPago(e.formaPago);
    });
    this.printService.downloadCSV(ObjToCSV(item, title, titleB), 'Pagos');
  }

  printConsumptionSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-consumption').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Consumos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Consumos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
    // <body onload="window.print();window.close()">
  }

  printOrderSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-orders').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Pedidos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Pedidos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
    // <body onload="window.print();window.close()">
  }

  printPaymentSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-payments').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Pagos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Pagos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
    // <body onload="window.print();window.close()">
  }

  printReceivableSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-receivables').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Consumos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Consumos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
    // <body onload="window.print();window.close()">
  }

  printReceivable(receivable: EntReceivable) {
    this.utilService.loader(true);
    this.carteraService.getConsumption(null, null, null, receivable.id, null).subscribe(consumos => {
      this.printService.printReceivable(
        receivable,
        consumos,
        this.stationsAll.find(e => e.idEstacion === receivable.estacion),
        result => this.utilService.loader(false)
      );
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  sumarDiaFecha(date: Date) {
    let date2 = new Date(date);
    return Date.UTC(date2.getFullYear(), date2.getUTCMonth(), date2.getUTCDate() + 7);
  }

  getNameTyArticle(val: number) {
    try {
      return this.articlesTypes.find(e => e.ID == val).DESCRIPCION;
    } catch (error) {
      return null;
    }
  }
}