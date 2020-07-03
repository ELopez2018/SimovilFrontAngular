import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EntStation, articulo_estacion } from '../../../Class/EntStation';
import { fadeTransition } from '../../../routerAnimation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntArticle } from '../../../Class/EntArticle';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-bs-art',
  templateUrl: './bs-art.component.html',
  styleUrls: ['./bs-art.component.css'],
  animations: [fadeTransition()]
})
export class BsArtComponent implements OnInit {
  @Input() station: EntStation;
  @Output() submiter = new EventEmitter<{ obj: EntStation, result: boolean }>();
  form: FormGroup;
  articles: EntArticle[];
  articlesBef: EntArticle[];
  index: number;
  articlesStation: articulo_estacion[];
  status: boolean = true;
  user;
  sending = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.station) {
      this.articlesStation = JSON.parse(JSON.stringify(this.station.articulos)) || [];
      this.cancel();
    }
    else
      this.articlesStation = [];
  }

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private storageService: StorageService
  ) {
    this.user = storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.buildForm();
    this.carteraService.getArticles().subscribe(res => {
      this.articles = res;
      this.articlesBef = JSON.parse(JSON.stringify(res));
    }, error => {
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }
  buildForm(): any {
    this.form = this.fb.group({
      ID_ARTICULO: ['', [Validators.required]],
      // ID_ESTACION: ['', [Validators.required]],
      VALOR: ['', [Validators.required]],
      VALOR_ANT: ['', [Validators.required]],
      FECHA: ['', [Validators.required]],
      TURNO: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      CAM_VAL: ['', [Validators.required]]
    });
    this.form.disable();
  }

  edit(item: articulo_estacion) {
    if (this.status)
      this.resetStationsList();
    this.status = false;
    this.index = this.articlesStation.findIndex(e => e == item);
    this.form.setValue({
      ID_ARTICULO: this.articles.find(e => e.ID == item.ID_ARTICULO),
      // ID_ESTACION: item.ID_ESTACION,
      VALOR: item.VALOR,
      VALOR_ANT: item.VALOR_ANT,
      FECHA: item.FECHA,
      TURNO: item.TURNO,
      CAM_VAL: item.CAM_VAL,
    });
    this.form.enable();
    this.form.get('ID_ARTICULO').disable();
  }

  getnameArt(val: number) {
    return this.articlesBef.find(e => e.ID === val).DESCRIPCION || '';
  }

  submitForm(isNew?: boolean) {
    let resForm = this.form.getRawValue() as articulo_estacion;
    resForm.ID_ARTICULO = (<any>resForm.ID_ARTICULO as EntArticle).ID;
    if (isNew)
      this.articlesStation.push(resForm);
    else
      this.articlesStation[this.index] = resForm;
    this.cancel();
  }

  cancel() {
    this.form.reset();
    this.form.disable();
    this.status = true;
    this.resetStationsList();
  }

  save() {
    console.log(this.articlesStation);
    this.articlesStation.forEach(e => {
      e.ID_ESTACION = this.station.idEstacion;
      e.USUARIO = this.user;
    });
    this.sending = true;
    this.utilService.loader(true);
    this.nominaService.InsertStationArticle(this.articlesStation, this.station.idEstacion).subscribe(res => {
      this.principal.showMsg('success', 'Éxito', 'Actualizado correctamente los articulos de la estación');
      this.utilService.loader(false);
      this.nominaService.GetStations(this.station.idEstacion).subscribe(re => {
        this.submiter.emit({ obj: re[0], result: true });
      }, error => {
        console.log(error);
        this.principal.showMsg('error', 'Error', error.error.message);
      }, () => this.sending = false)
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  newItem() {
    if (this.articlesStation && this.articlesStation.length > 0)
      this.articles = this.articles.filter(e => {
        return this.articlesStation.find(f => f.ID_ARTICULO == e.ID) ? false : true
      });
    this.form.enable();
    this.form.reset();
    this.form.get('CAM_VAL').setValue(false);
    if (this.articles.length > 0)
      this.form.get('ID_ARTICULO').setValue(this.articles[0]);
  }

  end1() {
    this.submiter.emit({ obj: null, result: false });
  }

  resetStationsList() {
    this.articles = JSON.parse(JSON.stringify(this.articlesBef));
  }

  del(item: articulo_estacion) {
    this.articlesStation = this.articlesStation.filter(e => e.ID_ARTICULO != item.ID_ARTICULO);
  }
}
