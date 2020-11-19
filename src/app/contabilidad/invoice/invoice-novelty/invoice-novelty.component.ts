import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { CarteraService } from '../../../services/cartera.service';
import { EntInvoice } from '../../../Class/EntInvoice';
import { PrincipalComponent } from '../../../principal/principal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeTransition } from '../../../routerAnimation';
import { StorageService } from '../../../services/storage.service';
import { INVOICENOVELTYTYPES } from '../../../Class/INVOICENOVELTYTYPES';
import { EntNoveltyInvoice } from '../../../Class/EntNoveltyInvoice';
import { EntProvider } from '../../../Class/EntProvider';
import { INoveltyTypes } from '../../../Class/inovelty-types';
import { currencyNotDecimal, cleanString } from '../../../util/util-lib';
// import { C } from '@angular/core/src/render3';

@Component({
  selector: 'app-invoice-novelty',
  templateUrl: './invoice-novelty.component.html',
  styleUrls: ['./invoice-novelty.component.css'],
  animations: [fadeTransition()]
})
export class InvoiceNoveltyComponent implements OnInit {
  @Input() invoice: EntInvoice;
  @Output() submiter = new EventEmitter<{ invoice: EntInvoice, result: boolean, delete: boolean }>();
  notdecimal = currencyNotDecimal();
  noveltyForm: FormGroup;
  noveltyTypes: INoveltyTypes[];
  noveltyTypeTrue: INoveltyTypes[];
  fileToUp: FileToUpDocument;
  provider: EntProvider;
  rol;
  stationcode;
 titulo: string;

  ngOnChanges(changes: SimpleChanges) {
    if (this.invoice) {
      this.utilService.loader();
      this.carteraService.getInvoice(this.invoice.id).subscribe(res => {
        this.utilService.loader(false);
        if (res && res.length == 1) {
          this.invoice = res[0];
          this.submitInvoiceForm();
        } else {
          this.principalComponent.showMsg('error', 'Error', 'No se pudo obtener la factura');
        }
      }, error => {
        console.log(error);
        this.principalComponent.showMsg('error', 'Error', error.error.message);
      });
    }
    this.provider = null;
    this.fileToUp = null;
    if (this.invoice){
        this.titulo = `FACTURA N°  ${ this.invoice.numero }           PERFIL ACTUAL :  ${ this.invoice.perfil.toUpperCase() }`
    }
  }

  constructor(
    private utilService: UtilService,
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.buildForm();
    if (this.invoice){
        this.titulo = `FACTURA N° ${ this.invoice.numero } PERFIL ACTUAL: ${ this.invoice.perfil }`
    }

  }

  ngOnInit() {
    this.noveltyTypes = INVOICENOVELTYTYPES;
    this.rol = this.storageService.getCurrentUserDecode().idRol;
    this.noveltyTypes = this.noveltyTypes.filter(e => e.rol.find(f => f === this.rol));
    this.stationcode = this.storageService.getCurrentStation();
    if (this.invoice){
        this.titulo = `FACTURA N° ${ this.invoice.numero } PERFIL ACTUAL: ${ this.invoice.perfil }`
    }
  }

  SelectedNoveltyType() {
    return this.noveltyForm.get('tipoNovedad').value;
  }

  buildForm() {
    this.noveltyForm = this.fb.group({
      tipoNovedad: ['', Validators.required],
      detalle: [''],
      file: ['', Validators.required],
      egreso: [null, Validators.required],
      saldo: [null, Validators.required],
      fechaPag: [null, Validators.required]
    });
  }

  submitInvoiceForm() {
    this.noveltyForm.reset();
    this.validateNoveltyTypesForRol();
    this.carteraService.getProvider(this.invoice.proveedor).subscribe(result => {
      if (result.length == 1) {
        this.provider = result[0];
      } else {
        this.principalComponent.showMsg('error', 'Error', 'No encuentra el proveedor');
      }
    });
  }

  submitNoveltyForm() {
    const novelty = new EntNoveltyInvoice();
    novelty.tipoNovedad = this.noveltyForm.get('tipoNovedad').value.id;
    novelty.detalle = cleanString(this.noveltyForm.get('detalle').value);
    novelty.facturaId = this.invoice.id;
    novelty['numero'] = this.invoice.numero;
    novelty.rol = this.rol;
    novelty.usuario = this.storageService.getCurrentUserDecode().Usuario;
    novelty['file'] = this.fileToUp;
    novelty['egreso'] = this.noveltyForm.get('egreso').value;
    novelty['fechaPag'] = this.noveltyForm.get('fechaPag').value;
    novelty['provider'] = this.provider;
    novelty['saldo'] = this.noveltyForm.get('saldo').value;
    if (this.SelectedNoveltyType() && this.SelectedNoveltyType().id == 5) {
      this.utilService.confirm('Va a devolver la factura. ¿Desea continuar?', res => {
        if (res) {
          this.savenovelty(novelty);
        }
      });
    } else if (this.noveltyForm.get('saldo').enabled && this.invoice.saldo == novelty['saldo']) {
      this.utilService.confirm('¿Desea continuar sin modificar el saldo a pagar ($' + this.invoice.saldo.toLocaleString() + ')?', res => {
        {
          if (res) {
            this.savenovelty(novelty);
          }
        }
      });
    } else {
      this.savenovelty(novelty);
           }
  }

  savenovelty(novelty: EntNoveltyInvoice) {
    this.utilService.loader(true);
    this.carteraService.InsertNoveltyInvoice(novelty).subscribe(result => {
      this.utilService.loader(false);
      this.validateNoveltyTypesForRol();
      this.validInvoice(true);
      this.principalComponent.showMsg('success', 'Éxito', 'Novedad insertada con éxito a la factura ' + this.invoice.numero);
    }, error => {
      this.utilService.loader(false);
      this.validInvoice(false);
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  fileChange($event) {
    if ($event.target.files.length > 0) {
      const size = $event.target.files[0].size / 1024 / 1024;
      if (size > 2) {
        this.principalComponent.showMsg('error', 'Error', 'El tamaño del archivo excede los 2 MB');
        this.noveltyForm.controls['file'].setValue(null);
        this.fileToUp = null;
        return;
      }
      if ($event.target.files[0].type != 'application/pdf') {
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
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.fileToUp = { name: inputValue.name, code: myReader.result };
      this.utilService.loader(false);
    };
    myReader.readAsDataURL(inputValue);
  }

  validateNoveltyTypesForRol() {
    const invoicelocal = this.invoice;
    // this.validForm();
    this.validateNoveltyTypesForRol2(invoicelocal);
  }

  validateNoveltyTypesForRol2(invoice: EntInvoice) {
    const estadoFactura = [
      { inicio: 0, destino: [1, 9] },
      { inicio: 1, destino: [2, 9, 10] },
      { inicio: 2, destino: [1, 3, 4, 5, 6, 7, 9, 10, 13] },
      { inicio: 3, destino: [2, 4, 5, 10, 9] },
      { inicio: 4, destino: [2, 10, 9] },
      { inicio: 5, destino: [2, 10, 9] },
      { inicio: 6, destino: [13, 10, 9, 5] },
      { inicio: 7, destino: [10, 11, 1, 18] },
      { inicio: 13, destino: [1, 10] }

    ];

    let noveltyTypesLocal: INoveltyTypes[] = [];
    this.noveltyTypes.forEach(e => {
      noveltyTypesLocal.push(e);
    });

    try {
      noveltyTypesLocal = noveltyTypesLocal.filter(e =>
        estadoFactura.filter(f => f.inicio === invoice.estado)[0].destino.indexOf(e.id) >= 0
      );
    } catch (error) {
      noveltyTypesLocal = [];
    }

    this.noveltyTypeTrue = noveltyTypesLocal;
    if (this.noveltyTypeTrue.length > 0) {
      this.noveltyForm.get('tipoNovedad').setValue(this.noveltyTypeTrue[0]);
    } else {
      this.noveltyForm.get('tipoNovedad').setValue(null);
    }
    this.validForm();
  }

  validForm() {
    if (!this.SelectedNoveltyType()) {
      return;
    }
    if (this.SelectedNoveltyType().id === 7) {
      this.noveltyForm.get('file').enable();
      this.noveltyForm.get('egreso').enable();
      this.noveltyForm.get('fechaPag').enable();
    } else {
      this.noveltyForm.get('file').disable();
      this.noveltyForm.get('egreso').disable();
      this.noveltyForm.get('fechaPag').disable();
    }
    if (this.SelectedNoveltyType().id == 6) {
      this.noveltyForm.get('saldo').setValue(this.invoice.saldo);
      this.noveltyForm.get('saldo').enable();
      if (this.invoice.saldo == 0) {
        this.noveltyForm.get('egreso').enable();
      } else {
        this.noveltyForm.get('egreso').disable();
      }
    } else {
      this.noveltyForm.get('saldo').disable();
    }
  }

  validInvoice(val: boolean) {
    if (val) {
      this.utilService.loader(true);
      this.carteraService.getInvoicesPending(this.rol, this.stationcode, this.invoice.id, false, true, true).subscribe(result => {
        if (result && result.length == 1) {
          this.submiter.emit({ invoice: result[0], result: val, delete: false });
        } else {
          this.submiter.emit({ invoice: this.invoice, result: val, delete: true });
        }
        this.utilService.loader(false);
      }, error => {
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        console.log(error);
        this.utilService.loader(false);
      });
    } else {
      this.submiter.emit({ invoice: this.invoice, result: val, delete: null });
    }
  }
}

interface FileToUpDocument {
  name: string;
  code: any;
}
