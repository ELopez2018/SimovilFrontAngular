import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { EntRole } from '../../../Class/EntRole';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntProfile } from '../../../Class/EntProfile';
import { forkJoin } from 'rxjs';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-role-perfil',
  templateUrl: './role-perfil.component.html',
  styleUrls: ['./role-perfil.component.css']
})
export class RolePerfilComponent implements OnInit {
  @Input() role: EntRole;
  @Output() submiter = new EventEmitter<boolean>();
  profiles: EntProfile[];
  profilesSM: EntProfile[];
  profilesAc: EntProfile[];
  user;

  constructor(
    private carteraService: CarteraService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private storageService : StorageService
  ) { }

  ngOnInit() {
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnChanges(changes: OnChanges) {
    if (this.role) {
      this.getProfiles();
    }
  }

  getProfiles() {
    this.utilService.loader(true);
    forkJoin(
      this.carteraService.GetProfiles(null, null, this.role.ID),
      this.carteraService.GetProfiles()
    ).subscribe(([res1, res2]) => {
      this.utilService.loader(false);
      this.assignProfilesSel(res1, res2);
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  assignProfilesSel(sel: EntProfile[], all: EntProfile[]) {
    this.profiles = all;
    this.profilesAc = sel;
    let arr = [];
    sel.map(e => arr.push(e.ID));
    this.profilesSM = Object.assign(all);
    this.profiles.map(tod => {
      if (arr.includes(tod.ID))
        tod['sel'] = true;
      else
        tod['sel'] = false;
    });
  }

  cancel() {
    this.submiter.emit(false);
  }

  save() {
    let act = [];
    this.utilService.loader(true);
    this.profiles.map(e => e['sel'] ? act.push(e.ID) : null);
    this.carteraService.AssignProfile(this.role.ID, act, this.user).subscribe(result => {
      this.utilService.loader(false);
      this.submiter.emit(true);
      this.principal.showMsg('success', 'Éxito', 'Perfiles asignados correctamente');
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      this.utilService.loader(false);
    });
  }
}
