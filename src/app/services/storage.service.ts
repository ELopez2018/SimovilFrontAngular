import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../Class/Session';
import { EntUser } from '../Class/EntUser';
import { iTableConfig } from '../Class/TABLES_CONFIG';

@Injectable()

export class StorageService {
    private localStorageService;
    private currentSession: Session = null;
    private estacion;

    constructor(private router: Router) {
        this.localStorageService = localStorage;
        this.currentSession = this.loadSessionData();
    }

    setCurrentSession(session: Session, callback: Function): void {
        this.currentSession = session;
        this.localStorageService.setItem('currentUser', JSON.stringify(session));
        callback(this.localStorageService.getItem('station'));
    }

    loadSessionData(): Session {
        // tslint:disable-next-line: prefer-const
        let sessionStr = this.localStorageService.getItem('currentUser');
        return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
    }

    getCurrentSession(): Session {
        return this.currentSession;
    }

    removeCurrentSession(): void {
        this.localStorageService.removeItem('currentUser');
        this.localStorageService.removeItem('station');
        this.currentSession = null;
    }

    getCurrentUser(): EntUser {
        // tslint:disable-next-line: prefer-const
        let session: Session = this.getCurrentSession();
        return (session && session.user) ? session.user : null;
    }

    isAuthenticated(): boolean {
        return (this.getCurrentToken() != null) ? true : false;
    }

    getCurrentToken(): string {
        // tslint:disable-next-line: prefer-const
        let session = this.getCurrentSession();
        return (session && session.token) ? session.token : null;
    }

    logout(): void {
        this.removeCurrentSession();
        this.router.navigate(['login']);
    }

    getCurrentUserDecode(): { Nombre: string, Rol: string, Usuario: string, Area: number, idRol: number } {
        if (this.getCurrentToken() == null) {
            return null;
        }
        const rol = this.getCurrentToken().split('.')[1];
        return JSON.parse(decodeURIComponent(escape(atob(rol))));

    }

    setCurrentStation(station): void {
        this.localStorageService.setItem('station', JSON.stringify(station));
    }

    getCurrentStation() {
        return this.localStorageService.getItem('station');
    }

    setTableConfg(name, value): void {
        this.localStorageService.setItem(name, JSON.stringify(value));
    }

    getTableConfg(name): iTableConfig[] {
        if (this.localStorageService.getItem(name)) {
            try {
                return JSON.parse(this.localStorageService.getItem(name));
            } catch (error) {
                console.log(error);
                return null;
            }
        }
    }
}
