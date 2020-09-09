import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Parametros } from '../Class/Parametros';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { EntDocumentType } from '../Class/EntDocumentType';
import { EntClient } from '../Class/EntClient';
import { EntDepartament } from '../Class/EntDepartament';
import { EntCity } from '../Class/EntCity';
import { EntQuotaType } from '../Class/EntQuotaType';
import { EntQuota } from '../Class/EntQuota';
import { EntVehicle } from '../Class/EntVehicle';
import { EntTask } from '../Class/EntTask';
import { EntReceivable } from '../Class/EntReceivable';
import { EntPayment } from '../Class/EntPayment';
import { EntConsumptionClient } from '../Class/EntConsumptionClient';
import { EntOrder } from '../Class/EntOrder';
import { EntOrderDetail } from '../Class/EntOrderDetail';
import { EntCityStation } from '../Class/EntCityStation';
import { EntIdentifier } from '../Class/EntIdentifier';
import { EntBasicClient } from '../Class/EntBasicClient';
import { EntHomeClient } from '../Class/EntHomeClient';
import { EntUserDB } from '../Class/EntUserDB';
import { EntProfile } from '../Class/EntProfile';
import { EntHomeStation } from '../Class/EntHomeStation';
import { EntCompany } from '../Class/EntCompany';
import { EntBank } from '../Class/EntBank';
import { EntInvoice } from '../Class/EntInvoice';
import { EntProvider } from '../Class/EntProvider';
import { EntNoveltyInvoice } from '../Class/EntNoveltyInvoice';
import { EntAdvance } from '../Class/EntAdvance';
import { EntNoveltyAdvance } from '../Class/EntNoveltyAdvance';
import { EntRole } from '../Class/EntRole';
import { EntOption } from '../Class/EntOption';
import { EntSalesTurn } from '../Class/EntSalesTurn';
import { EntArticle } from '../Class/EntArticle';
import { EntHose } from '../Class/EntHose';
import { EntCPL } from '../Class/EntCPL';
import { EntDailySheet } from '../Class/EntDailySheet';
import { EntStationCode } from '../Class/EntStationCodeResponsability';
import { EntStationType } from '../Class/EntStationType';
import { OrderParametersToGet } from '../util/util-lib';
import { ICarteraForStation, IRPTStationTurnLiq } from '../Class/iRPT';
import { EntArticleType } from '../Class/EntArticleType';
import { EntDiscount } from '../Class/EntDiscount';
import { EntPlant } from '../Class/EntPlant';
import { EntCalibration } from '../Class/EntCalibration';
import { EntTank } from '../Class/EntTank';
import { EntTankReading } from '../Class/EntTankReading';
import { EntFuelUnload } from '../Class/EntFuelUnload';
import { EntGasReading } from '../Class/EntGasReading';
import { EntDailyAttachedType } from '../Class/EntDailySheetAttachedType';
import { EntReturn } from '../Class/EntReturn';
import { EntFuelTransfer } from '../Class/EntFuelTransfer';
import { EntTicketVenta } from '../Class/EntTicketVenta';
import { EntConsumo } from '../Class/EntConsumo';
import { AnyAaaaRecord } from 'dns';
import { TaxesModel } from '../Class/Taxes.model';

@Injectable()
export class CarteraService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
    };

    public getDocumentType(): Observable<EntDocumentType[]> {
        return this.http.get<EntDocumentType[]>(Parametros.GetParametros().servidorLocal + '/api/documentType', this.httpOptions).pipe(
            tap(documentTypes => console.log('Realizado con éxito'))
        );
    }

    public getStationType(): Observable<EntStationType[]> {
        return this.http.get<EntStationType[]>(Parametros.GetParametros().servidorLocal + '/api/stationType', this.httpOptions).pipe(
            tap(types => console.log('Realizado con éxito'))
        );
    }

    public getPlant(): Observable<EntPlant[]> {
        return this.http.get<EntPlant[]>(Parametros.GetParametros().servidorLocal + '/api/plant', this.httpOptions).pipe(
            tap(types => console.log('Realizado con éxito'))
        );
    }

    public getBank(): Observable<EntBank[]> {
        return this.http.get<EntBank[]>(Parametros.GetParametros().servidorLocal + '/api/bank', this.httpOptions);
    }
    public getCompany(nit?: number): Observable<EntCompany[]> {
        const query = '/api/company2';
        const parameters = [
            [nit, 'nit']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCompany[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public getDepartament(pais): Observable<EntDepartament[]> {
        return this.http.get<EntDepartament[]>(Parametros.GetParametros().servidorLocal + '/api/departament/?pais=' + pais, this.httpOptions).pipe(
            tap(departaments => console.log('getDepartament Realizado con éxito'))
        );
    }

    public getCodeStation(station: number, code: string): Observable<EntStationCode[]> {
        const query = '/api/codeInsertDailySheet';
        const parameters = [
            [station, 'station'],
            [code, 'code']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntStationCode[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(el => console.log('getCodeStation Realizado con éxito'))
        );
    }

    public getUnpaidInvoices(): Observable<EntInvoice[]> {
        return this.http.get<EntInvoice[]>(Parametros.GetParametros().servidorLocal + '/api/unpaidInvoices/', this.httpOptions).pipe(
            tap(result => console.log(' getUnpaidInvoices Realizado con éxito'))
        );
    }

    public getAttachedTypes(): Observable<EntDailyAttachedType[]> {
        return this.http.get<EntDailyAttachedType[]>(Parametros.GetParametros().servidorLocal + '/api/attachedType/', this.httpOptions).pipe(
            tap(result => console.log('getAttachedTypes Realizado con éxito'))
        );
    }

    public getArticles(): Observable<EntArticle[]> {
        return this.http.get<EntArticle[]>(Parametros.GetParametros().servidorLocal + '/api/article/', this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public getArticleTypes(): Observable<EntArticleType[]> {
        return this.http.get<EntArticleType[]>(Parametros.GetParametros().servidorLocal + '/api/articleType/', this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public getArticleTypes2(station?: number, type?: string): Observable<EntArticleType[]> {
        const query = '/api/articleType2';
        const parameters = [
            [station, 'station'],
            [type, 'type']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntArticleType[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public GetCarteraForStation(station: number, date: string, dateEnd: string, option: string, type: string, month: boolean): Observable<ICarteraForStation[]> {
        const query = '/api/carteraForStation';
        const parameters = [
            [station, 'station'],
            [date, 'date'],
            [dateEnd, 'dateEnd'],
            [option, 'option'],
            [type, 'type'],
            [month, 'month']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<ICarteraForStation[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('GetCarteraForStation Realizado con éxito')),
            catchError(this.handleError('getUser', []))
        );
    }

    public GetFuelUnloadPending(station: number): Observable<EntFuelUnload[]> {
        const query = '/api/fuelUnloadPending';
        const parameters = [
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntFuelUnload[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getTank', []))
        );
    }

    public GetFuelTransferedUnloadPending(station: number): Observable<EntFuelTransfer[]> {
        const query = '/api/fuelTransferedUnloadPending';
        const parameters = [
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntFuelTransfer[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getTank', []))
        );
    }

    public GetTank(station: number, id?: number, type?: number): Observable<EntTank[]> {
        const query = '/api/tank';
        const parameters = [
            [id, 'id'],
            [station, 'station'],
            [type, 'type']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntTank[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getTank', []))
        );
    }

    public GetTankReading(station: number, date?: string, type?: number): Observable<EntTankReading[]> {
        const query = '/api/tankReading';
        const parameters = [
            [station, 'station'],
            [date, 'date'],
            [type, 'type']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntTankReading[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getTank', []))
        );
    }

    public GetGasReading(station: number, date?: string): Observable<EntGasReading[]> {
        const query = '/api/gasReading';
        const parameters = [
            [station, 'station'],
            [date, 'date']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntGasReading[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getGasReady', []))
        );
    }

    public GetRPTStationTurn(station: number, date: string, type: string): Observable<any[]> {
        const query = '/api/rptStationTurn';
        const parameters = [
            [station, 'station'],
            [date, 'date'],
            [type, 'type']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<ICarteraForStation[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('rptStationTurn', []))
        );
    }

    public GetUser(idUsuario: string, perfil: number, estado: boolean, exacto: boolean): Observable<EntUserDB[]> {
        const query = '/api/user';
        const parameters = [
            [idUsuario, 'idUsuario'],
            [perfil, 'perfil'],
            [estado, 'estado'],
            [exacto, 'exacto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntUserDB[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito')),
            catchError(this.handleError('getUser', []))
        );
    }

    public toEditDailySheet(station: number, type: string, date: string, status: boolean): Observable<any> {
        const query = '/api/setEditDailySheet';
        const parameters = [
            [station, 'station'],
            [type, 'type'],
            [date, 'date'],
            [status, 'status']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getProvider(idProveedor?: any, estado?: boolean, exacto: boolean = true, tipo?: number): Observable<EntProvider[]> {
        const query = '/api/provider';
        const parameters = [
            [idProveedor, 'idProveedor'],
            [tipo, 'tipo'],
            [estado, 'estado'],
            [exacto, 'exacto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProvider[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public GetRoles(id?: number, descripcion?: string, estado?: boolean): Observable<EntRole[]> {
        const query = '/api/role';
        const parameters = [
            [id, 'id'],
            [descripcion, 'descripcion'],
            [estado, 'estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntRole[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public GetProfiles(id?: number, descripcion?: string, rol?: number): Observable<EntProfile[]> {
        const query = '/api/profiles';
        const parameters = [
            [id, 'id'],
            [descripcion, 'descripcion'],
            [rol, 'rol']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntProfile[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public GetOptions(id?: number, descripcion?: string, estado?: boolean): Observable<EntOption[]> {
        const query = '/api/option';
        const parameters = [
            [id, 'id'],
            [descripcion, 'descripcion'],
            [estado, 'estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntOption[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(departaments => console.log('Realizado con éxito'))
        );
    }

    public getSalesTurn(estacion?: number, tipo?: string, temporal?: boolean, editado?: boolean, fechaIni?: string, fechaFin?: string): Observable<EntSalesTurn[]> {
        const query = '/api/salesTurn';
        const parameters = [
            [estacion, 'estacion'],
            [tipo, 'tipo'],
            [temporal, 'temporal'],
            [editado, 'editado'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntSalesTurn[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(e => console.log(e)),
            tap(result => {
                console.log('Realizado con éxito');
                result.map(e => {
                    e.DETALLE = JSON.parse(String(e.DETALLE));
                });
            }));
    }

    public getHose(station?: number): Observable<EntHose[]> {
        const query = '/api/hose';
        const parameters = [
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntHose[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public getCPL(station?: number, fecha?: string, fechaFin?: string): Observable<EntCPL[]> {
        const query = '/api/cpl';
        const parameters = [
            [station, 'ESTACION'],
            [fecha, 'FECHA'],
            [fechaFin, 'FECHAFIN']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntCPL[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('Realizado con éxito');
                result.map(e => {
                    e.DETALLE = JSON.parse(String(e.DETALLE));
                });
            }));
    }
    public getAcumAnticipo(idEstacion: number, fecha: Date): Observable<any> {
        const query = '/api/Anticipos';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [fecha, 'fecha']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }
    public getDailySheet(station?: number, tipo?: string, fecha?: string, fechaFin?: string, id: number = null, full: boolean = true): Observable<EntDailySheet[]> {
        const query = '/api/dailySheet';
        const parameters = [
            [station, 'ESTACION'],
            [tipo, 'TIPO'],
            [fecha, 'FECHA'],
            [fechaFin, 'FECHAFIN'],
            [id, 'ID'],
            [full, 'TODO']
        ];
        //console.log('parameters', parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDailySheet[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                result.map(e => {
                    e.DE_ACUM_ANTICIPOS != null ? e.DE_ACUM_ANTICIPOS = JSON.parse(String(e.DE_ACUM_ANTICIPOS))[0].Acumulado : null;
                    e.DE_OTROS_PAGOS != null ? e.DE_OTROS_PAGOS = JSON.parse(String(e.DE_OTROS_PAGOS)) : null;
                    e.DE_ANT_PROV != null ? e.DE_ANT_PROV = JSON.parse(String(e.DE_ANT_PROV)) : null;
                    e.PLA_DIA_PAG_CLI != null ? e.PLA_DIA_PAG_CLI = JSON.parse(String(e.PLA_DIA_PAG_CLI)) : null;
                    e.PLA_DIA_VEN_CLI != null ? e.PLA_DIA_VEN_CLI = JSON.parse(String(e.PLA_DIA_VEN_CLI)) : null;
                    e.PLA_DIA_PAG_CLI_DET != null ? e.PLA_DIA_PAG_CLI_DET = JSON.parse(String(e.PLA_DIA_PAG_CLI_DET)) : null;
                    e.PLA_DIA_VEN_CLI_DET != null ? e.PLA_DIA_VEN_CLI_DET = JSON.parse(String(e.PLA_DIA_VEN_CLI_DET)) : null;
                    e.PLA_DIA_PAG_PRO != null ? e.PLA_DIA_PAG_PRO = JSON.parse(String(e.PLA_DIA_PAG_PRO)) : null;
                    e.PLA_DIA_TUR != null ? e.PLA_DIA_TUR = JSON.parse(String(e.PLA_DIA_TUR)) : null;
                    e.PD_SOPORTE != null ? e.PD_SOPORTE = JSON.parse(String(e.PD_SOPORTE)) : null;
                });
            })
        );
    }

    public getDataToDailySheet(station?: number, tipo?: string, fecha?: string): Observable<EntDailySheet[]> {
        const query = '/api/dataToDailySheet';
        const parameters = [
            [station, 'ESTACION'],
            [tipo, 'TIPO'],
            [fecha, 'FECHA']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDailySheet[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('Realizado con éxito');
                // console.log(result);
                result.map(e => {
                    e.PLA_DIA_PAG_CLI != null ? e.PLA_DIA_PAG_CLI = JSON.parse(String(e.PLA_DIA_PAG_CLI)) : null;
                    e.PLA_DIA_VEN_CLI != null ? e.PLA_DIA_VEN_CLI = JSON.parse(String(e.PLA_DIA_VEN_CLI)) : null;
                    e.PLA_DIA_PAG_CLI_DET != null ? e.PLA_DIA_PAG_CLI_DET = JSON.parse(String(e.PLA_DIA_PAG_CLI_DET)) : null;
                    e.PLA_DIA_VEN_CLI_DET != null ? e.PLA_DIA_VEN_CLI_DET = JSON.parse(String(e.PLA_DIA_VEN_CLI_DET)) : null;
                    e.PLA_DIA_PAG_PRO != null ? e.PLA_DIA_PAG_PRO = JSON.parse(String(e.PLA_DIA_PAG_PRO)) : null;
                    e.PLA_DIA_TUR != null ? e.PLA_DIA_TUR = JSON.parse(String(e.PLA_DIA_TUR)) : null;
                });
            })
        );
    }

    public getDailySheetAcum(station?: number, tipo?: string, fecha?: string): Observable<EntDailySheet[]> {
        const query = '/api/dailySheetAcum';
        const parameters = [
            [station, 'ESTACION'],
            [tipo, 'TIPO'],
            [fecha, 'FECHA']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDailySheet[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                // console.log('getDailySheetAcum=>result ', result);
                result.map(e => {
                    e.PLA_DIA_TUR = JSON.parse(String(e.PLA_DIA_TUR));
                    if (e.PLA_DIA_TUR !== null) {
                        for (let i = 0; i < e.PLA_DIA_TUR.length; i++) {
                            e.PLA_DIA_TUR[i].PLA_DIA_TUR_VEN = JSON.parse(String(e.PLA_DIA_TUR[i].PLA_DIA_TUR_VEN));
                        }
                    }

                });
            })
        );
    }

    public getDailySheetBefore(station?: number, tipo?: string, fecha?: string): Observable<EntDailySheet[]> {
        const query = '/api/dailySheetBefore';
        const parameters = [
            [station, 'ESTACION'],
            [tipo, 'TIPO'],
            [fecha, 'FECHA']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDailySheet[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('Realizado con éxito');
            })
        );
    }

    public getReceivable(codClient: number, status: boolean, fechaIni, fechaFin, id, station): Observable<EntReceivable[]> {
        const query = '/api/receivable';
        const parameters = [
            [codClient, 'codClient'],
            [station, 'station'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [id, 'id'],
            [status, 'estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntReceivable[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public createReceivable(date: string, station: number): Observable<any[]> {
        const query = '/api/createReceivable';
        const parameters = [
            [date, 'date'],
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public createReceivableByClient(dateIni: string, dateEnd: string, codClient: number, station: number): Observable<any[]> {
        const query = '/api/createReceivablebyClient';
        const parameters = [
            [dateIni, 'dateIni'],
            [dateEnd, 'dateEnd'],
            [codClient, 'codClient'],
            [station, 'station']
        ];
        console.log(parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    public getReceivablePending(station: number): Observable<EntBasicClient[]> {
        const query = '/api/receivablePending';
        const parameters = [[station, 'station']];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntBasicClient[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public getInvoice(id: number, num?: number, proveedor?: number, fechaIni?, fechaFin?, status?, station?, aprox?: boolean, val?: number, novedad = true, historial = false, articulo = false): Observable<EntInvoice[]> {
        const query = '/api/invoice';
        const parameters = [
            [id, 'id'],
            [num, 'num'],
            [proveedor, 'proveedor'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [status, 'estado'],
            [station, 'station'],
            [aprox, 'aprox'],
            [val, 'val'],
            [novedad, 'novedad'],
            [historial, 'historial'],
            [articulo, 'articulo']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntInvoice[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('Realizado con éxito');
                result.map(e => {
                    e.novedadFactura != null ? e.novedadFactura = JSON.parse(String(e.novedadFactura)) : null;
                    e.articulos != null ? e.articulos = JSON.parse(String(e.articulos)) : null;
                });
            })
        );
    }

    public getWholeSalerInvoices(station: number, pending: boolean = true, pendingStation: boolean = true, date?: string, dateEnd?: string): Observable<EntInvoice[]> {
        const query = '/api/wholesalerInvoices';
        const parameters = [
            [station, 'station'],
            [pending, 'pending'],
            [pendingStation, 'pendingStation'],
            [date, 'date'],
            [dateEnd, 'dateEnd']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntInvoice[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('Realizado con éxito');
                result.map(e => {
                    e.pagos != null ? e.pagos = JSON.parse(String(e.pagos)) : null;
                });
            })
        );
    }

    public getInvoicesPending(rol: string, station?: number, id?: number, terminado?: boolean, novedad = true, historial = false): Observable<EntInvoice[]> {
        const query = '/api/invoicePending';
        const parameters = [
            [rol, 'rol'],
            [station, 'station'],
            [id, 'id'],
            [terminado, 'terminado'],
            [novedad, 'novedad'],
            [historial, 'historial']
        ];
        console.log(parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntInvoice[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => {
                console.log('getInvoicesPending Realizado con éxito');
                result.map(e => {
                    e.novedadFactura != null ? e.novedadFactura = JSON.parse(String(e.novedadFactura)) : null;
                });
            })
        );
    }


    public getAdvance(id: number, proveedor?: number, fechaIni?, fechaFin?, status?, factura?, idEstacion?): Observable<EntAdvance[]> {
        const query = '/api/advance';
        const parameters = [
            [id, 'id'],
            [proveedor, 'proveedor'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [status, 'estado'],
            [factura, 'factura'],
            [idEstacion, 'idEstacion']
        ];
        console.log(parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntAdvance[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(departaments => console.log('Realizado con éxito'))
        );
    }

    public getAdvancesPending(rol: string, id?: number): Observable<EntAdvance[]> {
        const query = '/api/advancePending';
        const parameters = [
            [rol, 'rol'],
            [id, 'id']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntAdvance[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(result => console.log('Realizado con éxito'))
        );
    }

    // public getProvider(nit?: number): Observable<EntProvider[]> {
    //   var query = '/api/provider';
    //   let parameters = [
    //     [nit, nit, "nit"]
    //   ];
    //   let consulta = OrderParametersToGet(query, parameters);
    //   return this.http.get<EntProvider[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
    //     tap(departaments => console.log("Realizado con éxito"))
    //   );
    // }

    // public getPayment(codClient: number, dateIni: string, dateFin: string, status: boolean): Observable<EntPayment[]> {
    //   var consulta = '/api/payment';
    //   var estadoNum = Number(status);
    //   consulta = (codClient != null) ? consulta + '/?codClient=' + codClient : consulta;
    //   consulta = (status != null) ? consulta + '/?estado=' + estadoNum : consulta;
    //   consulta = (status != null && codClient != null) ? '/api/payment/?estado=' + estadoNum + '&codCliente=' + codClient : consulta;
    //   return this.http.get<EntPayment[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
    //     tap(departaments => console.log("Realizado con éxito"))
    //   );
    // }

    public getPayment2(codClient, dateIni, dateFin, status: boolean, asignado?: boolean, planilla?: number): Observable<EntPayment[]> {
        const query = '/api/payment';
        const parameters = [
            [codClient, 'codClient'],
            [dateIni, 'fechaIni'],
            [dateFin, 'fechaFin'],
            [status, 'estado'],
            [asignado, 'asignado'],
            [planilla, 'planilla']
        ];
        console.log(parameters);
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntPayment[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(departaments => console.log('Realizado con éxito', departaments))
        );
    }

    public getBasicClient(): Observable<EntBasicClient[]> {
        return this.http.get<EntBasicClient[]>(Parametros.GetParametros().servidorLocal + '/api/basicClient', this.httpOptions);
    }

    public InsertFuelUnload(val: EntFuelUnload, transfered: boolean): Observable<any> {
        val['TRANSFERED'] = transfered;
        console.log(val);
        const body = JSON.stringify(val);
        return this.http.post<EntFuelUnload>(Parametros.GetParametros().servidorLocal + '/api/fuelUnload', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertFuelTranfer(val: EntFuelTransfer): Observable<any> {
        const body = JSON.stringify(val);
        return this.http.post<EntFuelUnload>(Parametros.GetParametros().servidorLocal + '/api/fuelTransfer', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertTankReading(val: EntTankReading[]): Observable<any> {
        const body = JSON.stringify(val);
        return this.http.post<EntTankReading[]>(Parametros.GetParametros().servidorLocal + '/api/tankReading', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertGasReading(val: EntGasReading): Observable<any> {
        const body = JSON.stringify(val);
        return this.http.post<EntGasReading>(Parametros.GetParametros().servidorLocal + '/api/gasReading', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertClient(client: EntClient): Observable<EntClient> {
        const body = (JSON.stringify(client));
        return this.http.post<EntClient>(Parametros.GetParametros().servidorLocal + '/api/client', body, this.httpOptions).pipe(
            tap((client) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertConsumption(station: number, consumptions: any): Observable<any> {
        const body = (JSON.stringify({ station: station, consumptions: consumptions }));
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/consumptionByStation', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertCalibration(structure): Observable<EntCalibration> {
        const body = JSON.stringify(structure);
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/calibration', body, this.httpOptions)
    }

    public InsertReturn(structure): Observable<EntReturn> {
        const body = JSON.stringify(structure);
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/returned', body, this.httpOptions)
    }

    public InsertProvider(provider: EntProvider): Observable<EntProvider> {
        const body = (JSON.stringify(provider));
        return this.http.post<EntProvider>(Parametros.GetParametros().servidorLocal + '/api/provider', body, this.httpOptions);
    }

    public InsertDailySheet(sheet: EntDailySheet): Observable<EntDailySheet> {
        const body = (JSON.stringify(sheet));
        return this.http.post<EntDailySheet>(Parametros.GetParametros().servidorLocal + '/api/dailySheet', body, this.httpOptions).pipe(
            tap((res) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public getTicketConsecutivo(station: number, data: string): Observable<EntTicketVenta> {
        const query = '/api/Obtenerconsecutivo';
        const parameters = [
            [data, 'data'],
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntTicketVenta>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }
    // Obtiene los consumos dde la FormadePago
    public getFormadePago(station: number, formaPago: number, fechaInicial: Date, fechaFinal: Date): Observable<any> {
        const query = '/api/formasPagos';
        const parameters = [
            [formaPago, 'formaPago'],
            [station, 'station'],
            [fechaInicial, 'fechaInicial'],
            [fechaFinal, 'fechaFinal']
        ];
        const consulta = OrderParametersToGet(query, parameters);

        return this.http.get<EntConsumo[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            map((resp: any) => {
                let Datos: [] = JSON.parse(resp.datos);
                // let Consumos: EntConsumo[];
                // Datos.forEach(consumo =>{
                //     Consumos.push({
                //         consecutivo: consumo.CONSECUTIVO,
                //         fecha: consumo.Fecha,
                //         hora: consumo.hora,
                //         cantidad: consumo.CANTIDAD,
                //         valor: consumo.SUBTOTAL,
                //         placa: consumo.PLACA,
                //         combustible: consumo.CodigoAlterno
                //     })
                // });;

                return Datos;
            })
        );
    }
    // Obtiene los datos de la forma de Pago
    public getDatosFormadePago(station: number, formaPago: number): Observable<any> {
        const query = '/api/datosformasPagos';
        const parameters = [
            [formaPago, 'formaPago'],
            [station, 'station']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            map(resp => {
                return JSON.parse(resp.datos);
            })
        );
    }

    // public getPayment5(codClient, dateIni, dateFin, status: boolean, asignado?: boolean, planilla?: number): Observable<EntPayment[]> {
    //     const query = '/api/payment';
    //     const parameters = [
    //         [codClient, 'codClient'],
    //         [dateIni, 'fechaIni'],
    //         [dateFin, 'fechaFin'],
    //         [status, 'estado'],
    //         [asignado, 'asignado'],
    //         [planilla, 'planilla']
    //     ];
    //     const consulta = OrderParametersToGet(query, parameters);
    //     return this.http.get<EntPayment[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
    //         tap(departaments => console.log('Realizado con éxito'))
    //     );
    // }



    public InsertOrder(order: EntOrder, orderDetail: EntOrderDetail[], stationList: number[]): Observable<EntOrder> {
        const data = { order: order, orderDetail: orderDetail, stationList: stationList };
        const body = (JSON.stringify(data));
        return this.http.post<EntOrder>(Parametros.GetParametros().servidorLocal + '/api/order', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
            // catchError(this.handleError<EntEmployee>('GetUsuario'))
        );
    }

    public InsertUser(user: EntUserDB): Observable<EntUserDB> {
        const body = (JSON.stringify(user));
        return this.http.post<EntUserDB>(Parametros.GetParametros().servidorLocal + '/api/user', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertOption(option: EntOption): Observable<EntOption> {
        const body = (JSON.stringify(option));
        return this.http.post<EntOption>(Parametros.GetParametros().servidorLocal + '/api/option', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertProfile(profile: EntProfile): Observable<EntProfile> {
        const body = (JSON.stringify(profile));
        return this.http.post<EntProfile>(Parametros.GetParametros().servidorLocal + '/api/profile', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertRole(role: EntRole): Observable<EntRole> {
        const body = (JSON.stringify(role));
        return this.http.post<EntRole>(Parametros.GetParametros().servidorLocal + '/api/role', body, this.httpOptions).pipe(
            tap((order) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public AssignProfile(role: number, profiles: number[], usuario: string): Observable<any> {
        const body = JSON.stringify({ usuario: usuario, role: role, profiles: profiles });
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/assignProfile', body, this.httpOptions).pipe(
            tap((result) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public UpdateClient(client: EntClient): Observable<any> {
        const body = (JSON.stringify(client));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/client/' + client.codCliente, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateOption(option: EntOption): Observable<any> {
        const body = (JSON.stringify(option));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/option/' + option.ID, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public CloneOption(option: EntOption): Observable<any> {
        const body = (JSON.stringify(option));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/optionClone/' + option.ID, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateProfile(profile: EntProfile): Observable<any> {
        const body = (JSON.stringify(profile));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/profile/' + profile.ID, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateRole(role: EntRole): Observable<any> {
        const body = (JSON.stringify(role));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/role/' + role.ID, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateProvider(provider: EntProvider): Observable<any> {
        const body = JSON.stringify(provider);
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/provider/' + provider.nit, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateInvoice(invoice: EntInvoice): Observable<any> {
        const body = JSON.stringify(invoice);
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/invoice/' + invoice.id, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateUser(user: EntUserDB): Observable<any> {
        const body = (JSON.stringify(user));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/user/' + user.idUsuario, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateQuota(quota, reason): Observable<any> {
        if (reason != null) {
            quota.motivo = reason;
        }
        const body = (JSON.stringify(quota));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/quota/' + quota.codCliente, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateVehicle(vehicle: EntVehicle): Observable<any> {
        const body = (JSON.stringify(vehicle));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/vehicle/' + vehicle.placa, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }


    public UpdateIdentifier(identifier: EntIdentifier): Observable<any> {
        const body = JSON.stringify(identifier);
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/identifier/' + identifier.id, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateOrder(order: EntOrder): Observable<any> {
        const body = (JSON.stringify(order));
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/order/' + order.idPedido, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public UpdateDailySheet(sheet: EntDailySheet): Observable<EntDailySheet> {
        const body = (JSON.stringify(sheet));
        return this.http.put<EntDailySheet>(Parametros.GetParametros().servidorLocal + '/api/dailySheet/' + sheet.ID, body, this.httpOptions).pipe(
            // return this.http.post<EntDailySheet>(Parametros.GetParametros().servidorLocal + '/api/dailySheet', body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Actualizado Correctamente');
            })
        );
    }

    public DeleteTask(task: EntTask): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/task/' + task.id, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteVehicle(vehicle: EntVehicle): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/vehicle/' + vehicle.placa, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteIdentifier(identifier: EntIdentifier): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/identifier/' + identifier.id, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteClient(codClient: number): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/client/' + codClient, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteUser(user: EntUserDB): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/user/' + user.idUsuario, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteProfile(profile: EntProfile): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/profile/' + profile.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteRole(role: EntRole): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/role/' + role.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteOption(option: EntOption): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/option/' + option.ID, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public DeleteProvider(provider: EntProvider): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/provider/' + provider.nit, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    public InsertQuota(quota: EntQuota): Observable<any> {
        const body = (JSON.stringify(quota));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/quota', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertTask(task: EntTask): Observable<any> {
        const body = (JSON.stringify(task));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/task', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertVehicle(vehicle: EntVehicle): Observable<any> {
        const body = (JSON.stringify(vehicle));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/vehicle', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('InsertVehicle Realizado con éxito');
            })
        );
    }

    public InsertIdenfier(identifier: EntIdentifier): Observable<any> {
        const body = (JSON.stringify(identifier));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/identifier', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('InsertIdenfier Realizado con éxito');
            })
        );
    }

    public LinkIdentifier(numIdentifier, placa): Observable<any> {
        const item = { numIdentifier: numIdentifier, placa: placa };
        const body = (JSON.stringify(item));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/linkIdentifier', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('Realizado con éxito');
            })
        );
    }

    public UnlinkIdentifier(identifier: EntIdentifier): Observable<any> {
        const body = JSON.stringify(identifier);
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/unlinkIdentifier', body, this.httpOptions).pipe(
            tap(quota => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertPayment(payment: EntPayment): Observable<any> {
        const body = (JSON.stringify(payment));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/payment', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('InsertPayment: Realizado con éxito');
            })
        );
    }

    public InsertWholesalerPayment(payments: EntInvoice[], date: string): Observable<any> {
        const body = JSON.stringify({ payments: payments, date: date });
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/wholesalerPaymentGroup', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }

    public AssignPayment(cuentaCobro: number, pago: number): Observable<any> {
        const body = JSON.stringify({ cuentaCobro: cuentaCobro, pago: pago });
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + '/api/assignPayment', body, this.httpOptions).pipe(
            tap((result) => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertInvoice(invoice: EntInvoice): Observable<any> {
        const body = (JSON.stringify(invoice));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/invoice', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertNoveltyInvoice(noveltyInvoice: EntNoveltyInvoice): Observable<any> {
        const body = (JSON.stringify(noveltyInvoice));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/noveltyInvoice', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertAdvance(advance: EntAdvance): Observable<any> {
        const body = (JSON.stringify(advance));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/advance', body, this.httpOptions).pipe(
            tap(filas => {
                console.log('Realizado con éxito');
            })
        );
    }

    public InsertNoveltyAdvance(noveltyAdvance: EntNoveltyAdvance): Observable<any> {
        const body = (JSON.stringify(noveltyAdvance));
        return this.http.post(Parametros.GetParametros().servidorLocal + '/api/noveltyAdvance', body, this.httpOptions);
    }

    public GetClient(codClient): Observable<EntClient[]> {
        return this.http.get<EntClient[]>(Parametros.GetParametros().servidorLocal + '/api/client/?codClient=' + codClient, this.httpOptions).pipe(
            map((resp: any) => {
                resp[0].infoCupo = JSON.parse(resp[0].infoCupo);
                return resp;
            })
        );
    }

    public GetPaymentCertificate(ruta): Observable<any> {
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + '/api/paymentCertificate/?ruta=' + ruta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getClients(codClient, nombre, estado: boolean, estacion: number, exacto: boolean): Observable<EntBasicClient[]> {
        const query = '/api/clients';
        const parameters = [
            [codClient, 'codClient'],
            [nombre, 'nombre'],
            [estado, 'estado'],
            [estacion, 'estacion'],
            [exacto, 'exacto']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntBasicClient[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }


    public GetVehicle(codClient: number, placa: string): Observable<EntVehicle[]> {
        const query = '/api/vehicle';
        const parameters = [
            [codClient, 'codClient'],
            [placa, 'placa']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntVehicle[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public GetVehicleWithoutOrder(codClient: number): Observable<EntVehicle[]> {
        return this.http.get<EntVehicle[]>(Parametros.GetParametros().servidorLocal + '/api/vehicleWithoutOrder/?codClient=' + codClient, this.httpOptions);
    }

    public GetVehicleFree(codClient: number): Observable<EntVehicle[]> {
        return this.http.get<EntVehicle[]>(Parametros.GetParametros().servidorLocal + '/api/vehicleFree/?codClient=' + codClient, this.httpOptions);
    }

    public GetIdentifier(codClient: number, rom: string): Observable<EntIdentifier[]> {
        const query = '/api/identifier';
        const parameters = [
            [codClient, 'codClient'],
            [rom, 'rom']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntIdentifier[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public GetIdentifierFree(codClient: number): Observable<EntIdentifier[]> {
        return this.http.get<EntIdentifier[]>(Parametros.GetParametros().servidorLocal + '/api/identifierFree/?codClient=' + codClient, this.httpOptions);
    }

    public GetTask(perfil: string, estado: boolean): Observable<EntTask[]> {
        const query = '/api/task';
        const parameters = [
            [perfil, 'perfil'],
            [estado, 'estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntTask[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getCity(): Observable<EntCity[]> {
        return this.http.get<EntCity[]>(Parametros.GetParametros().servidorLocal + '/api/city', this.httpOptions);
    }

    public getCityStation(): Observable<EntCityStation[]> {
        return this.http.get<EntCityStation[]>(Parametros.GetParametros().servidorLocal + '/api/cityStation', this.httpOptions);
    }

    public getQuota(cliente): Observable<EntQuota[]> {
        const query = '/api/quota';
        const parameters = [[cliente, 'cliente']];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntQuota[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => {
                data.map(e => {
                    e.descuento = e.descuento != null ? JSON.parse(String(e.descuento)) : null;
                });
            })
        );
    }

    public getQuotaType(): Observable<EntQuotaType[]> {
        return this.http.get<EntQuotaType[]>(Parametros.GetParametros().servidorLocal + '/api/quotaType', this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getDiscount(codClient: number): Observable<EntDiscount[]> {
        const query = '/api/discount';
        const parameters = [
            [codClient, 'codClient']];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntDiscount[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getConsumption(codClient: number, fechaIni, fechaFin, cuentaCobro: number, estacion: number, tiquete?: number): Observable<EntConsumptionClient[]> {
        const query = '/api/consumption';
        const parameters = [
            [codClient, 'codClient'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [cuentaCobro, 'cuentaCobro'],
            [estacion, 'estacion'],
            [tiquete, 'tiquete']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntConsumptionClient[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }
    public getValidarConsumoFp(tickets: any): Observable<EntConsumptionClient[]> {
        const query = '/api/validateconsumptionFp';
        const body = JSON.stringify(tickets);
        return this.http.post<any>(Parametros.GetParametros().servidorLocal + query, body, this.httpOptions).pipe(
            tap(_ => {
                console.log('Realizado con éxito');
            })
        );
    }

    // public InsertFuelTranfer(val: EntFuelTransfer): Observable<any> {
    //     const body = JSON.stringify(val);
    //     return this.http.post<EntFuelUnload>(Parametros.GetParametros().servidorLocal + '/api/fuelTransfer', body, this.httpOptions).pipe(
    //         tap(_ => {
    //             console.log('Realizado con éxito');
    //         })
    //         // catchError(this.handleError<EntEmployee>('GetUsuario'))
    //     );
    // }


    public getOrder(codClient: number, fechaIni, fechaFin, estado: boolean): Observable<EntOrder[]> {
        const query = '/api/order';
        const parameters = [
            [codClient, 'codClient'],
            [fechaIni, 'fechaIni'],
            [fechaFin, 'fechaFin'],
            [estado, 'estado']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<EntOrder[]>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions).pipe(
            tap(data => console.log('Realizado con éxito'))
        );
    }

    public getHomeClient(codClient: number): Observable<EntHomeClient> {
        return this.http.get<EntHomeClient>(Parametros.GetParametros().servidorLocal + '/api/homeClient?codClient=' + codClient, this.httpOptions);
    }

    public getHomeStation(station: number): Observable<EntHomeStation> {
        return this.http.get<EntHomeStation>(Parametros.GetParametros().servidorLocal + '/api/homeStation?station=' + station, this.httpOptions);
    }

    private handleError<T>(operation, result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.log(operation);
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    // CONFIGURACION DE CLIENTES
    public getSaldoIncicialCliente(idEstacion: number, fecha: string, cliente: number): Observable<any> {
        const query = '/api/saldoInicial';
        const parameters = [
            [idEstacion, 'idEstacion'],
            [fecha, 'fecha'],
            [cliente, 'cliente']
        ];
        const consulta = OrderParametersToGet(query, parameters);
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + consulta, this.httpOptions);
    }

    public getTaxes(): Observable<TaxesModel[]> {
        return this.http.get<TaxesModel[]>(Parametros.GetParametros().servidorLocal + '/api/taxes', this.httpOptions);
    }
    public DeleteRecievable(idCuentaCobro: number): Observable<any> {
        return this.http.delete(Parametros.GetParametros().servidorLocal + '/api/cuentaCobro/' + idCuentaCobro, this.httpOptions).pipe(
            tap(_ => console.log('Eliminado Correctamente'))
        );
    }

    // CODIGO CONTABLES
    public getCodContables(): Observable<any> {
        return this.http.get<any>(Parametros.GetParametros().servidorLocal + '/api/codcontable', this.httpOptions).pipe(
            tap(result => {
                result.map(e => {
                    e.Codigos != null ? e.Codigos = JSON.parse(String(e.Codigos)) : null;
                });
            })
        );
    }
}
