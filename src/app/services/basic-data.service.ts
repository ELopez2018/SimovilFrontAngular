import { Injectable, EventEmitter } from '@angular/core';
import { NominaService } from './nomina.service';
import { EntStation } from '../Class/EntStation';
import { EducationLevel } from '../Class/EntEducationLevel';
import { EntRelationship } from '../Class/EntRelationship';
import { EntPosition } from '../Class/EntPosition';
import { forkJoin, Observable, observable, of } from 'rxjs';
import { MenuItem } from '../Class/menu-item';
import { StorageService } from './storage.service';
import { NAVITEMS } from '../Class/NAVITEMS';
import { EntPermission } from '../Class/EntPermission';

@Injectable()
export class BasicDataService {

    private educationLevels: EducationLevel[];
    private relationships: EntRelationship[];
    private positions: EntPosition[];
    private stations: EntStation[];
    private allowedRoutes: string[] = [];
    ObsMenu: Observable<MenuItem[]> = new Observable;
    statusDataBasic = false;
    CONTSNAVITEMS = NAVITEMS;
    MENU: MenuItem[] = [];
    menu: MenuItem[] = [];
    menu2: MenuItem[] = [];

    permission: EntPermission[];
    version = '5.0.0';
    private numModal = 0;
    okAllowedRoutes = new EventEmitter<boolean>();
    get uploadRoutes(): number { return this.allowedRoutes.length; }

    constructor(
        private nominaService: NominaService,
        private storageService: StorageService
    ) {
    }

    public SetMenuItem(callback?) {
        this.menu2 = [];
        if (this.storageService.isAuthenticated()) {

            this.nominaService.GetPermission(this.storageService.getCurrentUserDecode().Usuario).subscribe(result => {
                // console.log(result);
                this.setAllowedRoutes(result);
                const resultPadre = result.filter(e => e.OPCION_PADRE == null);
                // console.log(resultPadre);
                const resultHijos = result.filter(e => e.OPCION_PADRE != null && resultPadre.find(r => r.ID == e.OPCION_PADRE) != null);
                const promise = new Promise((resolve, reject) => {
                    resultPadre.forEach(e => {
                        if (e.VISIBLE === true) {
                            this.menu2.push({ ID: e.ID, DESCRIPCION: e.DESCRIPCION, ESTADO: e.ESTADO, ICONO: e.ICONO, URL: e.URL, HIJO: [] });
                        }
                    });
                    resolve(true);
                });
                promise
                    .then(res => {
                        resultHijos.forEach(e => {
                            if (e.VISIBLE === true) {
                                this.menu2.find(r => r.ID === e.OPCION_PADRE).HIJO.push
                                    ({ DESCRIPCION: e.DESCRIPCION, ICONO: e.ICONO, ESTADO: e.ESTADO, URL: e.URL, ID: e.ID });
                            }
                        });
                        return true;
                    })
                    .then(t => {
                        this.menu2.map(e => {
                            if (e.HIJO && e.HIJO.length == 0) {
                                e.HIJO = null;
                            }
                        });
                        return true;
                    }).then(e => {
                        this.menu = this.menu2;
                        this.ObsMenu = of(this.menu);
                        callback != null ? callback(true) : null;
                    });
            }, error => console.log(error));
        }
    }

    setAllowedRoutes(permissions: EntPermission[]) {
        this.allowedRoutes = [];
        permissions.forEach(e => {
            if (e.URL != '') {
                e.URL = e.URL + '/';
                if (e.TODO) {
                    this.allowedRoutes.push(e.URL);
                } else {
                    e.LEER ? this.allowedRoutes.push(e.URL + 'search') : null;
                    e.CREAR ? this.allowedRoutes.push(e.URL + 'add') : null;
                    e.BORRAR ? this.allowedRoutes.push(e.URL + 'delete') : null;
                    e.IMPRIMIR ? this.allowedRoutes.push(e.URL + 'print') : null;
                    e.ACTUALIZAR ? this.allowedRoutes.push(e.URL + 'edit') : null;
                }
            }
        });
        this.okAllowedRoutes.emit(true);
        // console.log(this.allowedRoutes);
    }

    public getBasicDataObsservable() {
        return forkJoin(
            this.nominaService.GetStations(),
            this.nominaService.GetEducationLevel(),
            this.nominaService.GetPosition(),
            this.nominaService.GetRelationship());
    }

    public getBasicData() {
        this.getBasicDataObsservable().subscribe(([res1, res2, res3, res4]) => {
            this.stations = res1;
            this.educationLevels = res2;
            this.positions = res3;
            this.relationships = res4;
            this.statusDataBasic = true;
        });
    }

    getStations() {
        this.selfData();
        return this.stations;
    }

    getEducationLevels() {
        this.selfData();
        return this.educationLevels;
    }

    getPositions() {
        this.selfData();
        return this.positions;
    }

    getRelationships() {
        this.selfData();
        return this.relationships;
    }

    private selfData() {
        if (!this.statusDataBasic) {
            this.statusDataBasic = true;
            this.getBasicData();
        }
    }

    checkPermisionUrl(url: string): boolean {
        if (url == '/report') {
            return true;
        }
        if (url.indexOf('/login') == 0) {
            return true;
        }
        url = url + '/';
        const result = this.allowedRoutes.findIndex(e => url.indexOf(e) == 0);
        return result >= 0;
    }

    validRoute(url: string): boolean {
        const result = this.allowedRoutes.findIndex(e => url.indexOf(e) == 0);
        return result >= 0;
    }

    get currentNumberModal() {
        return this.numModal;
    }

    addNumberModal() {
        this.numModal++;
        return this.numModal;
    }

    removeNumberModal(val: number) {
        this.numModal = val - 1;
    }
}
