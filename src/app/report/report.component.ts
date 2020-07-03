import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../services/cartera.service';
import { PrincipalComponent } from '../principal/principal.component';
import { EntConsumptionClient } from '../Class/EntConsumptionClient';
import { Title } from '@angular/platform-browser';
import { PrintService } from '../services/print.service';
import { fadeTransition } from '../routerAnimation';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class ReportComponent implements OnInit {

  constructor(
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    private printService: PrintService
  ) {
    this.title.setTitle('Informes - Simovil');
  }

  ngOnInit() {
  }

  public doughnutChartLabels: string[] = ['Vencidas', 'Sin vencer'];
  public doughnutChartData: number[] = [53, 85];
  public doughnutChartType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
