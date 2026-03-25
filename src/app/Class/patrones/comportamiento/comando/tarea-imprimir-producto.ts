import { Stock } from './Stock';
import { TareaProducto } from './tarea-producto';
export class TareaImprimirProducto implements TareaProducto{

    ejecutar(stock: Stock){
        console.log(stock.getNombre);
        console.log(stock.getCantidad);
    }
}
