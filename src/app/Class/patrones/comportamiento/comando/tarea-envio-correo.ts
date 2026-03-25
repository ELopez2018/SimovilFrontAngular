import { Stock } from './Stock';
import { TareaProducto } from './tarea-producto';
export class TareaEnvioCorreo implements TareaProducto{

    public ejecutar(stock: Stock){
        console.log(stock.vender()+' enviado por correo');
    }
}
