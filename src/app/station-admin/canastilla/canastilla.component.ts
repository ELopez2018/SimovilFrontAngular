import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NominaService } from '../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { EntStation } from '../../Class/EntStation';
import { StorageService } from '../../services/storage.service';
import { EntProductos } from '../../Class/EntProductos';
import { EntVentasProductos } from '../../Class/EntVentaProducto';
import { PrincipalComponent } from '../../principal/principal.component';
import { UtilService } from '../../services/util.service';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import {
    dateToISOString,
    addDays,
    currencyNotDecimal,
    focusById,
} from '../../util/util-lib';
import { EntClient } from '../../Class/EntClient';
import { fadeTransition } from '../../routerAnimation';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { FooterColumnGroup } from 'primeng/primeng';
// declare function  Swal(): any;

@Component({
    selector: 'app-canastilla',
    templateUrl: './canastilla.component.html',
    styleUrls: ['./canastilla.component.css'],
    animations: [fadeTransition()],
})
export class CanastillaComponent implements OnInit {
    @Output() submiter = new EventEmitter<EntProductos[]>();
    Obj;
    stationsAll: EntStation[];
    stationCode: any;
    stationSel: EntStation = new EntStation();
    productos: EntProductos[];
    date3: Date;
    cargando = false;
    VentaRegistrada = false;

    ventas: FormGroup;
    list: FormArray;
    plantilla: FormGroup;

    ProductosVendidos: EntVentasProductos = new EntVentasProductos();
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
    es: any;
    VerFormDescuento: boolean = false;
    ProductoEnviado: EntProductos[] = [];
    InfoProducto;
    estacion: number;
    totalVenta: number;
    totalCantidadP: number;
    constructor(
        private fb: FormBuilder,
        private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Ventas Productos - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.date3 = new Date();
    }
    ngOnInit() {
        this.buildForm();

        this.cargando = true;
        this.nominaService.GetStations().subscribe(
            (data) => {
                this.stationsAll = data;
                if (this.stationCode) {
                    this.getEstacionActual(this.stationCode);
                }
            },
            (error) => console.error(error.error.message)
        );

        this.es = {
            firstDayOfWeek: 1,
            dayNames: [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado',
            ],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: [
                'enero ',
                'febrero ',
                'marzo ',
                'abril ',
                'mayo ',
                'junio',
                'julio ',
                'agosto ',
                'septiembre ',
                'octubre ',
                'noviembre ',
                'diciembre ',
            ],
            monthNamesShort: [
                'ene',
                'feb',
                'mar',
                'abr',
                'may',
                'jun',
                'jul',
                'ago',
                'sep',
                'oct',
                'nov',
                'dic',
            ],
            today: 'Hoy',
            clear: 'Borrar',
        };
        this.InfoProducto = {
            Vendido: null,
            ConDescuento: null,
            ACredito: null,
        };
        this.ComprobarSiHayVentas(this.stationCode, this.date3);
    }
    Acredito(index) {
        this.Indice = index;
        if (!this.list.value[index].acredito) {
            this.utilService.confirm('¿Desea venderlo a Crédito? ', (res) => {
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
    }

    CambiodeFecha() {
        if (this.list !== undefined) {
            this.cancel();
        }
        this.ComprobarSiHayVentas(this.stationCode, this.date3);
    }
    Paratranslado(index) {
        if (!this.list.value[index].traslado) {
            this.Indice = index;
            this.utilService.confirm('¿Va a hacer un traslado? ', (res) => {
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
        return this.stationsAll.find((e) => e.idEstacion === id).nombreEstacion;
    }
    getEstacionActual(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        this.stationSel = this.stationsAll.find((e) => e.idEstacion == id);
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
        listRaw.map((e) => {
            if (e.id === listRaw[index].id && e !== listRaw[index]) {
                res = false;
            }
        });
        return res;
    }
    Agregar() {
        this.BuscarVenta();
        if (this.VentaRegistrada) {
            Swal.fire(
                'VENTA REGISTRADA',
                'La venta para este dia ya esta registrada',
                'error'
            );
            return;
        }
        this.estacion = this.stationSel.idEstacion;
        this.VerLista = true;
    }

    add($element) {
        if (this.list === undefined) {
            this.list = this.ventas.get('lista') as FormArray;
        }
        this.list.push(this.createItem());

        setTimeout(() => {
            $element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }, 50);
    }
    BuscaArticuloVendido(idEstacion: number, idProducto: number, fecha: Date) {
        this.nominaService
            .getinfoArtSale(idEstacion, idProducto, this.date3)
            .subscribe(
                (data) => {
                    this.InfoProducto = data[0];
                    console.log('1:', this.InfoProducto);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    ProductoSelecionado(Producto: EntProductos, $element) {
        this.estacion = null;
        this.nominaService
            .getinfoArtSale(this.stationSel.idEstacion, Producto.id, this.date3)
            .subscribe(
                (data) => {
                    this.InfoProducto = data[0];
                    this.AgregarArt(Producto, $element);
                },
                (error) => {
                    this.AgregarArt(Producto, $element);
                    console.log(error);
                }
            );
    }

    AgregarArt(Producto: EntProductos, $element) {
        console.log(Producto);
        if (this.list !== undefined) {
            const listRaw = this.list.value;
            const found = listRaw.find((element) => element.id === Producto.id);

            if (found === undefined) {
                this.VerLista = false;
                this.producto = Producto;
                if (this.InfoProducto.vendido) {
                    Swal.fire(
                        'ARTICULO VENDIDO',
                        'Hay una venta con este artículo',
                        'warning'
                    );
                } else {
                    this.add($element);
                    focusById('Cantidad' + this.list.length, true);
                }
            } else {
                if (found.acredito) {
                    this.VerLista = false;
                    this.producto = Producto;
                    this.add($element);
                    focusById('Cantidad' + this.list.length, true);
                } else {
                    this.principalComponent.showMsg(
                        'info',
                        'Información',
                        'El Producto ya esta en la Lista'
                    );
                }
            }
        } else {
            this.VerLista = false;
            this.producto = Producto;
            if (this.InfoProducto.vendido) {
                Swal.fire(
                    'ARTICULO VENDIDO',
                    'Hay una venta con este artículo',
                    'warning'
                );
            } else {
                this.add($element);
                focusById('Cantidad' + this.list.length, true);
            }
        }
        this.SumarArreglo();
    }

    createItem() {
        return this.fb.group({
            id: [this.producto.id, Validators.required],
            codContable: [this.producto.codContable],
            descripcion: [this.producto.descripcion],
            existencia: [this.producto.existencia],
            cantidad: [
                null,
                [Validators.required, Validators.min(0), Validators.max(999)],
            ],
            fecha: [this.date3],
            precio: [this.producto.precio],
            acredito: [false],
            traslado: [false],
            cliente: [null],
            precioCompra: [this.producto.PrecioCompra],
            idCC: [this.producto.idCC],
        });
    }

    buildForm() {
        const date = dateToISOString(addDays(new Date(), -1));
        this.plantilla = this.fb.group({
            id: null,
            codContable: null,
            descripcion: null,
            cantidad: null,
            fecha: date,
            precio: null,
            acredito: false,
            traslado: false,
            cliente: null,
            precioCompra: null,
        });
        this.ventas = this.fb.group({
            lista: this.fb.array([]),
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
            this.utilService.confirm(
                '¿Desea eliminar los Productos Ingresado? ',
                (res) => {
                    if (res) {
                        this.cleanArray();
                    }
                }
            );
        } else {
            this.cleanArray();
        }
    }
    cleanArray() {
        while (this.list.length > 0) {
            this.BorrarItem(this.list.length - 1);
        }
        this.clear();
    }

    BorrarItem(index: number) {
        this.list.removeAt(index);
    }

    delItem(index: number) {
        this.utilService.confirm('¿Desea eliminar el Producto? ', (res) => {
            if (res) {
                this.BorrarItem(index);
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
        this.ComprobarSiHayVentas(this.stationCode, this.date3);
    }

    ComprobarSiHayVentas(idestacion: number, fecha: Date) {
        this.nominaService.GetVentastoday(idestacion, fecha).subscribe(
            (data) => {
                // console.log('entro a data[0].repuesta', data[0].repuesta);
                if (data[0].repuesta === 'true') {
                    this.VentaRegistrada = true;
                } else {
                    this.VentaRegistrada = false;
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }

    save() {
        const fecha = this.date3.toLocaleDateString();
        this.utilService.confirm(
            'La fecha del registro es  ' + fecha + ' ¿Desea Continuar?',
            (res) => {
                if (!res) {
                    return;
                } else {
                    const rawData = this.list.value;
                    console.log(rawData);
                    // tslint:disable-next-line: forin
                    for (const index in rawData) {
                        this.ProductosVendidos.FechaV = this.date3;
                        this.ProductosVendidos.IdEstacionV = this.stationCode;
                        this.ProductosVendidos.idProductoV = rawData[index].id;
                        this.ProductosVendidos.ventasV =
                            rawData[index].cantidad;
                        this.ProductosVendidos.PrecioV = rawData[index].precio;
                        this.ProductosVendidos.credito =
                            rawData[index].acredito;
                        this.ProductosVendidos.traslado =
                            rawData[index].traslado;
                        this.ProductosVendidos.cliente = rawData[index].cliente;

                        this.ProductosVendidos.PrecioCompra =
                            rawData[index].precioCompra;
                        this.ProductosVendidos.idCC = rawData[index].idCC;
                        this.nominaService
                            .InserVentas(this.ProductosVendidos)
                            .subscribe(
                                (data) => {
                                    this.principalComponent.showMsg(
                                        'success',
                                        'Éxito',
                                        'Todas las Ventas fueron Registradas'
                                    );
                                    this.cleanArray();
                                },
                                (error) => {
                                    this.contadorErrores += 1;
                                    this.principalComponent.showMsg(
                                        'error',
                                        'NO SE GUARDÓ ',
                                        error.error.message
                                    );
                                }
                            );
                    }
                }
            }
        );
    }

    RealizarDescuento(producto: any, pos, boton: any) {
        const Productos = {
            id: this.producto.id,
            codContable: this.producto.codContable,
            descripcion: this.producto.descripcion,
            cantidad: null,
            fecha: this.date3,
            precio: this.producto.precio,
            detalles: null,
            descuento: null,
            total: null,
            idEstacion: this.stationSel.idEstacion,
        };
        this.Obj = boton;
        this.VerFormDescuento = true;
        this.ProductoEnviado = [];
        this.ProductoEnviado.push(Productos);
    }

    DescuentoRealizado(producto: any) {
        this.VerFormDescuento = false;
    }
    BotonBlock(boton) {
        boton.setAttribute('disabled', true);
    }
    Mensaje() {
        this.principalComponent.showMsg('error', 'Mensaje', 'detalle');
    }
    // async  Guardar2(idEstacion, idProducto, Producto, $element) {
    //     await this.InfoProducto  =  this.ObtenerInfo(idEstacion, idProducto);
    //     await this.AgregarElArticulo(Producto, $element);
    //     console.log('final');
    // }
    // ObtenerInfo(idEstacion, idProducto) {
    //     this.nominaService.getinfoArtSale(idEstacion, idProducto, this.date3).subscribe(data => {
    //         console.log('1:', this.InfoProducto);
    //         return  data[0];
    //     }, error => {
    //         console.log(error);
    //     });
    // }
    // AgregarElArticulo(Producto, $element) {
    //     console.log('2:', this.InfoProducto);

    //     if (this.list !== undefined) {
    //         const listRaw = this.list.value;
    //         const found = listRaw.find(element => element.id === Producto.id);
    //         if (found === undefined) {
    //             this.VerLista = false;
    //             this.producto = Producto;
    //             this.add($element);
    //             focusById('Cantidad' + this.list.length, true);
    //         } else {
    //             console.log(found.acredito);
    //             if (found.acredito) {
    //                 this.VerLista = false;
    //                 this.producto = Producto;
    //                 this.add($element);
    //                 focusById('Cantidad' + this.list.length, true);
    //             } else {
    //                 this.principalComponent.showMsg('info', 'Información', 'El Producto ya esta en la Lista');
    //             }

    //         }
    //     } else {
    //         this.VerLista = false;
    //         this.producto = Producto;
    //         console.log('3:', this.InfoProducto);
    //         if (this.InfoProducto.Vendido) {
    //             Swal.fire(
    //                 'ARTICULO VENDIDO',
    //                 'Hay una venta con este artículo',
    //                 'warning'
    //             );
    //         } else {
    //             this.add($element);
    //             focusById('Cantidad' + this.list.length, true);
    //         }
    //     }
    // }

    SumarArreglo() {
        this.totalVenta = 0;
        const listRaw = this.list.value;
        listRaw.forEach((element) => {
            this.totalCantidadP += element.cantidad;
            this.totalVenta += element.cantidad * element.precio;
        });
    }
}
