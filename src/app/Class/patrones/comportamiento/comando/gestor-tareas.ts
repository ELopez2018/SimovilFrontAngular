import { Stock } from './Stock';
import { TareaProducto } from './tarea-producto';
export class GestorTareas {

    ejecutar(tarea: TareaProducto, p: Stock){
        tarea.ejecutar(p);
    }
}
