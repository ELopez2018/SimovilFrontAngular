import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  visible = false;
  constructor(
    private utilService: UtilService
  ) {
    this.utilService.loader$.subscribe(data => {
      this.visible = data
    });
  }

  ngOnInit() {
  }


}
