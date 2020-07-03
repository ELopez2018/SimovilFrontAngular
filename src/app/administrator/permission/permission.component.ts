import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { EntOption } from '../../Class/EntOption';
import { CarteraService } from '../../services/cartera.service';
import { UtilService } from '../../services/util.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { EntPermission } from '../../Class/EntPermission';
import { EntProfile } from '../../Class/EntProfile';
import { NominaService } from '../../services/nomina.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
  @Input() profile: EntProfile;
  @Output() submiter = new EventEmitter<boolean>();
  options: EntOption[] = [];
  optionsAll: EntOption[];
  permission: EntPermission[];
  opcionSel: EntOption;
  opcionRaiz = new EntOption();
  opcionSinMod: EntOption[] = [];
  user;

  constructor(
    private carteraService: CarteraService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private nomina: NominaService,
    private storageService: StorageService
  ) {
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.getOptions();
    this.opcionRaiz.DESCRIPCION = 'Raiz'
    this.opcionRaiz.HIJO = [];
  }

  ngOnChanges(changes: OnChanges) {
    if (this.profile)
      this.getPermission();
  }

  getOptions() {
    this.utilService.loader(true);
    this.carteraService.GetOptions().subscribe(result => {
      this.optionsAll = result;
      this.orderoption2(result);
      this.utilService.loader(false);
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  orderoption2(options: EntOption[]) {
    let arrayn = [];
    options.map(e => {
      if (e.OPCION_PADRE != null)
        arrayn.findIndex(el => el == e) >= 0 ? null : arrayn.push(e.OPCION_PADRE)
    });
    var temp = options.filter(f => arrayn.includes(f.ID) || f.OPCION_PADRE == null);
    temp.forEach(element => {
      element['class'] = 'dropdown-menu';
      element.HIJO = this.returnChild(element);
    });
    if (temp.filter(e => e.OPCION_PADRE != null).length > 0)
      temp = this.orderoption2(temp);
    else {
      this.opcionRaiz.HIJO = temp;
      this.options[0] = this.opcionRaiz;
      return temp;
    }
  }

  returnChild(option: EntOption): EntOption[] {
    return this.optionsAll.filter(e => e.OPCION_PADRE == option.ID);
  }

  classItem(option: EntOption) {
    let res;
    if (option.HIJO && option.HIJO.length > 0) {
      res = option['class'] == 'dropdown-menu' ? 'far fa-folder fa-fw' : 'far fa-folder-open fa-fw';
    } else
      res = 'fa fa-check fa-fw'
    return res;
  }

  show(option: EntOption) {
    switch (option['class']) {
      case 'dropdown-menu':
        option['class'] = 'dropdown-menu-show';
        break;
      case 'dropdown-menu-show':
        option['class'] = 'dropdown-menu';
        break;
      default:
        option['class'] = 'dropdown-menu-show';
    }
  }

  getPermission() {
    this.utilService.loader(true);
    this.nomina.GetPermissionBasic(this.profile.ID).subscribe(result => {
      this.utilService.loader(false);
      this.permission = result;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
    this.opcionSel = null;
    this.opcionSinMod = [];
  }

  classStatus(val: boolean) {
    let res = val ? 'fa fa-check-circle fa-fw text-success' : 'fa fa-times-circle fa-fw text-danger'
    return res;
  }

  save() {
    this.utilService.loader(true);
    let changes: EntPermission[] = [];
    this.opcionSel.HIJO.map(opc => {
      let sinmo = this.opcionSinMod.find(sinmod => sinmod.ID == opc.ID);
      let objnew = this.diferencia(sinmo, opc);
      if (Object.keys(objnew).length > 0)
        changes.push(objnew);
    });
    this.nomina.AssignPermissions(changes, this.user).subscribe(e => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'Permisos asignados correctamente');
      this.submiter.emit(true);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      this.utilService.loader(false);
      console.log(error);
    });
  }

  diferencia(obj, obj2) {
    let objnew = new EntPermission();
    if (obj.TODO != obj2.TODO)
      objnew.TODO = obj2.TODO;
    if (obj.BORRAR != obj2.BORRAR)
      objnew.BORRAR = obj2.BORRAR;
    if (obj.CREAR != obj2.CREAR)
      objnew.CREAR = obj2.CREAR;
    if (obj.VISIBLE != obj2.VISIBLE)
      objnew.VISIBLE = obj2.VISIBLE;
    if (obj.ACTUALIZAR != obj2.ACTUALIZAR)
      objnew.ACTUALIZAR = obj2.ACTUALIZAR;
    if (obj.LEER != obj2.LEER)
      objnew.LEER = obj2.LEER;
    if (obj.IMPRIMIR != obj2.IMPRIMIR)
      objnew.IMPRIMIR = obj2.IMPRIMIR;
    if (Object.keys(objnew).length > 0) {
      objnew.ID_PERFIL = this.profile.ID;
      objnew.ID_OPCION = obj.ID;
      return objnew;
    } else
      return new EntPermission();
  }

  cancel() {
    this.submiter.emit(false);
  }

  optionSelF(opcion: EntOption) {
    this.opcionSinMod = [];
    if (opcion.HIJO && opcion.HIJO.length > 0) {
      opcion.HIJO.forEach(opc => {
        var hijo = this.permission.find(permiso => permiso.ID_OPCION == opc.ID);
        if (hijo == null) {
          opc['TODO'] = false;
          opc['CREAR'] = false;
          opc['LEER'] = false;
          opc['BORRAR'] = false;
          opc['ACTUALIZAR'] = false;
          opc['IMPRIMIR'] = false;
        } else {
          opc['TODO'] = hijo.TODO ? true : false;
          opc['CREAR'] = hijo.CREAR ? true : false;
          opc['LEER'] = hijo.LEER ? true : false;
          opc['BORRAR'] = hijo.BORRAR ? true : false;
          opc['ACTUALIZAR'] = hijo.ACTUALIZAR ? true : false;
          opc['IMPRIMIR'] = hijo.IMPRIMIR ? true : false;
        }
        if (opc.HIJO && opc.HIJO.length > 0)
          this.optionSelFRepeat(opc);
        this.opcionSinMod.push(Object.assign({}, opc));
      });
    }
    this.opcionSel = opcion;
  }

  optionSelFRepeat(opcion: EntOption) {
    if (opcion.HIJO && opcion.HIJO.length > 0) {
      opcion.HIJO.forEach(opc => {
        var hijo = this.permission.find(permiso => permiso.ID_OPCION == opc.ID);
        if (hijo == null) {
          opc['TODO'] = false;
          opc['CREAR'] = false;
          opc['LEER'] = false;
          opc['BORRAR'] = false;
          opc['ACTUALIZAR'] = false;
          opc['IMPRIMIR'] = false;
        } else {
          opc['TODO'] = hijo.TODO ? true : false;
          opc['CREAR'] = hijo.CREAR ? true : false;
          opc['LEER'] = hijo.LEER ? true : false;
          opc['BORRAR'] = hijo.BORRAR ? true : false;
          opc['ACTUALIZAR'] = hijo.ACTUALIZAR ? true : false;
          opc['IMPRIMIR'] = hijo.IMPRIMIR ? true : false;
        }
      });
    }
    return opcion;
  }

  classSel(opc: EntOption) {
    let res = this.opcionSel && this.opcionSel.ID == opc.ID ? 'seleccionada' : '';
    return res;
  }
}