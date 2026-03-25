import { EntCupo } from './../Class/EntCupo';
import { CarteraService } from './../services/cartera.service';
import { DataCupoService } from './../services/data-cupo.service';
import { Component, OnInit, HostListener, Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { Message, MessageService } from 'primeng/api';
import { UtilService } from '../services/util.service';
import { MenuItem } from '../Class/menu-item';
import { BasicDataService } from '../services/basic-data.service';
import { fadeAnimation } from '../animations';
import { fadeTransition } from '../routerAnimation';
import { NominaService } from '../services/nomina.service';


@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css'],
    animations: [fadeAnimation, fadeTransition()],
    standalone: false
})
@Injectable()
export class PrincipalComponent implements OnInit {
    msgs: Message[] = [];
    displayMenu = '';
    visible = false;
    dropdown = 'dropdown';
    dropdownMenu = 'dropdown-menu';
    url: LocationStrategy;
    public innerWidth: any;
    letterUser: string;
    navItems: MenuItem[] = [];
    version;
    usuario = 'Usuario';
    NombreUsuario = null;
    IdEstacion: number;
    NombreEstacion = null;
    cupoCartera: EntCupo[] = [];
    estadoCupo: string;
    abrirChat:number = 0;
    miniChat:number=0;
    contenidoChat:string ='';
    constructor(
        private locationStrategy: LocationStrategy,
        private authenticationService: AuthenticationService,
        private storageService: StorageService,
        private utilService: UtilService,
        private basicDataService: BasicDataService,
        private messageService: MessageService,
        private nominaService: NominaService,
        public dataCupoService: DataCupoService,
        private carteraService: CarteraService
    ) {
        this.url = this.locationStrategy;
        this.version = basicDataService.version;
        this.getMenuItem();

    }

    ngOnInit() {
        this.innerWidth = window.innerWidth;
        this.NombreUsuario = this.storageService.getCurrentUserDecode().Nombre;
        this.IdEstacion = this.storageService.getCurrentStation();
        this.dataCupoService.idEstacion = this.IdEstacion;
        if (this.IdEstacion) {
            this.nominaService.GetStations().subscribe(res => {
                    this.NombreEstacion = res.find(e => e.idEstacion == this.IdEstacion).nombreEstacion;
            }, error => {
                console.log(error);
            });
        }

    }


    toggle(): void {
        this.visible = !this.visible;
        this.displayMenu = this.visible ? 'toggled' : '';
    }

    toggleVistaMin(): void {
        if (this.innerWidth < 500) {
            this.visible = false;
            this.displayMenu = '';
        }
    }

    getLetterUser() {
        let nombre;
        if (this.storageService.isAuthenticated()) {
            nombre = String(this.storageService.getCurrentUserDecode().Nombre);
            // this.NombreUsuario = nombre;
            this.usuario = nombre;
            const array = nombre.split(' ');
            return this.letterUser = array[0][0] + array[1][0];
        } else {
            return;
        }
    }

    show(value: boolean) {
        if (value) {
            this.displayMenu = 'toggled';
            this.visible = value;
        } else {
            this.displayMenu = '';
            this.visible = value;
        }
    }

    logout() {

        this.utilService.confirm('¿Deseas salir de Simovil?', result => {
            if (result) {
                this.storageService.logout();
            }
        });
    }

    /**
     *
     * @param sev opciones: success, info, warn, error
     * @param sum Titulo opciones: success, info, warn, error
     * @param det detalle opciones: success, info, warn, error
     */
    showMsg(sev, sum, det) {
        let tiempo;
        switch (sev) {
            case 'error':
                tiempo = 8000;
                break;
            case 'success':
                tiempo = 2000;
                break;
            case 'info':
                tiempo = 4000;
                break;
            case 'warn':
                tiempo = 4000;
                break;
            default:
                tiempo = 4000;

        }
        this.messageService.add({ severity: sev, summary: sum, detail: det, life: tiempo });
    }

    checkMenuRole(url: string) {
        return this.basicDataService.checkPermisionUrl(url);
    }

    getMenuItem() {

        if (this.basicDataService.menu.length != 0) {
            this.navItems = this.basicDataService.menu;
        } else {
            this.basicDataService.SetMenuItem(res => {
                this.navItems = this.basicDataService.menu;
            });
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    get notLoginPath() {
        return this.url.path().indexOf('/login') < 0;
    }

    verCupoConsumido(){
            this.carteraService.getDatosCupoConsumido(this.IdEstacion).subscribe(data => {
            console.log('verificar parámetros:) estación:) ' + this.IdEstacion);
            if (data && data.length == 0) {
                console.log('%c' + 'no hay registros de cupo que le falte el 20% por consumir. '+JSON.stringify(data), 'color: blue; font-weight: bold;' );
                this.dataCupoService.alertaCupoConsumido = false;//alerta verde
                this.limpiar();
            }
            if(data.length > 0){
                console.log('%c' + 'notificar al correo. ', 'background-color: yellow; color: black; font-weight: bold;' );
                this.notificarAdmon(data);//here notificar al correo
            }
            }, error => {
            console.log('error=> '+error+' ha ocurrido un error durante la consulta al cupo consumido. '+error.error.message);
            });
    }

    notificarAdmon(data){
        console.log('%c' + 'notificando... '+JSON.stringify(data), 'background-color: lime; color: black; font-weight: bold;' );//quitar solo json-data
            this.cupoCartera = data;
            for(var id in this.cupoCartera){
                if(this.cupoCartera[id].cupoConsumido >= 80 && this.cupoCartera[id].notifyMail == 0){
                    this.dataCupoService.alertaCupoConsumido = true;//alerta roja
                    //here enviar correos
                    console.log('verificar id_cupo: '+this.cupoCartera[id].idCupo);
                    this.setEstadoCupo(this.cupoCartera[id].estadoCupo);
                    const parametros = {
                        'idCupo': this.cupoCartera[id].idCupo,
                        'nombre': this.cupoCartera[id].nombre,
                        'codCliente': this.cupoCartera[id].codCliente,
                        'cupoAsignado': this.cupoCartera[id].cupoAsignado,
                        'cupoDisponible': this.cupoCartera[id].cupoDisponible,
                        'estadoCupo': this.estadoCupo,
                        'detalleTipoCupo': this.cupoCartera[id].detalleTipoCupo,
                        'nombreEstacion': this.cupoCartera[id].nombreEstacion,
                        'cupoConsumido': this.cupoCartera[id].cupoConsumido,
                        'emailAdminEds': this.cupoCartera[id].emailAdminEds
                    };
                    console.log('objeto component: '+JSON.stringify(parametros));
                    this.carteraService.notificacionHaciaClienteAnticipo(parametros).subscribe(result => {
                        console.log('success', 'Éxito', 'campo notify_mail ha sido actualizado con éxito. '+JSON.stringify(result));
                        }, error => {
                        console.log('error, ubicación: clase Component '+error.error.message);
                        });
                    //here actualizar campo notifyMail a 1 en la bd por registros de 1 en 1 where idCupo = var id del for
                }
                if(this.cupoCartera[id].cupoConsumido >= 80 && this.cupoCartera[id].notifyMail == 1){
                    this.dataCupoService.alertaCupoConsumido = true;//alerta roja
                }
                if(this.cupoCartera[id].cupoConsumido < 80 && this.cupoCartera[id].notifyMail == 0){
                    this.dataCupoService.alertaCupoConsumido = false;//alerta verde
                    console.log('luz verde... length'+this.cupoCartera.length);
                }
            }
    }

    setEstadoCupo(estadoDelCupo){
        if(estadoDelCupo == true){
            this.estadoCupo = 'Activo';
        }
        if(estadoDelCupo == false){
            this.estadoCupo = 'Inactivo';
        }
    }

    limpiar(){
        this.cupoCartera = [];
    }
    
    abreChat(){
        if(this.abrirChat==1){
            this.abrirChat=0;
            this.contenidoChat = ''
        } else {
            this.abrirChat=1;
            this.miniChat=0
        }
    }

    minimizaChat() {
        if(this.miniChat==1){
            this.miniChat=0;
        } else {
            this.miniChat=1;
        }
        console.log(this.miniChat)
    }
    
    guardar(){
        if(this.contenidoChat.length <= 0){
            this.showMsg('error', 'ERROR', 'El mensaje no tiene un contenido');
        }

        if(this.contenidoChat.length > 0){
            this.showMsg('success', 'MENSAJE ENVIADO', 'El mensaje se envio a: Coordinadorsistemas@mineliumgas.com');
            this.contenidoChat = '';
            this.abrirChat=0;
        }
        console.log(this.contenidoChat, ' - ', this.NombreUsuario,' - ', this.NombreEstacion)
    }

}