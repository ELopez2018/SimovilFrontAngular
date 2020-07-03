import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { iTableConfig, TABLEINVOICEPENDING } from '../../Class/TABLES_CONFIG';

@Component({
  selector: 'app-table-config',
  templateUrl: './table-config.component.html',
  styleUrls: ['./table-config.component.css']
})
export class TableConfigComponent implements OnInit {
  @Input() tableName: string;
  @Output() submiter = new EventEmitter<boolean>();
  dataTable: iTableConfig[];

  constructor(
    private storageService: StorageService
  ) {
  }

  ngOnChanges(chages: SimpleChanges) {
    if (this.tableName) {
      this.dataTable = this.storageService.getTableConfg(this.tableName);
      console.log(this.dataTable);
    }
  }

  ngOnInit() {
  }

  save(bool: boolean) {
    if (bool)
      this.storageService.setTableConfg(this.tableName, this.dataTable);
    this.submiter.emit(true);
  }
}
