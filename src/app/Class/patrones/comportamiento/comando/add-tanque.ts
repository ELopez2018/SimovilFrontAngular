import { IOrden } from './IOrden';
export class AddTanque implements IOrden{

    objetoToAdd;

    constructor(objetoToAdd){
        this.objetoToAdd = objetoToAdd;
    }

    /* execute(currentValue){
        return currentValue + this.valueToAdd;
    } */
    execute(){
        return this.objetoToAdd;
    }

    undo(){}
    /* undo(currentValue){
        return currentValue - this.valueToAdd;
    } */
}
