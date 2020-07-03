import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { EntDisability } from '../../Class/EntDisability';
import { INoveltyTypes } from '../../Class/inovelty-types';
import { EntAdministrator } from '../../Class/EntAdministrator';
import { DISABILITNOVELTYTYPES } from '../../Class/DISABILITYNOVELTYTYPES';
import { EntDisabilityNovelty } from '../../Class/EntDisabilityNovelty';
import { NominaService } from '../../services/nomina.service';

@Component({
  selector: 'app-disability-novelty',
  templateUrl: './disability-novelty.component.html',
  styleUrls: ['./disability-novelty.component.css']
})
export class DisabilityNoveltyComponent implements OnInit {
  @Input() disability: EntDisability;
  @Output() submiter = new EventEmitter<{ result: boolean, disability: EntDisability }>();

  ngOnChanges(changes: SimpleChanges) {
    this.assingDisability();
  }

  disabilityForm: FormGroup;
  noveltyForm: FormGroup;
  noveltyTypes: INoveltyTypes[];
  noveltyTypeTrue: INoveltyTypes[];
  administrators: EntAdministrator;
  rol;

  constructor(
    private utilService: UtilService,
    private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.noveltyTypes = DISABILITNOVELTYTYPES;
    this.rol = this.storageService.getCurrentUserDecode().idRol;
    this.noveltyTypes = this.noveltyTypes.filter(e => e.rol.find(f => f == this.rol));
  }

  SelectedNoveltyType() {
    return this.noveltyForm.get('tipoNovedad').value;
  }

  buildForm() {
    this.disabilityForm = this.fb.group({
      numero: ['', Validators.required],
      nombre: ['', Validators.required],
      dias: ['', Validators.required],
      saldo: ['', Validators.required]
    });
    this.disabilityForm.disable();
    this.noveltyForm = this.fb.group({
      tipoNovedad: ['', Validators.required],
      detalle: ['', Validators.required]
    });
  }

  assingDisability() {
    if (this.disability) {
      this.disabilityForm.setValue({
        numero: this.disability.id,
        nombre: this.disability.primerNombre + ' ' + this.disability.primerApellido,
        dias: this.disability.dias,
        saldo: this.disability.saldo
      });
      this.validateNoveltyTypesForRol2(this.disability);
    }
  }

  submitNoveltyForm() {
    let novelty = new EntDisabilityNovelty();
    novelty.incapacidadId = this.disability.id;
    novelty.tipoNovedad = this.noveltyForm.get('tipoNovedad').value.id;
    novelty.usuario = this.storageService.getCurrentUserDecode().Usuario;
    novelty.detalle = String(this.noveltyForm.get('detalle').value).trim();
    this.utilService.loader(true);
    this.nominaService.InsertNoveltyDisability(novelty).subscribe(result => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Novedad insertada con éxito a la incapacidad ' + this.disability.id);
      this.disability.estado = novelty.tipoNovedad;
      this.submiter.emit({ result: true, disability: this.disability });
      // this.noveltyForm.reset();
    }, error => {
      this.utilService.loader(false);
      this.submiter.emit({ result: false, disability: this.disability });
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  cancelNovelty() {
    this.submiter.emit({ result: false, disability: null });
  }

  validateNoveltyTypesForRol2(invoice: EntDisability) {
    var estadoIncapacidad = [
      { inicio: 0, destino: [] },
      { inicio: 1, destino: [2, 3] },
      { inicio: 3, destino: [5, 0] }
    ];

    let noveltyTypesLocal: INoveltyTypes[] = [];
    this.noveltyTypes.forEach(e => {
      noveltyTypesLocal.push(e)
    });

    try {
      noveltyTypesLocal = noveltyTypesLocal.filter(e =>
        estadoIncapacidad.filter(f => f.inicio == invoice.estado)[0].destino.indexOf(e.id) >= 0
      );
    } catch (error) {
      noveltyTypesLocal = [];
    }

    this.noveltyForm.reset();
    this.noveltyTypeTrue = noveltyTypesLocal;
    if (this.noveltyTypeTrue.length > 0)
      this.noveltyForm.get('tipoNovedad').setValue(this.noveltyTypeTrue[0]);
    else
      this.noveltyForm.get('tipoNovedad').setValue(null);
  }

}