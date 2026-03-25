import { FacturaElectronica } from './../../../../Class/factura-electronica';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { UtilService } from './../../../../services/util.service';
import { PrincipalComponent } from './../../../../principal/principal.component';
import { StorageService } from './../../../../services/storage.service';
import { CarteraService } from './../../../../services/cartera.service';
import { NominaService } from './../../../../services/nomina.service';
import { EntRole } from './../../../../Class/EntRole';
import { EntClient } from './../../../../Class/EntClient';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-add-nce',
    templateUrl: './add-nce.component.html',
    styleUrls: ['./add-nce.component.css'],
    standalone: false
})
export class AddNCEComponent implements OnInit {

    @ViewChild('input_text_fe') input_text_fe: ElementRef;
    @ViewChild('input_text_nc') input_text_nc: ElementRef;
    @ViewChild('name_fecha') name_fecha: ElementRef;
    @ViewChild('name_fecha_vence') name_fecha_vence: ElementRef;
    @ViewChild('name_valor_total') name_valor_total: ElementRef;
    @ViewChild('name_observacion') name_observacion: ElementRef;
    facturaElectronica: FacturaElectronica[];
    fePorNc: FacturaElectronica[];
    codEstation;
    client: EntClient;
    stationsAll;
    booleanClient = false;
    rolSistemas: boolean = false;
    rol: EntRole;
    numeroFacturaE: string;
    numeroNotaCreditoE: string;
    fechaNotaCreditoE: string;
    fechaVenceNotaCreditoE: string;
    observaciones: string;
    usuario;
    totalNotaCredito;
    booleanFacturaElectronica: boolean = false;
    openInformacion: boolean = false;

  constructor(
    private nominaService: NominaService,
    private carteraService: CarteraService,
    private storageService: StorageService,
    private principal: PrincipalComponent,
    private utilService: UtilService
  ) {
      this.codEstation = this.storageService.getCurrentStation();
      this.usuario = this.storageService.getCurrentUserDecode().Usuario;}

  ngOnInit(): void {
    this.nominaService.GetStations().subscribe((data) => {
            this.stationsAll = data;
        },
        (error) => console.log(error)
    );
  }

openMsgInfo(){
    this.openInformacion = true;
}

closeMsgInfo(){
    this.openInformacion = false;
}

getFacturaElectronica() {
    this.facturaElectronica=[];
    this.utilService.loader(true);
    this.carteraService.getFacturaElectronica(this.client.codCliente, this.codEstation).subscribe(data_fe => {
        this.facturaElectronica = data_fe;
        console.log('datos de la factura electrónica: '+this.facturaElectronica);
        data_fe.map(o => {
            if(data_fe.length == 1){
            this.observaciones = o.observaciones;
            console.log('observación de facturación electrónica: '+this.observaciones);
        }
        });
        console.log('datos factura electrónica: '+JSON.stringify(data_fe));
    },
    error => {
                console.log(error);
                this.utilService.loader(false);
                this.principal.showMsg('error', 'Error', error.error.message);
            },
            () => this.utilService.loader(false));
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

limpiarCajaNotaCredito(){
    this.numeroFacturaE = '';
    this.numeroNotaCreditoE = '';
    this.fechaNotaCreditoE = '';
    this.fechaVenceNotaCreditoE = '';
    this.totalNotaCredito = 0;
    this.observaciones = '';
}

limpiarCajaFactura(){
    this.input_text_fe.nativeElement.removeAttribute('readonly');
    this.booleanFacturaElectronica = false;
    this.numeroFacturaE = '';
    this.fePorNc = [];
}

datoNumeroDeFactura(){
    if(this.numeroFacturaE == undefined || this.numeroFacturaE == '' ){
        this.principal.showMsg('success', 'Información', 'Favor falta introducir dato del número de la factura electrónica');
        this.input_text_fe.nativeElement.classList.add('name_observacion');
        return;
    }
    if(this.numeroFacturaE != undefined || this.numeroFacturaE != '' ){
        this.input_text_fe.nativeElement.classList.remove('name_observacion');
    }
}

datoNumeroNotaCreditoE(){
    if(this.numeroNotaCreditoE == undefined || this.numeroNotaCreditoE == ''){
        this.principal.showMsg('warn', 'Información', 'Favor falta introducir dato del número de la nota crédito electrónica');
        this.input_text_nc.nativeElement.classList.add('name_observacion');
        return;
    }
    if(this.numeroNotaCreditoE != undefined || this.numeroNotaCreditoE != ''){
        this.input_text_nc.nativeElement.classList.remove('name_observacion');
    }
}

datoFechaNotaCreditoE(){
    if(this.fechaNotaCreditoE == undefined || this.fechaNotaCreditoE == ''){
        this.principal.showMsg('info', 'Información', 'Favor falta introducir dato fecha de la nota crédito electrónica');
        this.name_fecha.nativeElement.classList.add('name_fecha');
        return;
    }
    if(this.fechaNotaCreditoE != undefined || this.fechaNotaCreditoE != ''){
        this.name_fecha.nativeElement.classList.remove('name_fecha');
    }
}

datoFechaVenceNotaCreditoE(){
    if(this.fechaVenceNotaCreditoE == undefined || this.fechaNotaCreditoE == ''){
        this.principal.showMsg('info', 'Información', 'Favor falta introducir dato fecha vence de la nota crédito electrónica');
        this.name_fecha_vence.nativeElement.classList.add('name_fecha_vence');
        return;
    }
    if(this.fechaVenceNotaCreditoE != undefined || this.fechaNotaCreditoE != ''){
        this.name_fecha_vence.nativeElement.classList.remove('name_fecha_vence');
    }
}

datoObservaciones(){
    if(this.observaciones == undefined || this.observaciones == ''){
        this.principal.showMsg('info', 'Información', 'Favor falta introducir datos en observaciones de la nota crédito electrónica');
        this.name_observacion.nativeElement.classList.add('name_observacion');
        return;
    }
    if(this.observaciones != undefined || this.observaciones != ''){
        this.name_observacion.nativeElement.classList.remove('name_observacion');
    }
}

datoValorNotaCreditoE(){
    if(this.totalNotaCredito == undefined || this.totalNotaCredito == 0){
        this.principal.showMsg('info', 'Información', 'Favor falta introducir dato del valor total de la nota crédito electrónica');
        this.name_valor_total.nativeElement.classList.add('name_valor_total');
        return;
    }
    if(this.totalNotaCredito != undefined || this.totalNotaCredito != 0){
        this.name_valor_total.nativeElement.classList.remove('name_valor_total');
    }
}

get existeFactura(){
    if(this.fePorNc == undefined){
        return true;
    }
    return false;
}

saveNotaCreditoE(){
    this.datoNumeroDeFactura();
    this.datoNumeroNotaCreditoE();
    this.datoFechaNotaCreditoE();
    this.datoFechaVenceNotaCreditoE();
    this.datoObservaciones();
    this.datoValorNotaCreditoE();

    if(this.existeFactura){
        this.principal.showMsg('error', 'Información', 'Por favor introduzca un número de factura electrónica que sea válido');
        return;
    }
    console.log('¡Diligenciando, diligenciando!');
    this.carteraService.guardarNotaCreditoElectronica(this.numeroNotaCreditoE, this.fePorNc[0].idFe, this.fechaNotaCreditoE, this.fechaVenceNotaCreditoE, this.totalNotaCredito, this.observaciones).subscribe(result => {
        this.principal.showMsg('success', 'Éxito', 'Nota de crédito electrónica ha sido asignada con éxito a la factura electrónica: '+this.numeroNotaCreditoE+'. '+JSON.stringify(result));
        }, error => {
        console.log('error, asignación de nota crédito electrónica en el component');
        this.principal.showMsg('error', 'Error', error.error.message);
        console.log('error: '+JSON.stringify(error));
        });
}

validarTextArea(e: any){
    this.principal.showMsg('info', 'Información', 'El campo observación tiene configurado un máximo de '+e.target.maxLength+' dígitos');
    if(e.which !=8 && e.which != 36 && e.which !=35 && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && e.which != 46){
        e.preventDefault();
        return;}
}

validaInputNotaCredito(e: any){
    this.principal.showMsg('info', 'Información', 'El $_total de la nota crédito permite un máximo de '+e.target.maxLength+' dígitos');
        if(e.which != 8 && e.which != 46 && e.which !=36 && e.which!=35 && e.which!=37 && e.which!=39){
        e.preventDefault();
        return;}
}

validaInputFacturaElectronica(e: any){
    this.principal.showMsg('info', 'Información', 'El número de la factura electrónica permite un máximo de '+e.target.maxLength+' dígitos');
        if(e.which != 8 && e.which != 46 && e.which!=36 && e.which!=35 && e.which!=37 && e.which!=39 && e.which!=13){
        e.preventDefault();
        return;}
}

validaInputValorNotaCredito(e: any){
    this.principal.showMsg('info', 'Información', 'El número de la nota crédito electrónica permite un máximo de '+e.target.maxLength+' dígitos');
        if(e.which != 8 && e.which != 46 && e.which!=36 && e.which!=35 && e.which!=37 && e.which!=39){
        e.preventDefault();
        return;}
}

validarLongitudInput(e: any){
    if(e.target.id == 'input_valor_nce' && e.target.value.length >= e.target.maxLength){this.validaInputNotaCredito(e);}
    if(e.target.id == '_fe' && e.target.value.length >= e.target.maxLength){this.validaInputFacturaElectronica(e);}
    if(e.target.id == '_nce' && e.target.value.length >= e.target.maxLength){this.validaInputValorNotaCredito(e);}
    if(e.target.id == '_text_area' && e.target.value.length >= e.target.maxLength){this.validarTextArea(e);}
}

validarShiftKey(e: any){
    e.preventDefault();
    return;
}

validarControlKey(e: any){
    e.preventDefault();
    return;
}

validarAltKey(e: any){
    e.preventDefault();
    e.stopPropagation();
    return;
}

digitaFactura(e: any){
    if(e.shiftKey){this.validarShiftKey(e);}
    if(e.ctrlKey){this.validarControlKey(e);}
    if(e.altKey){this.validarAltKey(e);}
    this.ctrlZetaBarraEspaciadora(e);
    this.caracteresDeControl(e);
    this.caracteresEspeciales(e);
}

caracteresEspeciales(e: any){
    if((e.which >=33 && e.which <= 34) || (e.which == 38) || (e.which >=40 && e.which <= 45) || (e.which == 47) || (e.which >= 58 && e.which <= 64) || (e.which >= 91 && e.which <= 95) || (e.which >= 91 && e.which <= 95) || (e.which >= 106 && e.which <= 255)){
        if(e.target.id == '_fe'){
        this.principal.showMsg('success', 'Información', 'El número de factura electrónica no conlleva caracteres especiales como signos de puntuación o símbolos matemáticos');
        this.input_text_fe.nativeElement.classList.add('caracteresEspeciales_fe');
        e.preventDefault();
        return;}
        if(e.target.id == '_nce'){
        this.principal.showMsg('warn', 'Información', 'El número de la nota de crédito electrónica no conlleva caracteres especiales como signos de puntuación o símbolos matemáticos');
        this.input_text_nc.nativeElement.classList.add('caracteresEspeciales_nc');
        e.preventDefault();
        return;}
    }
}

caracteresDeControl(e: any){
    if((e.which >= 1 && e.which <=7) || (e.which == 12) || (e.which >= 14 && e.which <= 19) || (e.which >= 21 && e.which <= 31)){
        if(e.target.id == '_fe'){
        this.principal.showMsg('success', 'Información', 'Has pulsado la tecla '+e.key+' y no es un carácter (tipo de dato) válido para facturación electrónica');
        this.input_text_fe.nativeElement.classList.add('input_text_fe');
        e.preventDefault();
        return;}
        if(e.target.id == '_nce'){
        this.principal.showMsg('warn', 'Información', 'Has pulsado la tecla '+e.key+' y no es un carácter (tipo de dato) válido para nota de crédito electrónica');
        this.input_text_nc.nativeElement.classList.add('input_text_nc');
        e.preventDefault();
        return;}

    }
}

verMensajeSpaceBarFe(){
    this.input_text_fe.nativeElement.classList.add('input_text_fe');
    return this.principal.showMsg('success', 'Información', 'El número de factura electrónica no debe contener espacios en blanco');
}

verMensajeSpaceBarNce(){
    this.input_text_nc.nativeElement.classList.add('input_text_nc');
    return this.principal.showMsg('warn', 'Información', 'El número de nota crédito electrónica no debe contener espacios en blanco');
}

validarSpaceBar(e: any){
    if(e == '_fe'){this.verMensajeSpaceBarFe();}
    if(e == '_nce'){this.verMensajeSpaceBarNce();}
}

ctrlZetaBarraEspaciadora(e: any){
    if(e.which == 32){
        this.validarSpaceBar(e.target.id);
        e.preventDefault();
        return;
    }
}

buscarNotaCreditoE(){
    console.log('¡Buscando, buscando!');
    if(this.numeroNotaCreditoE == undefined || this.numeroNotaCreditoE == null || this.numeroNotaCreditoE == ''){
        this.principal.showMsg('warn', 'Atención', 'digite el número de la nota crédito electrónica a consultar porque está: '+this.numeroNotaCreditoE);
        return;
    }
    this.carteraService.getNotaCreditoElectronica(this.numeroNotaCreditoE).subscribe(data => {
        if(data.length != 0) {
        Swal.fire({
        title: 'Información',
        icon: 'info',
        text: 'La nota de crédito electrónica número: '+this.numeroNotaCreditoE+', ya ha sido registrada'
        });
        //this.clear();
        }
        });
}

deValorToTotal(pasando){
    console.log('%c ¡Pasando, pasando! valor por: '+pasando, 'color: lime; background: black;');
    this.totalNotaCredito = pasando;
}

buscarFacturaElectronica(){

        if(this.numeroFacturaE == undefined || this.numeroFacturaE == null || this.numeroFacturaE == ''){
            this.principal.showMsg('success', 'Atención', 'digite el número de factura electrónica a consultar porque está sin diligenciar. '+this.numeroFacturaE);
            return;
        }

        this.carteraService.getDatoFacturaElectronica(this.numeroFacturaE).subscribe(data => {
        this.fePorNc = data;

        if(data.length != 0){
            this.booleanFacturaElectronica = true;
            this.input_text_fe.nativeElement.readOnly = true;
        }

        if(data.length == 0) {
        Swal.fire({
        title: 'Información',
        icon: 'info',
        text: 'La factura electrónica número: '+this.numeroFacturaE+', aún no ha sido registrada, favor introduzca un número válido.'
        });
        this.booleanFacturaElectronica = false;
        this.input_text_fe.nativeElement.removeAttribute('readolny');
        return;
        }
        });
    }
}
