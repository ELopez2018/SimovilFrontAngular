import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OrderParametersToGet } from '../../util/util-lib';
import { SsrsService } from '../../services/ssrs.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-report-ssrs',
  templateUrl: './report-ssrs.component.html',
  styleUrls: ['./report-ssrs.component.css']
})
export class ReportSSRSComponent implements OnInit {
  @Input() https = false;
  @Input() serverReport: string;
  @Input() urlReport: string;
  @Input() showParameter: boolean;
  @Input() show = false;
  @Input() parameters: any[];
  @Input() width = 100;

  url;

  @ViewChild('iframeSSRS') iframe: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private ssrsService: SsrsService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(chage: SimpleChanges) {
    if (this.urlReport && this.show) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.getUrlReport());
    }
  }

  getUrlReport() {
    let url = '';
    this.https ? url = 'https' : 'http';
    url += '://' + this.serverReport + '/Pages/ReportViewer.aspx?/' + this.urlReport;
    const param = [...this.parameters];
    param.push(
      [this.showParameter, 'rc:Parameters'],
      ['Render', 'rs:Command'],
      [true, 'rs:embed'],
      [this.width, 'rc:Zoom']
    );
    url = OrderParametersToGet(url, param, '&');
    console.log(url);
    return url;
  }
}
