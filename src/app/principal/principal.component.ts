import { Component, OnInit, HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { Message, MessageService } from 'primeng/api';
import { UtilService } from '../services/util.service';
import { MenuItem } from '../Class/menu-item';
import { BasicDataService } from '../services/basic-data.service';
import { fadeAnimation } from '../animations';
import { fadeTransition } from '../routerAnimation';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css'],
    animations: [fadeAnimation, fadeTransition()]
})
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
    constructor(
        private locationStrategy: LocationStrategy,
        private authenticationService: AuthenticationService,
        private storageService: StorageService,
        private utilService: UtilService,
        private basicDataService: BasicDataService,
        private messageService: MessageService
    ) {
        this.url = this.locationStrategy;
        this.version = basicDataService.version;
        this.getMenuItem();

    }

    ngOnInit() {
        this.innerWidth = window.innerWidth;
        this.NombreUsuario = this.storageService.getCurrentUserDecode().Nombre;
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
                // this.utilService.loader(true);
                // this.show(false);
                // this.authenticationService.logout().subscribe((data: boolean) => {
                //   this.utilService.loader(false);
                //   if (data)
                //     this.storageService.logout();
                // }, error => {
                //   this.utilService.loader(false);
                //   console.log(error);
                // });
            }
        });
    }

    /**
     *
     * @param sev success, info, warn, error
     * @param sum title
     * @param det detalle
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
                tiempo = 2000;
                break;
            case 'warn':
                tiempo = 3000;
                break;
            default:
                tiempo = 3000;

        }
        this.messageService.add({ severity: sev, summary: sum, detail: det, life: tiempo });
    }

    checkMenuRole(url: string) {
        return this.basicDataService.checkPermisionUrl(url);
    }

    getMenuItem() {

        this.basicDataService.ObsMenu.subscribe(resp => {
            this.navItems = resp;
            console.log(resp);
        });
    //     if (this.basicDataService.menu.length != 0) {
    //         this.navItems = this.basicDataService.menu;
    //     } else {
    //         this.basicDataService.SetMenuItem(res => {
    //             this.navItems = this.basicDataService.menu;
    //         });
    //     }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    get notLoginPath() {
        return this.url.path().indexOf('/login') < 0;
    }
}
