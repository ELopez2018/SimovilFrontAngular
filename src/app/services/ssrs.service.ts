import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SsrsService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/html', 'Authorization': 'Basic ' + 'YWRtaW5pc3RyYWNpb246TW92aWxnYXM0NTY=', 'Allow-Control-Allow-Origin': '*', responseType: 'text' })
  };

  public getReport(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text', headers: this.httpOptions.headers }).pipe(
      tap(res => console.log("Report solicitado correctamente."))
    );
  }
}
