import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntProductos } from '../../../../Class/EntProductos';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { FileImagen } from '../../../../Class/FileImagen';
import { Title } from '@angular/platform-browser';
import { SubirArchivoService } from '../../../../services/subir-archivo.service';
import { NominaService } from '../../../../services/nomina.service';
import { SelectItem } from 'primeng/api';




@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})

export class ProductAddComponent implements OnInit {

  imagenSubir: File;
  ArchivoASubir: any;
  imagenTemp: any;
  CodigoContable: any;
  ExtencionArchivo: any;
  ProductosCategorias: SelectItem[];
  ProductoMileniumgas: boolean;
  Si: boolean = false;
  forma: FormGroup;
  Producto: EntProductos = new EntProductos;
  selectedCat: Categoria = { id: 0, descripcion: '' };
  centroCostos: SelectItem[];
  displayDialog: boolean = false;
  mostrar: boolean = true;
  public archivos: FileImagen[] = [];

  constructor(private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    public _subirArchivoService: SubirArchivoService,
  ) {
    this.title.setTitle('Crear Productos - Simovil');
    this.imagenTemp = '../../../../../assets/img/sinimagen.jpg';
    this.forma = new FormGroup({
      'CodContable': new FormControl(''),
      'Descripcion': new FormControl('', [Validators.required, Validators.minLength(5)]),
      'Marca': new FormControl(''),
      'Presentacion': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'Tamano': new FormControl('', Validators.required),
      'Color': new FormControl(''),
      'Detalles': new FormControl(''),
      'tope': new FormControl(''),
      'BarCode': new FormControl(''),
      'Mileniumgas': new FormControl(true),
      'IdCategoria': new FormControl(null, [Validators.required]),
      'empresa': new FormControl(null)
      // #selectedCat1 (onChange)="Funcion(selectedCat1 )"
    });
    this.ProductosCategorias = [{ label: ' SELECCIONE LA CATEGORIA  ', value: null }];
    this.centroCostos = [{ label: ' SELECCIONE LA EMPRESA  ', value: null }];
  }

  GetCategorias() {
    this.nominaService.GetCategorias().subscribe(data => {
      this.ProductosCategorias = data;
      this.ProductosCategorias.unshift({ label: 'SELECCIONE LA CATEGORIA ', value: null });
    }, error => {
      console.log(error);
    });
  }
  GetEmpresas() {
    this.nominaService.GetEmpresas().subscribe(data => {
      this.centroCostos = [];
      data.forEach((elemento: any) => {
        this.centroCostos.push({
          label: elemento.nombre + ' (' + elemento.marca + ')',
          value: elemento.nit
        });
      });
      this.centroCostos.unshift({ label: 'SELECCIONE LA EMPRESA ', value: null });
    }, error => {
      console.log(error);
    });
  }
  GuardarProducto() {
    this.mostrar = false;
    this.Producto.codContable = this.forma.value.CodContable;
    this.Producto.descripcion = this.forma.value.Descripcion;
    this.Producto.marca = this.forma.value.Marca;
    this.Producto.UnMedida = this.forma.value.Presentacion;
    this.Producto.tamano = this.forma.value.Tamano;
    this.Producto.Color = this.forma.value.Color;
    this.Producto.detalles = this.forma.value.Detalles;
    this.Producto.existencia = this.forma.value.Existencia;
    this.Producto.PrecioCompra = this.forma.value.PrecioCosto;
    this.Producto.PrecioVenta = this.forma.value.PrecioVenta;
    this.Producto.tope = this.forma.value.tope;
    this.Producto.BarCode = this.forma.value.BarCode;
    this.Producto.Mileniumgas = this.Si;
    this.Producto.IdCategoria = this.forma.value.IdCategoria;
    this.Producto.empresa = this.forma.value.empresa;
    this.CodigoContable = this.forma.value.CodContable;

    if (this.Producto.IdCategoria === null || this.Producto.IdCategoria === undefined) {
      this.principalComponent.showMsg('error', '¡NO SE GUARDÓ!', 'Debe escoger la Categoria ');
      return;
    }
    this.nominaService.InserProductos(this.Producto).subscribe(data => {
      this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
      this.guardarImagen(this.imagenSubir, this.ArchivoASubir, this.CodigoContable);
      this.forma.reset();
      this.mostrar = true;
    }, error => {
        this.principalComponent.showMsg('error', 'Advertencia', error.error.message);
        this.mostrar = true;
    });
  }
  ngOnInit() {
    this.GetCategorias();
    this.GetEmpresas();
  }
  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenTemp = '../../../../../assets/img/sinimagen.jpg';
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      this.imagenTemp = '../../../../../assets/img/sinimagen.jpg';
      this.imagenSubir = null;
      alert('Solo Imagenes');
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    const ArregloNombre = archivo.name.split('.');

    this.ExtencionArchivo = ArregloNombre[ArregloNombre.length - 1];
    reader.onloadend = () => this.imagenTemp = reader.result;
    reader.onloadend = () => {
      this.ArchivoASubir = { name: this.CodigoContable + '.' + this.ExtencionArchivo, code: reader.result };
      this.imagenTemp = reader.result;
    };
    this.Producto.Imagen = this.CodigoContable + '.' + this.ExtencionArchivo;
    // this.fileToUp[item] = { name: inputValue.name, code: reader.result, type: item };

  }
  CambiarValor() {
    this.Si = !this.Si;
    console.log(this.Si);

  }
  guardarImagen(archivo: File, ArchivoSubir: any, id: string) {
    if (ArchivoSubir) {
      this.Producto.Imagen = this.CodigoContable + '.' + this.ExtencionArchivo;
      ArchivoSubir.name = this.CodigoContable + '.' + this.ExtencionArchivo;
      this._subirArchivoService.subirArchivo(archivo, ArchivoSubir, id)
        .then(resp => {
          console.log(resp);
        })
        .catch(resp => {
          console.log(resp);
        });
    }
  }

  Funcion(i) {
    this.selectedCat = i.value;
    console.log(this.selectedCat);
  }


}
interface Categoria {
  id: number;
  descripcion: string;
}
