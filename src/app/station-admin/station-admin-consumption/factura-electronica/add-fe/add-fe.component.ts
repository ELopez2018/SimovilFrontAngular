import { UtilService } from './../../../../services/util.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PrincipalComponent } from './../../../../principal/principal.component';
import { StorageService } from './../../../../services/storage.service';
import { CarteraService } from './../../../../services/cartera.service';
import { NominaService } from './../../../../services/nomina.service';
import { EntRole } from './../../../../Class/EntRole';
import { EntClient } from './../../../../Class/EntClient';
import { EntReceivable } from './../../../../Class/EntReceivable';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { rangedate, dateToISOString, focusById } from '../../../../util/util-lib';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-add-fe',
    templateUrl: './add-fe.component.html',
    styleUrls: ['./add-fe.component.css'],
    standalone: false
})
export class AddFEComponent implements OnInit {

    @ViewChild('input_text_fe') input_text_fe: ElementRef;
    searchReceivable: EntReceivable[];
    codEstation;
    client: EntClient;
    searchFechaIni;
    searchFechaFin;
    searchStatus: boolean = null;
    id;
    stationsAll;
    booleanClient = false;
    rolSistemas: boolean = false;
    rol: EntRole;
    numeroCuentaCobro;
    idCuentaCobro: number;
    numeroFacturaE: string;
    fechaFacturaE: string;
    fechaVenceFacturaE: string;
    observaciones: string;
    usuario;
    nombreCS: string = 'nombreCheck_';
    nombreCajaSeleccion = [];
    isChecked = [];
    deshabilita: number;
    codigoDeTeclado = [{tecla: 0, estado: false}];

    constructor(
        private nominaService: NominaService,
        private carteraService: CarteraService,
        private storageService: StorageService,
        private principal: PrincipalComponent,
        private route: ActivatedRoute,
        private location: Location,
        private utilService: UtilService
    ) {
        this.codEstation = this.storageService.getCurrentStation();
        this.usuario = this.storageService.getCurrentUserDecode().Usuario;
    }

    ngOnInit() {
        const fechas = rangedate(dateToISOString(new Date()), 1);
        this.searchFechaIni = dateToISOString(fechas[0]);
        this.searchFechaFin = dateToISOString(fechas[1]);
        this.client = new EntClient();
        this.nominaService.GetStations().subscribe((data) => {this.stationsAll = data;}, (error) => console.log(error));
        this.GetParam();
        focusById('btnSearch');
        this.getRolAdmin();
    }

    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        if (id != null) {
            this.searchByParam(id);
        }
    }

    searchByParam(id) {
        this.carteraService.GetClient(id).subscribe(
            (client) => {
                this.client = client[0];
            },
            (error) => {
                console.log(error);
                this.location.back();
            }
        );
    }

    searchClient() {
        if (this.client.codCliente == null) {
            return;
        }
            this.searchReceivable=[];
            this.carteraService.GetClient(this.client.codCliente).subscribe((client) => {
                if (client.length != 0) {
                    this.client = client[0];
                } else {
                        this.principal.showMsg('info', 'Información', 'Cliente no encontrado.');
                       }
                    }, (error) => {
                        console.log(error);
                        this.principal.showMsg('error', 'Error', error.error.message);
                        });
    }

    getReceivableSearch() {
        this.searchReceivable=[];
        this.utilService.loader(true);
        this.carteraService.getReceivable(this.client.codCliente, this.searchStatus, this.searchFechaIni, this.searchFechaFin, null, this.codEstation).subscribe(dataCc =>
            {this.searchReceivable = dataCc;
                console.log('data cuenta cobro: '+JSON.stringify(this.searchReceivable));
            },
                (error) => {
                    console.log(error);
                    this.utilService.loader(false);
                    this.principal.showMsg('error', 'Error', error.error.message);
                }, () => this.utilService.loader(false));
    }

    sumReceivables() {
        let array: EntReceivable[];
        var suma = 0;
        array = this.searchReceivable;
        array.forEach((element) => {
            if(element.idFacturaE == null){
            suma += element.valor;
            }
        });
            return suma;
    }

    cleanReceivableSearch() {
        this.searchFechaIni = null;
        this.searchFechaFin = null;
        this.searchReceivable = null;
        this.searchStatus = null;
        this.isChecked = [];
    }

    back() {
        this.location.back();
    }

    addDate(value) {
        var da = new Date(value);
        return da.setDate(da.getDate() + 15);
    }

    resultClient(client: EntClient) {
        this.searchReceivable = [];
        this.client = client;
        this.booleanClient = false;
        focusById('btnSearch');
    }

    openModCli() {
        this.booleanClient = true;
        setTimeout(() => {focusById('searchCli');}, 10);
    }

    getRolAdmin(){
        this.carteraService.getRolAdmin().subscribe(data => {
            this.rol = data[0];
               if((this.rol.ID == this.storageService.getCurrentUserDecode().idRol) && (this.rol.ID_AREA == this.storageService.getCurrentUserDecode().Area))
                    {
                        this.rolSistemas = true;
                        console.log('hola sistemas:)');
                    }
        }, error => console.log(error));
    }

    validaChecked(cuentaCobro: any, checked: boolean, e: any, contador: number){
        if(cuentaCobro.idFacturaE != null){
            this.principal.showMsg('error', 'Atencion', 'La cuenta de cobro: '+cuentaCobro.num+'ya tiene asignada factura electrónica');
        }
        if(checked){
            this.numeroCuentaCobro = cuentaCobro.num;
            this.idCuentaCobro = cuentaCobro.id;
            const datoCuentaCobro = {'id': this.idCuentaCobro, 'numero': this.numeroCuentaCobro, 'contador': contador};
            this.nombreCajaSeleccion.push(datoCuentaCobro);
            this.isChecked.push(cuentaCobro.num);
        }
        if(!checked){
            let busqueda = e.target.value;
            let indice = this.nombreCajaSeleccion.findIndex(cuentaDeCobro => cuentaDeCobro.numero == busqueda);
            this.nombreCajaSeleccion.splice(indice, 1);
            this.isChecked.splice(indice, 1);
        }
    }

    limpiarCajas(){
        this.numeroCuentaCobro = '';
        this.idCuentaCobro = null;
        this.numeroFacturaE = '';
        this.fechaFacturaE = '';
        this.fechaVenceFacturaE = '';
        this.observaciones = '';
        this.deshabilita = null;
        this.nombreCajaSeleccion = [];
    }

    saveFacturaE(){
        if(this.idsCuentasCobro == '[]' || this.numeroFacturaE == undefined || this.fechaFacturaE == undefined || this.fechaVenceFacturaE == undefined){
            this.principal.showMsg('warn', 'Atencion', 'Favor falta llenar, revisar campos, cuenta de cobro, o numero de factura, o fechas!');
            return;
        }
        this.carteraService.guardarFacturaElectronica(this.idsCuentasCobro, this.numeroFacturaE, this.fechaFacturaE, this.fechaVenceFacturaE, this.observaciones, this.usuario).subscribe(result => {
            this.principal.showMsg('success', 'Éxito', 'Factura electrónica ha sido asignada con éxito. '+JSON.stringify(result));
            }, error => {
            console.log('error, asignación de factura e en el component');
            this.principal.showMsg('error', 'Error', error.error.message);
            });
    }

    get idsCuentasCobro(){

        return JSON.stringify(this.nombreCajaSeleccion.map(e=> {return e.id}));
    }

    validarFacturaElectronica(){
            this.carteraService.getDatoFacturaElectronica(this.numeroFacturaE).subscribe(data => {
            console.log('verificar parámetro número de factura electrónica:) ' + this.numeroFacturaE);
            console.log('resultado de consulta data:) ' + data.length);

            if(data && data.length == 0 && this.numeroFacturaE.length != 0){
                this.deshabilita = 1;
            }

            if(data.length > 0) {
            Swal.fire({
            title: 'Atención!',
            icon: 'warning',
            text: 'La factura electrónica número: '+this.numeroFacturaE+', ya está registrada'
            });
            //this.clear();
            }
            });
    }

    digitaFactura(e: any){
        console.log('%c tecla pulsada: '+e.which, 'color: blue');//b
        this.ctrlZetaBarraEspaciadora(e);
        this.caracteresDeControl(e);
        this.caracteresEspeciales(e);
}

caracteresEspeciales(e: any){
        if((e.which >=33 && e.which <= 34) || (e.which == 38) || (e.which >=40 && e.which <= 45) || (e.which == 47) || (e.which >= 58 && e.which <= 64) || (e.which >= 91 && e.which <= 95) || (e.which >= 91 && e.which <= 95) || (e.which >= 106 && e.which <= 255)){
            this.principal.showMsg('warn', 'Información', 'El número de factura electrónica no comprende caracteres especiales como signos de puntuación o símbolos matemáticos');
            this.input_text_fe.nativeElement.classList.add('caracteresEspeciales');
            e.preventDefault();
            return;
        }
}

caracteresDeControl(e: any){
        if((e.which >= 1 && e.which <=7) || (e.which == 12) || (e.which >= 14 && e.which <= 19) || (e.which >= 21 && e.which <= 31)){
            this.principal.showMsg('info', 'Información', 'No es un carácter (tipo de dato) válido para facturación electrónica');
            this.input_text_fe.nativeElement.classList.add('input_text_fe');
            console.log('value: '+this.input_text_fe.nativeElement.value);//b
            e.preventDefault();
            return;
        }
}

ctrlZetaBarraEspaciadora(e: any){
    if(e.which == 32){
        this.principal.showMsg('info', 'Información', 'El número de factura electrónica no debe contener espacios en blanco');
        this.input_text_fe.nativeElement.classList.add('input_text_fe');
        e.preventDefault();
        return;
    }
}

validarLongitudInput(e: any){
    console.log('id: '+e.target.id);
    //if(e.target.id == 'input_valor_nce' && e.target.value.length >= e.target.maxLength){this.validaInputNotaCredito(e);}
    if(e.target.id == '_fe' && e.target.value.length >= e.target.maxLength){this.validaInputFacturaElectronica(e);}
    //if(e.target.id == '_nce' && e.target.value.length >= e.target.maxLength){this.validaInputValorNotaCredito(e);}
    if(e.target.id == '_text_area' && e.target.value.length >= e.target.maxLength){this.validarTextArea(e);}
}

validaInputFacturaElectronica(e: any){
    this.principal.showMsg('info', 'Información', 'El número de la factura electrónica permite un máximo de '+e.target.maxLength+' dígitos');
        if(e.which != 8 && e.which != 46 && e.which!=36 && e.which!=35 && e.which!=37 && e.which!=39){
        e.preventDefault();
        return;}
}

validarTextArea(e: any){
    this.principal.showMsg('info', 'Información', 'El campo observación tiene configurado un máximo de '+e.target.maxLength+' caracteres');
    if(e.which !=8 && e.which != 36 && e.which !=35 && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && e.which != 46){
        e.preventDefault();
        return;}
}

}




