import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollService {

  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollTo(id : string) {
    
    const config: ScrollToConfigOptions = {
      target: id
    };

    this._scrollToService.scrollTo(config);
  }

}
