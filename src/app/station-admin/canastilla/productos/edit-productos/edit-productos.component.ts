import { Component, OnInit } from '@angular/core';
import { EntVentasProductos } from '../../../../Class/EntVentaProducto';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { EntProductos } from '../../../../Class/EntProductos';
import { EntStation } from '../../../../Class/EntStation';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileImagen } from '../../../../Class/FileImagen';
import { SubirArchivoService } from '../../../../services/subir-archivo.service';
import { ActivatedRoute, Router, Route } from '@angular/router';




@Component({
    selector: 'app-edit-productos',
    templateUrl: './edit-productos.component.html',
    styleUrls: ['./edit-productos.component.css']
})
export class EditProductosComponent implements OnInit {

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
    public archivos: FileImagen[] = [];

    constructor(private nominaService: NominaService,
        private principalComponent: PrincipalComponent,
        private title: Title,
        public _subirArchivoService: SubirArchivoService,
        public activatedRoute: ActivatedRoute,
        public route: Router
    ) {
        this.activatedRoute.params.subscribe(params => {
            const id = params['id'];
            if (id !== 'nuevo') {
                this.nominaService.GetProducto(id).subscribe(resp => {
                    this.Producto = resp[0];
                    this.forma = new FormGroup({
                        'id': new FormControl(this.Producto.id, [Validators.required, Validators.minLength(4)]),
                        'CodContable': new FormControl(this.Producto.codContable, [Validators.required, Validators.minLength(4)]),
                        'Descripcion': new FormControl(this.Producto.descripcion, [Validators.required, Validators.minLength(10)]),
                        'Marca': new FormControl(this.Producto.marca),
                        'Presentacion': new FormControl(this.Producto.UnMedida, [Validators.required, Validators.minLength(3)]),
                        'Tamano': new FormControl(this.Producto.tamano, Validators.required),
                        'Color': new FormControl(this.Producto.Color),
                        'Detalles': new FormControl(this.Producto.detalles),
                        'tope': new FormControl(this.Producto.tope),
                        'BarCode': new FormControl(this.Producto.BarCode),
                        'Mileniumgas': new FormControl(this.Producto.Mileniumgas),
                        'IdCategoria': new FormControl(this.Producto.IdCategoria, [Validators.required]),
                        'empresa': new FormControl(this.Producto.empresa, [Validators.required]),
                        'imagen': new FormControl(this.Producto.Imagen)

                    });
                });
            }
        });
        this.title.setTitle('Editar Productos - Simovil');
        this.imagenTemp = '../../../../../assets/img/sinimagen.jpg';
        this.ProductosCategorias = [{ label: 'SELECCIONE LA CATEGORIA', value: null }];
        this.centroCostos = [{ label: 'SELECCIONE LA EMPRESA', value: null }];
    }

    ngOnInit() {
        this.GetCategorias();
        this.GetEmpresas();
        // this.forma = new FormGroup({
        //     'CodContable': new FormControl(this.Producto.codContable, [Validators.required, Validators.minLength(4)]),
        //     'Descripcion': new FormControl('', [Validators.required, Validators.minLength(10)]),
        //     'Marca': new FormControl(''),
        //     'Presentacion': new FormControl('', [Validators.required, Validators.minLength(3)]),
        //     'Tamano': new FormControl('', Validators.required),
        //     'Color': new FormControl(''),
        //     'Detalles': new FormControl(''),
        //     'tope': new FormControl('', [Validators.required]),
        //     'BarCode': new FormControl(''),
        //     'Mileniumgas': new FormControl(true),
        //     'IdCategoria': new FormControl(null, [Validators.required]),
        //     'empresa': new FormControl(null, [Validators.required])
        //     // #selectedCat1 (onChange)="Funcion(selectedCat1 )"
        // });

    }

    GetCategorias() {
        this.nominaService.GetCategorias().subscribe(data => {
            this.ProductosCategorias = data;
            this.ProductosCategorias.unshift({ label: 'SELECCIONE LA CATEGORIA ', value: null });
        }, error => {
            console.log(error);
        });
    }
    // GetEmpresas() {
    //     this.nominaService.GetEmpresas().subscribe(data => {
    //         this.centroCostos = [];
    //         data.forEach((elemento: any) => {
    //             this.centroCostos.push({
    //                 label: elemento.nombre + ' (' + elemento.marca + ')',
    //                 value: elemento.nit
    //             });
    //         });
    //         this.centroCostos.unshift({ label: 'SELECCIONE LA EMPRESA ', value: null });
    //     }, error => {
    //         console.log(error);
    //     });
    // }

    GetEmpresas() {
        this.nominaService.GetEmpresas().subscribe(data => {
            this.centroCostos = [];
            data.forEach((elemento: any) => {
                this.centroCostos.push({
                    label: elemento.marca,
                    value: elemento.nit,
                    tips: elemento.nombre
                });
            });
            this.centroCostos.unshift({ label: 'SELECCIONE LA EMPRESA', value: '', tips: 'Elija el Centro de Costo' });
        }, error => {
            console.log(error);
        });
    }
    // GuardarProducto() {
    //     this.Producto.codContable = this.forma.value.CodContable;
    //     this.Producto.descripcion = this.forma.value.Descripcion;
    //     this.Producto.marca = this.forma.value.Marca;
    //     this.Producto.UnMedida = this.forma.value.Presentacion;
    //     this.Producto.tamano = this.forma.value.Tamano;
    //     this.Producto.Color = this.forma.value.Color;
    //     this.Producto.detalles = this.forma.value.Detalles;
    //     this.Producto.existencia = this.forma.value.Existencia;
    //     this.Producto.PrecioCompra = this.forma.value.PrecioCosto;
    //     this.Producto.PrecioVenta = this.forma.value.PrecioVenta;
    //     this.Producto.tope = this.forma.value.tope;
    //     this.Producto.BarCode = this.forma.value.BarCode;
    //     this.Producto.Mileniumgas = this.Si;
    //     this.Producto.IdCategoria = this.forma.value.IdCategoria;
    //     this.Producto.empresa = this.forma.value.empresa;
    //     this.CodigoContable = this.forma.value.CodContable;

    //     if (this.Producto.IdCategoria === null || this.Producto.IdCategoria === undefined) {
    //         console.log(this.Producto.IdCategoria);
    //         this.principalComponent.showMsg('error', '¡NO SE GUARDÓ!', 'Debe escoger la Categoria ');
    //         return;
    //     }
    //     this.nominaService.InserProductos(this.Producto).subscribe(data => {
    //         this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
    //         this.guardarImagen(this.imagenSubir, this.ArchivoASubir, this.CodigoContable);
    //         this.forma.reset();
    //     }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));
    // }

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
    Guardar(formulario: EntProductos) {
        this.nominaService.UpdateProd(formulario).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'El artículo se modificó sastisfactoriamente');
            this.guardarImagen(this.imagenSubir, this.ArchivoASubir, this.CodigoContable);
            this.route.navigate(['/ppalCanastilla/ListaTodosProd']);
        }, error => this.principalComponent.showMsg('error', 'Error', error.error.message));

    }


}
interface Categoria {
    id: number;
    descripcion: string;
}
