import { Component, OnInit } from '@angular/core';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { EntOption } from '../../../Class/EntOption';

@Component({
  selector: 'app-option-search',
  templateUrl: './option-search.component.html',
  styleUrls: ['./option-search.component.css']
})
export class OptionSearchComponent implements OnInit {
  searchString: string = '';
  searchStatus: boolean;
  options: EntOption[];
  optionSel: EntOption;
  boolEdit = false;

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Buscar opciones')
  }

  ngOnInit() {
  }

  getOption() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchString.trim() == '')
      buscar = null;
    else
      buscar = this.searchString.trim().replace(' ', "%");
    this.carteraService.GetOptions(null, buscar, this.searchStatus).subscribe(result => {
      this.options = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clear() {
    this.options = [];
    this.searchString = '';
    this.searchStatus = null;
  }

  delete(opcion: EntOption) {
    this.utilService.confirm('¿Desea eliminar la opcion "' + opcion.DESCRIPCION + '"?', data => {
      if (data) {
        this.carteraService.DeleteOption(opcion).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Opción "' + opcion.DESCRIPCION + '" eliminada correctamente.');
          this.options = this.options.filter(e => e.ID != opcion.ID);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  clone(opcion: EntOption) {
    this.utilService.confirm('¿Desea clonar la opcion "' + opcion.DESCRIPCION + '"?', data => {
      if (data) {
        this.carteraService.CloneOption(opcion).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Opción "' + opcion.DESCRIPCION + '" clonada correctamente.');
          this.utilService.confirm('Desea refrescar la busqueda', res => {
            if (res)
              this.getOption();
          });
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  edit(opcion: EntOption) {
    this.boolEdit = true;
    this.optionSel = opcion;
  }

  resultEdit(res: { option: EntOption, result: boolean }) {
    if (res.result) {
      let index = this.options.findIndex(e => e.ID == res.option.ID);
      this.options[index] = res.option;
    }
    this.boolEdit = false;
  }
}
