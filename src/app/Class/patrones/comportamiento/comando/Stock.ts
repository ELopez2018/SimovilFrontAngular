export class Stock{

    private nombre: string;
    private cantidad: number;

    constructor(nombre: string, cantidad: number){
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    public set setNombre(nombre: string){
        this.nombre = nombre;
    }

    public get getNombre(){
        return this.nombre;
    }
    public set setCantidad(cantidad: number){
        this.cantidad = cantidad;
    }

    public get getCantidad(){
        return this.cantidad;
    }

    public comprar(){
        console.log('nombre: '+this.nombre+', cantidad: '+this.cantidad);
    }

    public vender(){
        console.log('vender... Nombre: '+this.nombre+', cantidad: '+this.cantidad);
    }
}
