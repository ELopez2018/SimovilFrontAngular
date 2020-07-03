import { Component, OnInit, Input } from '@angular/core';
import { EntAdvance } from '../../../Class/EntAdvance';
import { ADVANCENOVELTYTYPES } from '../../../Class/ADVANCENOVELTYTYPES';
import { INoveltyTypes } from '../../../Class/inovelty-types';

@Component({
  selector: 'app-advance-history',
  templateUrl: './advance-history.component.html',
  styleUrls: ['./advance-history.component.css']
})
export class AdvanceHistoryComponent implements OnInit {

  @Input() advance: EntAdvance;
  noveltyTypes: INoveltyTypes[];

  constructor() {
  }

  ngOnInit() {
    this.noveltyTypes = ADVANCENOVELTYTYPES;
  }

  getNameNovelty(value: number) {
    let novelty = this.noveltyTypes.find(e => e.id == value);
    return novelty == null ? '' : novelty.name;
  }
}
