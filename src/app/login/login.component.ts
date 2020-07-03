import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// Servicios
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { NominaService } from '../services/nomina.service';
import { BasicDataService } from '../services/basic-data.service';
import { UtilService } from '../services/util.service';

// Componentes
import { Title } from '@angular/platform-browser';
import { EntUser } from '../Class/EntUser';
import { Router, ActivatedRoute } from '@angular/router';
import { Session } from '../Class/Session';
import { PrincipalComponent } from '../principal/principal.component';
import { Md5 } from 'ts-md5/dist/md5';
import { fadeTransition } from '../routerAnimation';
import { TABLEINVOICEPENDING, TABLEADVANCEPENDING } from '../Class/TABLES_CONFIG';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [fadeTransition()]
})
export class LoginComponent implements OnInit {
    version;
    usuario: EntUser;
    loginForm: FormGroup;
    passForm: FormGroup;
    errorLogin: boolean = false;
    msjerrorLogin: String;
    passFormBool = false;

    constructor(
        private fb: FormBuilder,
        title: Title,
        private storageService: StorageService,
        private authenticationService: AuthenticationService,
        private nominaService: NominaService,
        private router: Router,
        private route: ActivatedRoute,
        private principal: PrincipalComponent,
        private basicDataService: BasicDataService,
        private utilService: UtilService
    ) {
        title.setTitle('Simovil');
        this.buildForm();
        this.version = this.basicDataService.version;
    }

    buildForm() {
        this.loginForm = this.fb.group({
            user: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
        this.passForm = this.fb.group({
            user: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    ngOnInit() {
        if (this.storageService.isAuthenticated()) {
            if (this.storageService.getCurrentUserDecode().idRol == null) {
                this.storageService.logout();
            } else {
                this.correctLogin2();
            }
        }
    }

    submit() {
        this.usuario = new EntUser();
        this.usuario.idUsuario = btoa(this.loginForm.get('user').value);
        this.usuario.Password = btoa(Md5.hashAsciiStr(this.loginForm.get('password').value).toString());
        this.usuario.token = '';
        this.Login(this.usuario);
    }

    submitPass() {
        const idUsuario = String(this.loginForm.get('user').value).trim();
        const mail = String(this.passForm.get('email').value).trim();
        this.utilService.loader(true);
        const pass = this.randomPass();
        const updatePass = {
            newpass: btoa(Md5.hashAsciiStr(pass).toString()),
            mailpass: btoa(pass),
            email: mail,
            reset: true
        };
        this.authenticationService.updatePass(updatePass, idUsuario).subscribe(data => {
            this.principal.showMsg('success', 'Éxito', 'La nueva contraseña ha sido enviada al correo correctamente.');
            this.passFormBool = false;
        }, error => {
            this.principal.showMsg('error', 'Error', error.error.message);
            console.log(error);
        }, () => this.utilService.loader(false));
    }

    randomPass() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890';
        let pass = '';
        for (let x = 0; x < 10; x++) {
            const i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }

    Login(user: EntUser): void {
        this.utilService.loader(true);
        this.authenticationService.Login(user).subscribe(data => {
            this.utilService.loader(false);
            this.usuario.token = data.token;
            this.usuario.Password = null;
            if (typeof (this.usuario.token) == 'undefined') {
                this.msjerrorLogin = 'Error de Credenciales';
                this.errorLogin = true;
            } else {
                const session = new Session();
                session.token = this.usuario.token;
                this.correctLogin(session);
            }
        }, error => {
            console.log(error);
            if (error.status == 0) {
                this.msjerrorLogin = 'El servidor no responde. Verifique su conexión a Internet';
            } else {
                this.msjerrorLogin = error.error;
            }
            this.errorLogin = true;
            this.utilService.loader(false);
        }
        );
    }

    private correctLogin(data: Session) {
        this.storageService.setCurrentSession(data
            , callback => {
                this.setTablesConfig();
                this.nominaService.setHttpOption();
                this.basicDataService.getBasicData();
                this.basicDataService.SetMenuItem(_ => {
                    this.principal.getMenuItem();
                    this.correctLogin2();
                });
            });
    }
    private correctLogin2() {
        if (this.storageService.getCurrentUserDecode().idRol == 6) {
            this.assignStation();
        }
        this.route.queryParamMap.subscribe(res => {
            let destiny = res.get('destination') || '';
            if (destiny.length > 0) {
                destiny = destiny.slice(1, destiny.length);
                this.router.navigate([destiny]);
            } else {
                if (this.storageService.getCurrentUserDecode().idRol == 8) {
                    this.router.navigate(['account']);
                } else {
                    this.router.navigate(['welcome']);
                }
            }
        });
    }

    assignStation() {
        this.nominaService.GetStations().subscribe(data => {
            const codstation = data.find(e => e.usuario == this.storageService.getCurrentUserDecode().Usuario).idEstacion;
            this.storageService.setCurrentStation(codstation);
        }, error => console.log(error));
    }

    setTablesConfig() {
        const IP = this.storageService.getTableConfg('invoicePending');
        if (IP == null || (IP && IP.length !== TABLEINVOICEPENDING.length)) {
            this.storageService.setTableConfg('invoicePending', TABLEINVOICEPENDING);
        }
        const AP = this.storageService.getTableConfg('advancePending');
        if (AP == null || (AP && AP.length !== TABLEADVANCEPENDING.length)) {
            this.storageService.setTableConfg('advancePending', TABLEADVANCEPENDING);
        }
    }
}
