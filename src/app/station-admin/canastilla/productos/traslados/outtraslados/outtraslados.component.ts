import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../../../routerAnimation';
import { EntStation } from '../../../../../Class/EntStation';
import { EntProductos } from '../../../../../Class/EntProductos';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { EntVentasProductos } from '../../../../../Class/EntVentaProducto';
import { EntClient } from '../../../../../Class/EntClient';
import { currencyNotDecimal, focusById, dateToISOString, addDays } from '../../../../../util/util-lib';
import { EntProductosTraslados } from '../../../../../Class/EnProductosTraslados';
import { NominaService } from '../../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../../services/storage.service';
import { PrincipalComponent } from '../../../../../principal/principal.component';
import { UtilService } from '../../../../../services/util.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IngresoNuevaExistenciaComponent } from '../../ingreso-nueva-existencia/ingreso-nueva-existencia.component';

@Component({
    selector: 'app-outtraslados',
    templateUrl: './outtraslados.component.html',
    styleUrls: ['./outtraslados.component.css'],
    animations: [fadeTransition()]
})
export class OuttrasladosComponent implements OnInit {
    stationsAll: EntStation[];
    stationCode: any;
    productos: EntProductos[];
    fecha: Date;
    es: any;
    cargando = false;
    VentaRegistrada = false;
    ventas: FormGroup;
    list: FormArray;
    ProductosVendidos: EntVentasProductos = new EntVentasProductos;
    plantilla: FormGroup;
    clientSel: EntClient;
    notdecimal = currencyNotDecimal();
    VerLista = false;
    producto: EntProductos;
    credito = false;
    translado = false;
    listClientCred = false;
    contadorGuardadas: number;
    contadorErrores: number;
    ErroresString = '';
    codClienteCred: number;
    Indice: number;
    ExistenciaEstacionEnvia: number;
    stationSelOrigen: EntStation;
    stationSelDestino: EntStation = new EntStation();
    traslado: EntProductosTraslados = new EntProductosTraslados;
    idUsuario: string;
    constructor(
        private fb: FormBuilder,
        private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Traslados Productos - Simovil');
        this.fecha = new Date();
    }
    ngOnInit() {
        this.buildForm();
        this.cargando = true;
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['enero ', 'febrero ', 'marzo ', 'abril ', 'mayo ', 'junio', 'julio ', 'agosto ', 'septiembre ', 'octubre ', 'noviembre ', 'diciembre '],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
        this.basicData();
    }

    GetArea() {
        this.idUsuario = this.storageService.getCurrentUserDecode().Usuario;
    }
    basicData() {
        this.stationCode = this.storageService.getCurrentStation();
        this.stationSelOrigen = null;
        this.GetArea();
        this.utilService.loader();
        this.nominaService.GetStations().subscribe(res => {
            this.stationsAll = res;
            if (this.stationCode) {
                this.stationSelOrigen = res.find(e => e.idEstacion == this.stationCode);
            }
            this.utilService.loader(false);
        }, error => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'ERROR', error.error.message);
        });
    }

    Acredito(index) {
        this.Indice = index;
        if (!this.list.value[index].acredito) {
            this.utilService.confirm('¿Desea venderlo a Crédito? ', res => {
                if (res) {
                    this.listClientCred = true;
                    this.list.value[index].acredito = true;
                }
            });
        } else {
            this.list.value[index].acredito = false;
            this.list.value[index].cliente = null;
        }
    }
    clienteElegido(Cliente: EntClient, $elemen) {
        this.listClientCred = false;
        this.list.value[this.Indice].cliente = Cliente.codCliente;
        console.log(this.list.value);
    }
    CambiodeFecha() {
        this.cleanArray();
    }
    Paratranslado(index) {
        if (!this.list.value[index].traslado) {
            this.Indice = index;
            this.utilService.confirm('¿Va a hacer un traslado? ', res => {
                if (res) {
                    this.list.value[index].traslado = true;
                }
            });
        } else {
            this.list.value[index].traslado = false;
        }
    }

    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion === id
        ).nombreEstacion;
    }
    get visibleArray() {
        try {
            return (this.ventas.get('lista') as FormArray).length > 0;
        } catch (error) {
            return false;
        }
    }
    validItem(index: number) {
        const listRaw = this.list.getRawValue();
        let res = true;
        listRaw.map(e => {
            if (e.id === listRaw[index].id && e !== listRaw[index]) {
                res = false;
            }
        });
        return res;
    }
    Agregar() {
        if (this.VentaRegistrada) {
            Swal.fire(
                'VENTA REGISTRADA',
                'La venta para este dia ya esta registrada',
                'error'
            );
            return;
        }
        this.VerLista = true;
    }
    add($element) {
        if (this.list === undefined) {
            this.list = this.ventas.get('lista') as FormArray;
        }
        this.list.push(this.createItem());
        setTimeout(() => {
            $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 50);
    }


    ProductoSelecionado(Producto: EntProductos, $element) {
        this.producto = Producto;
        this.ObtenerExistencia(Producto, $element);

    }

    createItem() {
        return this.fb.group({
            idProducto: [this.producto.id, Validators.required],
            codContable: [this.producto.codContable],
            descripcion: [this.producto.descripcion],
            existencia: [this.ExistenciaEstacionEnvia],
            cantidad: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
            fecha: [this.fecha],
            precio: [this.producto.precio],
            acredito: [false],
            traslado: [false],
            cliente: [null],
            observaciones: [null]
        });
    }
    ObtenerExistencia(Producto: EntProductos, $element) {
        this.ExistenciaEstacionEnvia = 0;

        this.nominaService.GetProductos(this.stationSelOrigen.idEstacion, this.producto.descripcion , this.fecha, this.producto.id).subscribe(datos => {
            if (datos.length <= 0) {

                Swal.fire({
                    title: 'NO SE ENCONTRÓ',
                    icon: 'error',
                    text: 'El producto no esta Registrado en la Estacion Origen'
                });
                return;
            }

            this.ExistenciaEstacionEnvia = datos[0].existencia;
            if (this.list !== undefined) {
                const listRaw = this.list.value;
                const found = listRaw.find(element => element.id === Producto.id);
                if (found === undefined) {
                    this.VerLista = false;
                    this.producto = Producto;
                    this.add($element);
                    focusById('Cantidad' + this.list.length, true);
                } else {
                    if (found.acredito) {
                        this.VerLista = false;
                        this.producto = Producto;
                        this.add($element);
                        focusById('Cantidad' + this.list.length, true);
                    } else {
                        this.principalComponent.showMsg('info', 'Información', 'El Producto ya esta en la Lista');
                    }

                }
            } else {
                this.VerLista = false;
                this.producto = Producto;
                this.add($element);
                focusById('Cantidad' + this.list.length, true);
            }
        }

        );
    }
    buildForm() {
        const date = dateToISOString(addDays(new Date(), -1));
        this.plantilla = this.fb.group({
            idProducto: null,
            codContable: null,
            descripcion: null,
            cantidad: null,
            fecha: date,
            precio: null,
            acredito: false,
            traslado: false,
            cliente: null,
            observaciones: null
        });
        this.ventas = this.fb.group({
            lista: this.fb.array([])
        });
    }
    comparar(index) {
        const Cantidad = this.list.value[index].cantidad;
        const Existencia = this.list.value[index].existencia;
        if (Cantidad > Existencia) {
            Swal.fire(
                'Advertencia',
                'La venta es Superior a la Existencia',
                'warning'
            );
            return;
        }
    }
    cancel(quest = true) {
        if (quest) {
            this.utilService.confirm('¿Desea eliminar los Productos Ingresado? ', res => {
                if (res) {
                    this.cleanArray();
                }
            });
        } else {
            this.cleanArray();
        }
    }
    BorrarItem(index: number) {
        this.list.removeAt(index);
    }
    cleanArray() {
        if (this.list == null || this.list == undefined) {
            return;
        }
        while (this.list.length > 0) {
            this.BorrarItem(this.list.length - 1);
        }
        this.clear();
    }
    delItem(index: number) {
        this.utilService.confirm('¿Desea eliminar el Producto? ', res => {
            if (res) {
                this.list.removeAt(index);
            }
        });
    }
    clear() {
        this.clientSel = null;
        this.plantilla.reset();
    }
    VerListaProductos(Ver: boolean) {
        this.VerLista = Ver;
    }
    BuscarVenta() {
        this.ComprobarSiHayVentas(this.stationCode, this.fecha);
    }

    ComprobarSiHayVentas(idestacion: number, fecha: Date) {
        this.nominaService.GetVentastoday(idestacion, fecha).subscribe(data => {
            console.log('entro a data[0].repuesta', data[0].repuesta);
            if (data[0].repuesta === 'true') {
                this.VentaRegistrada = true;
            } else {
                this.VentaRegistrada = false;
            }
        }, error => {
            console.error(error);
        });
    }

    save() {

        const fecha = this.fecha.toLocaleDateString();
        this.utilService.confirm('La fecha del registro es  ' + fecha + ' ¿Desea Continuar?', res => {
            if (!res) {
                return;
            } else {
                const rawData = this.list.value;
                const EstacionDestino = this.stationSelDestino.idEstacion;
                // tslint:disable-next-line: forin
                for (const index in rawData) {
                    this.traslado.idUsuarioEnvia = this.idUsuario;
                    this.traslado.IdProducto = rawData[index].idProducto;
                    this.traslado.FechaEnvio = this.fecha;
                    this.traslado.IdEstacionEnvia = this.stationSelOrigen.idEstacion;
                    this.traslado.ObservacionesEnvia = rawData[index].observaciones;
                    this.traslado.Cantidad = rawData[index].cantidad;
                    this.traslado.idEstacionRecibe = EstacionDestino;
                    this.traslado.Nuevo = true;
                    this.nominaService.traslados(this.traslado).subscribe(data => {
                        this.principalComponent.showMsg('success', 'Éxito', 'El Tralado fue Registrado');
                    }, error => {
                        this.contadorErrores += 1;
                        this.principalComponent.showMsg('error', 'NO SE GUARDÓ ', error.error.message);
                    });
                }
            }
        });





    }

}
