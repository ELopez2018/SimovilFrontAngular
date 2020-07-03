import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntAdvance } from '../../../Class/EntAdvance';
import { EntProvider } from '../../../Class/EntProvider';
import { UtilService } from '../../../services/util.service';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';
import { ADVANCENOVELTYTYPES } from '../../../Class/ADVANCENOVELTYTYPES';
import { EntNoveltyAdvance } from '../../../Class/EntNoveltyAdvance';
import { fadeTransition } from '../../../routerAnimation';
import { INoveltyTypes } from '../../../Class/inovelty-types';

@Component({
  selector: 'app-advance-novelty',
  templateUrl: './advance-novelty.component.html',
  styleUrls: ['./advance-novelty.component.css'],
  animations: [fadeTransition()]
})
export class AdvanceNoveltyComponent implements OnInit {
  @Input() advance: EntAdvance;
  @Output() submiter = new EventEmitter<{ advance: EntAdvance, result: boolean, delete: boolean }>();
  noveltyForm: FormGroup;
  noveltyTypes: INoveltyTypes[];
  noveltyTypeTrue: INoveltyTypes[];
  fileToUp: FileToUpDocument;
  myReader: FileReader;
  provider: EntProvider;
  rol;

  constructor(
    private utilService: UtilService,
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.noveltyTypes = ADVANCENOVELTYTYPES;
    this.rol = this.storageService.getCurrentUserDecode().idRol;
    this.noveltyTypes = this.noveltyTypes.filter(e => e.rol.find(f => f == this.rol));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.advance)
      this.submitAdvanceForm();
  }

  SelectedNoveltyType() {
    return this.noveltyForm.get('tipoNovedad').value;
  }

  buildForm() {
    this.noveltyForm = this.fb.group({
      tipoNovedad: ['', Validators.required],
      detalle: [''],
      file: ['', Validators.required]
    });
  }

  submitAdvanceForm() {
    this.noveltyForm.reset();
    this.validateNoveltyTypesForRol();
    this.carteraService.getProvider(this.advance.proveedor).subscribe(result => {
      if (result.length == 1)
        this.provider = result[0];
      else {
        this.principalComponent.showMsg('error', 'Error', 'No encuentra el proveedor');
      }
    })
  }

  submitNoveltyForm() {
    let novelty = new EntNoveltyAdvance();
    novelty.tipoNovedad = this.noveltyForm.get('tipoNovedad').value.id;
    novelty.detalle = String(this.noveltyForm.get('detalle').value || '').trim();
    novelty.anticipoId = this.advance.idAnticipo;
    novelty.perfil = this.rol;
    novelty.usuario = this.storageService.getCurrentUserDecode().Usuario;
    novelty['file'] = this.fileToUp;
    novelty['provider'] = this.provider;
    this.utilService.loader(true);
    this.carteraService.InsertNoveltyAdvance(novelty).subscribe(result => {
      this.utilService.loader(false);
      this.validateNoveltyTypesForRol();
      this.validAdvance(true);
      this.principalComponent.showMsg('success', 'Éxito', 'Novedad insertada con éxito');
    }, error => {
      this.validAdvance(false);
      this.utilService.loader(false);
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  fileChange($event) {
    if ($event.target.files.length > 0) {
      let size = $event.target.files[0].size / 1024 / 1024;
      if (size > 2) {
        this.principalComponent.showMsg('error', 'Error', 'El tamaño del archivo excede los 2 MB');
        this.noveltyForm.controls['file'].setValue(null);
        this.fileToUp = null;
        return;
      }
      if ($event.target.files[0].type != "application/pdf") {
        this.principalComponent.showMsg('error', 'Error', 'Se permite solo archivos PDF');
        this.noveltyForm.controls['file'].setValue(null);
        this.fileToUp = null;
        return;
      }
      this.readThis($event.target.files[0]);
    }
  }

  readThis(inputValue: File): void {
    this.utilService.loader(true);
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileToUp = { name: inputValue.name, code: myReader.result };
      this.utilService.loader(false);
    }
    myReader.readAsDataURL(inputValue);
  }

  validateNoveltyTypesForRol() {
    let advancelocal = this.advance;
    this.validateNoveltyTypesForRol2(advancelocal);
  }

  validateNoveltyTypesForRol2(advance: EntAdvance) {
    // var estadoFactura = [
    //   { inicio: 0, destino: [1, 2] },
    //   { inicio: 1, destino: [3] }
    // ];
    var estadoFactura = [
      { inicio: 0, destino: [2, 3] },
      { inicio: 1, destino: [3] }
    ];
    let noveltyTypesLocal: INoveltyTypes[] = [];
    this.noveltyTypes.forEach(e => {
      noveltyTypesLocal.push(e)
    });

    try {
      noveltyTypesLocal = noveltyTypesLocal.filter(e =>
        estadoFactura.filter(f => f.inicio == advance.estado)[0].destino.indexOf(e.id) >= 0
      );
    } catch (error) {
      noveltyTypesLocal = [];
    }

    this.noveltyTypeTrue = noveltyTypesLocal;
    if (this.noveltyTypeTrue.length > 0)
      this.noveltyForm.get('tipoNovedad').setValue(this.noveltyTypeTrue[0]);
    else
      this.noveltyForm.get('tipoNovedad').setValue(null);
    this.validForm();
  }

  validForm() {
    if (this.SelectedNoveltyType() && this.SelectedNoveltyType().id == 3) {
      this.noveltyForm.get('file').enable();
      this.noveltyForm.get('detalle').setValidators(Validators.required);
    }
    else {
      this.noveltyForm.get('file').disable();
      this.noveltyForm.get('detalle').clearValidators();
    }
  }

  validAdvance(val: boolean) {
    if (val) {
      this.utilService.loader(true);
      this.carteraService.getAdvancesPending(this.rol, this.advance.idAnticipo).subscribe(result => {
        if (result && result.length == 1) {
          result[0].novedadAnticipo = JSON.parse(String(result[0].novedadAnticipo));
          this.submiter.emit({ advance: result[0], result: val, delete: false });
        }
        else
          this.submiter.emit({ advance: this.advance, result: val, delete: true });
        this.utilService.loader(false);
      }, error => {
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        console.log(error);
        this.utilService.loader(false);
      });
    } else {
      this.submiter.emit({ advance: this.advance, result: val, delete: null });
    }
  }
}

interface FileToUpDocument {
  name: string;
  code: any;
}