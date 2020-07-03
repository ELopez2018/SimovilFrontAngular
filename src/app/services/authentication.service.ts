import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntUser } from '../Class/EntUser';
import { Parametros } from '../Class/Parametros';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { of } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthenticationService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService) { }



    public Login(usuario: EntUser): Observable<EntUser> {
        const body = (JSON.stringify(usuario));
        return this.http.post<EntUser>(Parametros.GetParametros().servidorLocal + '/api/login', body, httpOptions).pipe(
            tap((user: EntUser) => {
                console.log('Login: Realizado con éxito');
            })
        );
    }

    public logout(): Observable<Boolean> {
        const httpOptions2 = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
        };
        return this.http.get(Parametros.GetParametros().servidorLocal + '/api/logout', httpOptions2).pipe(
            tap((res: boolean) => {
                console.log(res);
            }),
        );
    }

    private extractData(res: Response) {
        const body = res.json();
        return body;
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption


            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    public updatePass(user, idUser): Observable<Boolean> {
        let httpOptions2;
        // console.log(user);
        // if (user.root == true) {
        httpOptions2 = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.storageService.getCurrentToken() })
        };
        // } else
        //   httpOptions2 = httpOptions;
        const currentuser = idUser == null ? btoa(this.storageService.getCurrentUserDecode().Usuario) : btoa(idUser);
        const body = (JSON.stringify(user));
        // console.log(body);
        return this.http.put(Parametros.GetParametros().servidorLocal + '/api/updatePass/' + currentuser, body, httpOptions2).pipe(
            tap((user: any) => {
                console.log('updatePass: Realizado con éxito');
            })
            //,catchError(this.handleError<EntUser>('GetUsuario'))
        );
    }

    //     subscribe((data:string) => {
    //       this.token = data.token;
    //       console.log(this.token);
    //       if(this.token.length > 0)
    //           this.router.navigate(['principal']);
    //         else
    //         console.log("Supongo que salio mal");
    //     }, error => {
    //       console.error(error);

    //     },
    //     () => console.log('done loading user')
    //   );
    // }

}
