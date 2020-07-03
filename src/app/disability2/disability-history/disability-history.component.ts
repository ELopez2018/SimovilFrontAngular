import { Component, OnInit, Input, Output } from '@angular/core';
import { INoveltyTypes } from '../../Class/inovelty-types';
import { EntDisability } from '../../Class/EntDisability';
import { EntAdministrator } from '../../Class/EntAdministrator';
import { DISABILITNOVELTYTYPES } from '../../Class/DISABILITYNOVELTYTYPES';
import { EntDisabilityNovelty } from '../../Class/EntDisabilityNovelty';

@Component({
  selector: 'app-disability-history',
  templateUrl: './disability-history.component.html',
  styleUrls: ['./disability-history.component.css']
})
export class DisabilityHistoryComponent implements OnInit {

  @Input() disability: EntDisability;
  @Input() administrators: EntAdministrator[];
  noveltyTypes: INoveltyTypes[];

  constructor(
  ) {
  }

  ngOnInit() {
    this.noveltyTypes = DISABILITNOVELTYTYPES;
  }

  getNameNovelty(value: number) {
    let novelty = this.noveltyTypes.find(e => e.id == value);
    return novelty == null ? '' : novelty.name;
  }

}
