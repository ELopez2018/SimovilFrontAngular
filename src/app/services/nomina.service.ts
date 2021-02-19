import { EntClient } from './../Class/EntClient';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntStation, articulo_estacion } from '../Class/EntStation';
import { Observable } from 'rxjs';
import { Parametros } from '../Class/Parametros';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { EntEmployee } from '../Class/EntEmployee';
import { EmployeeFormTurn } from '../Class/EmployeeForm';
import { EducationLevel } from '../Class/EntEducationLevel';
import { EntRelationship } from '../Class/EntRelationship';
import { EntPosition } from '../Class/EntPosition';
import { EntEmployeeBiometric } from '../Class/EntEmployeeBiometric';
import { StorageService } from './storage.service';
import { EntEmployeeNoveltyType } from '../Class/EntEmployeeNoveltyType';
import { EntAdministrator } from '../Class/EntAdministrator';
import { EntEmployeeNovelty } from '../Class/EntEmployeeNovelty';
import { EntDisability } from '../Class/EntDisability';
import { EntDisabilityNovelty } from '../Class/EntDisabilityNovelty';
import { EntFiled } from '../Class/EntFiled';
import { EntDisabilityPayment } from '../Class/EntDisabilityPayment';
import { EntPermission } from '../Class/EntPermission';
import { EntIsland } from '../Class/EntIsland';
import { EntPump } from '../Class/EntPump';
import { EntHose } from '../Class/EntHose';
import { OrderParametersToGet } from '../util/util-lib';
import { EntProductos } from '../Class/EntProductos';
import { EntVentasProductos } from '../Class/EntVentaProducto';
import { EntProductoInvEstacion } from '../Class/EntProductoInvEstacion';
import { EntCompraProductos } from '../Class/EntCompraProducto';
import { EntProductosSoliciBaja } from '../Class/EntProductosSoliciBaja';
import { EntProductosConsolidado } from '../Class/EntProductosConsolidado';
import { SelectItem } from 'primeng/api';
import { EntProductosTraslados } from '../Class/EnProductosTraslados';
import { EntCplLecturasIniciales } from '../Class/EntCplLecturasIniciales';
import { EntCplMangueras } from '../Class/EntCplMangueras';
import { EntConsolidadoenPesos } from '../Class/EntConsolidadoenPesos';
import { EntAdtvaDatosEstaciones } from '../Class/EntAdtvaDatosEstaciones';
import { EntVentasEdit } from '../Class/EntVentasEdit';
import { EntSaldosIniciales } from '../Class/EntSaldosIniciales';
import { EstadoDeCuentasModel } from '../Class/EstadoDeCuentas.Model';
import { EntCodigoContable } from '../Class/EntCodigosContables';
import { EntClasificacionInvoice } from '../Class/EntClasificacionInvoice';


@Injectable()
export class NominaService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    public setHttpOption() {
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
        };
    }
    // tslint:disable-next-line: member-ordering
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
    };

    // APIS PARA EL CPL
    // Obtiene las LETURAS INICIALES  PARA CADA TURNO
    public getLectInicial(idEstacion: number, Fecha: Date, Turno: Number): Observable<EntCplLecturasIniciales[]> {
        const query = '/api/getLectInicial';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [Fecha, 'Fecha'],
            [Turno, 'Turno']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCplLecturasIniciales[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetClientCredit Realizado con éxito')));
    }
    // OBTIENE LAS LECTURAS
    public getCplLecturas(idEstacion: number, Fecha: Date, Turno?: Number, Isla?: Number): Observable<EntCplLecturasIniciales[]> {
        const query = '/api/getCplLecturas';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [Fecha, 'fecha'],
            [Turno, 'turno'],
            [Isla, 'isla']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCplLecturasIniciales[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetClientCredit Realizado con éxito')));
    }

    public getCplMangueras(idEstacion: number): Observable<EntCplMangueras[]> {
        const query = '/api/getCplMangueras';
        const parameters = [
            [idEstacion, 'idEstacion']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCplMangueras[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('getCplMangueras Realizado con éxito')));
    }

    // Actualiza las Lecturas
    public updateCplLect(Lecturas: EntCplLecturasIniciales): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/InserCplLect', JSON.stringify(Lecturas), this.httpOptions).pipe(
            tap(_ => console.log('Lectura Actualizado Correctamente'))
        );
    }
    // Actualiza los precion en cada Manguera
    public updateCplPrecio(Lecturas: any): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/updateCplPrecio', JSON.stringify(Lecturas), this.httpOptions).pipe(
            tap(_ => console.log('Precio de la Manguera Actualizado Correctamente'))
        );
    }
    public UpdateCplPrecioGroup(Precios: any): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/UpdateCplPrecioGroup', JSON.stringify(Precios), this.httpOptions).pipe(
            tap(_ => console.log('Precio de las Mangueras Actualizado Correctamente'))
        );
    }

    public EnviaRepuestaTraslado(datos: any): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/sendRespTrasl', JSON.stringify(datos), this.httpOptions).pipe(
            tap(_ => console.log('EnviaRepuestaTraslado Correctamente'))
        );
    }

    public getTurnos(idEstacion: number): Observable<any[]> {
        const query = '/api/getCplTurnos';
        const parameters = [
            [idEstacion, 'idEstacion']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetClientCredit Realizado con éxito')));
    }
    // Insertar Lecturas del CPL
    public InsertCpl(Lecturas: any): Observable<EntCplLecturasIniciales> {
        return this.http.post<EntCplLecturasIniciales>(Parametros.GetParametros().servidorLocal + '/api/InserCplLect', JSON.stringify(Lecturas), this.httpOptions).pipe(
            tap(educationLevel => console.log('InserProductos Realizado con éxito'))
        );
    }

    public InsertDescuento(Descuento: any): Observable<any> {
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/productosdescuento', JSON.stringify(Descuento), this.httpOptions).pipe(
            tap(datos => console.log('InsertDescuento Realizado con éxito', datos))
        );
    }

    public GetClientCredit(credito: boolean): Observable<EntClient[]> {
        const query = '/api/GetClientCredit';
        const parameters = [
            [credito, 'credito']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntClient[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetClientCredit Realizado con éxito')));
    }

   /* public getClientesConSaldosIniciales(codCliente?: number, nombre?: string): Observable<EntClient[]>{
        const query = '/api/getClientesConSaldosIniciales';
        const parameters = [
            [codCliente, 'codCliente'],
            [nombre, 'nombre']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntClient[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('getClientesConSaldosIniciales realizado con éxito')));
    }*/

    public GetStations(station?: number, name?: string): Observable<EntStation[]> {
        const query = '/api/station';
        const parameters = [
            [station, 'station'],
            [name, 'name']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntStation[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => data.forEach(e => {
                e.articulos = e.articulos ? JSON.parse(String(e.articulos)) : null;
                e.islas = e.islas ? JSON.parse(String(e.islas)) : null;
                // e.islas = e.islas.filter(r => r.ID != null).map(t=> t.SURTIDOR = t.SURTIDOR.filter(y=> y.ID != null))
                if (e.islas && e.islas.length > 0) {
                    e.islas.forEach(i => {
                        i.SURTIDOR = i.SURTIDOR.filter(s => s.ID != null);
                        i.SURTIDOR.forEach(s => s.MANGUERA = s.MANGUERA.filter(m => m.ID != null));
                    });
                }
            }))
        );
    }


    public GetVentasEdit(idEstacion: number, Fecha: Date): Observable<EntVentasEdit[]> {
        const query = '/api/GetVentasEdit';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [Fecha, 'Fecha']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntVentasEdit[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetDatosEstaLubri'))
        );
    }

    public GetDatosEstaLubri(): Observable<EntAdtvaDatosEstaciones[]> {
        const query = '/api/GetDatosEstaLubri';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntAdtvaDatosEstaciones[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions)
            .pipe(
                map(data => {
                    let Tabla = [];
                    data.forEach(elemento => {
                        if (elemento.ventaBruta !== null) {
                            Tabla.push(elemento);
                        }
                    })
                    return Tabla;
                })
            );
    }
    public GetDatosCplAdtiva(): Observable<EntAdtvaDatosEstaciones[]> {
        const query = '/api/GetDatosCplAdtiva';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntAdtvaDatosEstaciones[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions)
        // .pipe(
        //     map(data => {
        //         let Tabla =[];
        //         data.forEach(elemento => {
        //             if (elemento.ventaBruta !== null) {
        //             Tabla.push(elemento);
        //             }
        //         })
        //         return Tabla;
        //     })
        // );
    }

    public GetEducationLevel(): Observable<EducationLevel[]> {
        return this.http.get<EducationLevel[]>(Parametros.GetParametros().servidorLocal + '/api/educationlevel', this.httpOptions).pipe(
            tap(educationLevel => console.log('GetEducationLevel: Realizado con éxito'))
        );
    }

    public GetRelationship(): Observable<EntRelationship[]> {
        return this.http.get<EntRelationship[]>(Parametros.GetParametros().servidorLocal + '/api/relationship', this.httpOptions).pipe(
            tap(educationLevel => console.log('GetRelationship: Realizado con éxito'))
        );
    }
    // Obtiene los productos por Estacion
    public GetProductosConsolidado(IdEstacion?: number, Fecha?: Date): Observable<EntProductosConsolidado[]> {
        const query = '/api/getProductConsolidado';
        const parameters = [
            [IdEstacion, 'IdEstacion'],
            [Fecha, 'Fecha'],
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductosConsolidado[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }
    public GetProductosConsolidadoPesos(idEstacion?: number, fecha?: Date): Observable<EntConsolidadoenPesos[]> {
        const query = '/api/getProductConsolidadoPesos';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [fecha, 'fecha']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntConsolidadoenPesos[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }


    // Guarda Imagenes de Productos
    public InsertImage(archivo: any): Observable<any> {
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/imgProducto', JSON.stringify(archivo), this.httpOptions).pipe(
            tap((res) => {
                console.log('InsertImage: Realizado con éxito');
            })
        );
    }

    // Inserta Solicitudes de Bajas de Productos
    public InsertSolicitudBajaProductos(Solicitud: EntProductosSoliciBaja): Observable<EntProductosSoliciBaja> {
        return this.http.post<EntProductosSoliciBaja>(Parametros.GetParametros().servidorLocal + '/api/InsertProdSolicBaja', JSON.stringify(Solicitud), this.httpOptions).pipe(
            tap(educationLevel => console.log('InsertSolicitudBajaProductos Realizado con éxito'))
        );
    }
    // Aprobacion de Solicitudes de  bajas de Productos

    public UpdateSolicitudBajaProductos(aprobacion: any): Observable<any> {
        return this.http.post<EntProductosSoliciBaja>(Parametros.GetParametros().servidorLocal + '/api/aprobacionbajaproductos', JSON.stringify(aprobacion), this.httpOptions).pipe(
            tap(educationLevel => console.log('UpdateSolicitudBajaProductos Realizado con éxito'))
        );
    }


    // Obtiene los productos por Estacion
    public GetProductos(IdEstacion?: number, busqueda?: string, fecha?: Date, idProducto?: number): Observable<EntProductos[]> {
        const query = '/api/productos';
        const parameters = [
            [IdEstacion, 'IdEstacion'],
            [busqueda, 'busqueda'],
            [idProducto, 'idProducto'],
            [fecha, 'fecha']
        ];
        console.log(parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductos[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap((res) => {
                    console.log('GetProductos exitoso Reg: ' +  res.length);
            }));
    }

    public GetProducto(id: number): Observable<EntProductos[]> {
        const query = '/api/getproducto';
        const parameters = [
            [id, 'id'],
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductos[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }
    /// CODIGOS cONTABLES
    public GetCodigosContables(idEstacion?: number): Observable<EntCodigoContable[]> {
        const query = '/api/codigosContables';
        const parameters = [
            [idEstacion, 'idEstacion'],
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCodigoContable[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions)
            .pipe(
                tap(resp => {
                    resp.map(e => {
                        e.Codigos != null ? e.Codigos = JSON.parse(String(e.Codigos)) : null;
                        e.TodosCodigos != null ? e.TodosCodigos = JSON.parse(String(e.TodosCodigos)) : null;
                    })
                })
            );
    }

    public InsertCodigoConta(codigos: any): Observable<any> {
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/codigosContables', JSON.stringify(codigos), this.httpOptions).pipe(
            tap(InsertCodigoConta => console.log('InserVentas Realizado con éxito'))
        );
    }

    // Obtiene los productos por traslados por Estacion
    public GetProductosTraslados(IdEstacion?: number): Observable<EntProductosTraslados[]> {
        const query = '/api/InTrasladosproductos';
        const parameters = [
            [IdEstacion, 'IdEstacion']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductosTraslados[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // Obtiene los productos por Estacion
    public GetProductostostation(IdEstacion?: number, busqueda?: string): Observable<EntProductos[]> {
        const query = '/api/GetProductostostation';
        const parameters = [
            [IdEstacion, 'IdEstacion'],
            [busqueda, 'busqueda']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductos[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // comprobar si existe ventas el dia
    public GetVentastoday(IdEstacion?: number, Fecha?: Date): Observable<boolean> {
        const query = '/api/GetVentastoday';
        const parameters = [
            [IdEstacion, 'IdEstacion'],
            [Fecha, 'Fecha']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<boolean>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }


    // Obtiene las Categorias
    public GetCategorias(): Observable<SelectItem[]> {
        const query = '/api/GetCategorias';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<SelectItem[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // Obtiene las Categorias
    public GetTiposImpuestos(): Observable<SelectItem[]> {
        const query = '/api/getTaxTypes';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<SelectItem[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            // tap(resp => console.log(resp)),
            map(resp => {
                let data = [];
                resp.forEach((item: any) => {
                    data.push(
                        {
                            id: item.id,
                            text: item.nombre + ' ( ' + (item.valor * 100) + '% )',
                            valor: item.valor,
                            formaPago: item.idFormaPago
                        }
                    );
                });

                return data;
            })
        );
    }

    public GetEmpresas(): Observable<SelectItem[]> {
        const query = '/api/empresas';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<SelectItem[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }
    // Obtiene Datos Grafico home de Canstilla
    public GetProductosDatosGrafVentas(idEstacion: number, fecha?: Date, meses?: number): Observable<any[]> {
        const query = '/api/GetdatChart';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [fecha, 'fecha'],
            [meses, 'meses']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // Obtiene Datos Grafico home de CPL
    public getCplDatosGraf(idEstacion: number, FechaIni?: Date, FechaFin?: Date, Rango?: number): Observable<any[]> {
        const query = '/api/getCplDatosGraf';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [FechaIni, 'FechaIni'],
            [FechaFin, 'FechaFin'],
            [Rango, 'Rango']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }


    // Insertando Ventas
    public InserVentas(Venta: EntVentasProductos): Observable<EntVentasProductos> {
        console.log('Venta:...'+JSON.stringify(Venta));
        return this.http.post<EntVentasProductos>(Parametros.GetParametros().servidorLocal + '/api/InsertVentaProdutosInventario', JSON.stringify(Venta), this.httpOptions).pipe(
            tap(educationLevel => console.log('InserVentas Realizado con éxito'))
            // catchError(this.handleError<EntEmployee>('GetUsuario'))

        );
    }
    // Actualizando Ventas
    public UpdateSalesProd(VentaEditada: EntVentasEdit): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/updSlesProd', JSON.stringify(VentaEditada), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }
    // Borrando Una Venta
    public DeleteVenta(idVenta: number): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/productoVenta/' + idVenta, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }
    // Informacion del Articulo
    public getinfoArtSale(idEstacion: number, idProducto: number, fecha: Date): Observable<any[]> {
        const query = '/api/getinfoArtSale';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [fecha, 'fecha'],
            [idProducto, 'idProducto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // Insertando Traslados
    public traslados(traslado: EntProductosTraslados): Observable<EntProductosTraslados> {
        return this.http.post<EntProductosTraslados>(Parametros.GetParametros()
            .servidorLocal + '/api/productotraslados', JSON.stringify(traslado), this.httpOptions)
            .pipe(
                tap(educationLevel => console.log('traslados Realizado con éxito'))
                // catchError(this.handleError<EntEmployee>('GetUsuario'))
            );
    }

    // Insertar Productos
    public InserProductos(Producto: EntProductos): Observable<EntProductos> {
        return this.http.post<EntProductos>(Parametros.GetParametros().servidorLocal + '/api/InserProducto', JSON.stringify(Producto), this.httpOptions).pipe(
            tap(educationLevel => console.log('InserProductos Realizado con éxito'))
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }


    // Actualizando Productos
    public UpdateProd(producto: EntProductos): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/updProd', JSON.stringify(producto), this.httpOptions).pipe(
            tap(resp => console.log('Producto Actualizado Correctamente'))
        );
    }



    // Insertar Productos en el Inventario de la Estacion
    public InserProductosInvEstacion(Producto: EntProductoInvEstacion): Observable<EntProductoInvEstacion> {
        return this.http.post<EntProductoInvEstacion>(Parametros.GetParametros().servidorLocal + '/api/InserInvEstaciones', JSON.stringify(Producto), this.httpOptions).pipe(
            tap(educationLevel => console.log('InserProductosInvEstacion: Realizado con éxito'))
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    // Agregar Existencia al Inventario
    public InserExistenciaInvEstacion(CompraProducto: EntCompraProductos): Observable<EntCompraProductos> {
        return this.http.post<EntCompraProductos>(Parametros.GetParametros().servidorLocal + '/api/InserExistenciaInvEstaciones', JSON.stringify(CompraProducto), this.httpOptions).pipe(
            tap(educationLevel => console.log('InserProductosInvEstacion: Realizado con éxito'))
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    // Borra Productos en el Inventario de la Estacion
    public DeleteProductosInvEstacion(idProducto: number, IdEstacion: number): Observable<any> {
        const Borrar = {
            'idEstacion': IdEstacion,
            'idProducto': idProducto
        };
        console.log(Borrar);
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/DeleteProdInvEstaciones', JSON.stringify(Borrar), this.httpOptions).pipe(
            tap(educationLevel => console.log('DeleteProductosInvEstacion: Realizado con éxito'))
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }
    // Obtiene las Solicitudes de Baja de Productos de las Estaciones
    public GetSolicitudes(IdEstacion?: number, Estado?: boolean): Observable<EntProductosSoliciBaja[]> {
        const query = '/api/GetSolicitudesBajas';
        const parameters = [
            [IdEstacion, 'IdEstacion'],
            [Estado, 'Estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProductosSoliciBaja[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    // Insertar Novedad
    public GetEmployeeNoveltyType(): Observable<EntEmployeeNoveltyType[]> {
        return this.http.get<EntEmployeeNoveltyType[]>(Parametros.GetParametros().servidorLocal + '/api/employeeNoveltyType', this.httpOptions).pipe(
            tap(educationLevel => console.log('Realizado con éxito'))
        );
    }

    public GetPosition(): Observable<EntPosition[]> {
        return this.http.get<EntPosition[]>(Parametros.GetParametros().servidorLocal + '/api/position', this.httpOptions).pipe(
            tap(educationLevel => console.log('Realizado con éxito'))
            // ,
            // catchError(this.handleError('GetEstaciones', []))
        );
    }

    public GetDisabilitiesPending(administradora?: number): Observable<EntDisability[]> {
        const query = '/api/disabilitiesPending';
        const parameters = [
            [administradora, 'administradora']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDisability[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(educationLevel => console.log('Realizado con éxito'))
            // ,
            // catchError(this.handleError('GetEstaciones', []))
        );
    }

    public createFileDisability(): Observable<any[]> {
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + '/api/createFileDisability', this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public UpdateAllDisability(status: boolean): Observable<any[]> {
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + '/api/disabilityUpdateAll?status=' + status, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public InsertNoveltyDisability(novelty: EntDisabilityNovelty): Observable<any> {
        const body = (JSON.stringify(novelty));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/noveltyDisability', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertDisabilityPayment(payment: EntDisabilityPayment): Observable<any> {
        const body = (JSON.stringify(payment));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/disabilityPayment', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }
    // OBTIENE LAS PAGOS
    public getPagosInca(): Observable<EntCplLecturasIniciales[]> {
        const query = '/api/getPagosInca';
        const parameters = [];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCplLecturasIniciales[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('getPagosInca Realizado con éxito')));
    }
    // Actualiza los Pagos
    public updPagoInca(pago: any): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/updPayDisab', JSON.stringify(pago), this.httpOptions).pipe(
            tap(_ => console.log('Precio de la Manguera Actualizado Correctamente'))
        );
    }

    public InsertEmployee(empleado: EntEmployee): Observable<EntEmployeeBiometric> {
        return this.http.post<EntEmployeeBiometric>(Parametros.GetParametros().servidorLocal + '/api/employee', JSON.stringify(empleado), this.httpOptions).pipe(
            tap((employee) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertStation(val: EntStation): Observable<EntStation> {
        const body = (JSON.stringify(val));
        return this.http.post<EntStation>(Parametros.GetParametros().servidorLocal + '/api/station', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertStationArticle(val: articulo_estacion[], station: number): Observable<articulo_estacion> {
        const body = (JSON.stringify({ article: val, station: station }));
        return this.http.post<articulo_estacion>(Parametros.GetParametros().servidorLocal + '/api/stationArticles', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertIsland(val: EntIsland): Observable<EntIsland> {
        const body = JSON.stringify(val);
        return this.http.post<EntIsland>(Parametros.GetParametros().servidorLocal + '/api/island', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertPump(val: EntPump): Observable<EntPump> {
        const body = JSON.stringify(val);
        return this.http.post<EntPump>(Parametros.GetParametros().servidorLocal + '/api/pump', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertHose(val: EntHose): Observable<EntHose> {
        const body = JSON.stringify(val);
        return this.http.post<EntHose>(Parametros.GetParametros().servidorLocal + '/api/hose', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertNovelty(employeeNovelty: EntEmployeeNovelty, dataNovelty): Observable<any> {
        const body = JSON.stringify({ novelty: employeeNovelty, dataNovelty: dataNovelty });
        return this.http.post<EntEmployeeNovelty>(Parametros.GetParametros().servidorLocal + '/api/employeeNovelty', body, this.httpOptions).pipe(
            tap((employee) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public AssignPermissions(permisos: EntPermission[], usuario: string): Observable<any> {
        const body = JSON.stringify({ permisos: permisos, usuario: usuario });
        return this.http.post<EntEmployeeNovelty>(Parametros.GetParametros().servidorLocal + '/api/assignPermissions', body, this.httpOptions).pipe(
            tap((result) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public GetEmployeeBiometric(cedula): Observable<EntEmployeeBiometric> {
        const consulta = cedula == null ? '/api/employeeBiometric' + cedula : '/api/employeeBiometric/?cedula=' + cedula;
        return this.http.get<EntEmployeeBiometric>(Parametros.GetParametros().servidorLocal + '/api/employeeBiometric/?cedula=' + cedula, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetEmployee(numDocumento, estado, estacion, exacto): Observable<EntEmployee[]> {
        const query = '/api/employee';
        const parameters = [
            [numDocumento, 'numDocumento'],
            [estacion, 'estacion'],
            [estado, 'estado'],
            [exacto, 'exacto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntEmployee[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetEmployeeNovelty(id?, tipo?, empleado?, fechaIni?, fechaFin?): Observable<EntEmployeeNovelty[]> {
        const query = '/api/employeeNovelty';
        const parameters = [
            [id, 'id'],
            [tipo, 'tipo'],
            [empleado, 'empleado'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntEmployeeNovelty[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetAdminsitrator(nit?, idAdministradora?, empleado?, tipo?, exacto = 1): Observable<EntAdministrator[]> {
        const query = '/api/administrators';
        const parameters = [
            [nit, 'nit'],
            [idAdministradora, 'idAdministradora'],
            [empleado, 'empleado'],
            [tipo, 'tipo'],
            [exacto, 'exacto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntAdministrator[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetFiled(idRadicado?, estado?, administradora?, fechaIni?, fechaFin?): Observable<EntFiled[]> {
        const query = '/api/filed';
        const parameters = [
            [idRadicado, 'idRadicado'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [estado, 'estado'],
            [administradora, 'administradora']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntFiled[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetDisability(id?, estado?, administradora?, empleado?, motivo?, estacion?, radicado?, radicar?: boolean): Observable<EntDisability[]> {
        const query = '/api/disability';
        const parameters = [
            [id, 'id'],
            [motivo, 'motivo'],
            [empleado, 'empleado'],
            [estacion, 'estacion'],
            [estado, 'estado'],
            [administradora, 'administradora'],
            [radicado, 'radicado'],
            [radicar, 'radicar']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDisability[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetDisabilityPayment(id?, administradora?, empleado?, fechaIni?, fechaFin?, incapacidad?): Observable<EntDisabilityPayment[]> {
        const query = '/api/disabilityPayment';
        const parameters = [
            [id, 'id'],
            [administradora, 'administradora'],
            [empleado, 'empleado'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [incapacidad, 'incapacidad']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDisabilityPayment[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public GetPermission(usuario?: string): Observable<EntPermission[]> {
        const query = '/api/permission';
        const parameters = [
            [usuario, 'usuario']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntPermission[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public GetPermissionBasic(perfil?: number): Observable<EntPermission[]> {
        const query = '/api/permissionBasic';
        const parameters = [
            [perfil, 'perfil']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntPermission[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
            //,catchError(this.handleError('GetEmployee',[]))
        );
    }

    public GetLogOrder(fIni: string, fEnd: string): Observable<any> {
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + '/api/logorder/?fIni=' + fIni + '&fEnd=' + fEnd, this.httpOptions);
    }

    public UpdateEmployee(employee: EntEmployee): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/employee/' + employee.numDocumento, JSON.stringify(employee), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdateStation(station: EntStation): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/station/' + station.idEstacion, JSON.stringify(station), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdateIsland(val: EntIsland): Observable<EntIsland> {
        return this.http.put<EntIsland>(Parametros.GetParametros().servidorLocal + '/api/island/' + val.ID, JSON.stringify(val), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdatePump(val: EntPump): Observable<EntPump> {
        return this.http.put<EntPump>(Parametros.GetParametros().servidorLocal + '/api/pump/' + val.ID, JSON.stringify(val), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdateHose(val: EntHose): Observable<EntHose> {
        return this.http.put<EntHose>(Parametros.GetParametros().servidorLocal + '/api/hose/' + val.ID, JSON.stringify(val), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdateDisability(disability: EntDisability): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/disability/' + disability.id, JSON.stringify(disability), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public UpdateFiled(filed: EntFiled): Observable<any> {
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/filed/' + filed.idRadicado, JSON.stringify(filed), this.httpOptions).pipe(
            tap(_ => console.log('Actualizado Correctamente'))
        );
    }

    public DeleteEmployee(employee: EntEmployee): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/employee/' + employee.numDocumento, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteStation(station: EntStation): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/station/' + station.idEstacion, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteIsland(val: EntIsland): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/island/' + val.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeletePump(val: EntPump): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/pump/' + val.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteHose(val: EntHose): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/hose/' + val.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            //this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    public CrearSaldosIniciales(Saldosiniciales: EntSaldosIniciales): Observable<any> {
        const body = JSON.stringify(Saldosiniciales);
        return this.http.post<EntSaldosIniciales>(Parametros.GetParametros().servidorLocal + '/api/saldoInicial', body, this.httpOptions).pipe(
            tap((result) => {
                console.log('Realizado con éxito');
            })
        );
    }
    public GetEstadoCuentas(idEstacion: number, codCliente: number, fechaIni: string, fechaFin: string): Observable<EstadoDeCuentasModel[]> {
        const query = '/api/statusAccount';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [codCliente, 'codCliente'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EstadoDeCuentasModel[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            map(resp => {
                resp.map((e: any) => {
                    e.CONSUMOS != null ? e.CONSUMOS = JSON.parse(String(e.CONSUMOS)) : null;
                    e.DESCUENTOS != null ? e.DESCUENTOS = JSON.parse(String(e.DESCUENTOS)) : null;
                    e.PAGOS != null ? e.PAGOS = JSON.parse(String(e.PAGOS)) : null;
                    e.RETENCIONES != null ? e.RETENCIONES = JSON.parse(String(e.RETENCIONES)) : null;
                });
                return resp;
            })
        );
    }

    public GetClasificacionInvoice(): Observable<EntClasificacionInvoice[]> {
        const query = '/api/invoiceclassification';
        return this.http.get<EntClasificacionInvoice[]>(Parametros.GetParametros().servidorLocal + query , this.httpOptions).pipe(
            // tap(data => console.log('clasificaciones de Facturas'))
        );
    }
}
