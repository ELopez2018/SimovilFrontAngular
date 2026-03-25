export class InvocaTanque {

    objeto;
    history;

    constructor(){
        //this.value = 0;
        this.objeto = {};
        this.history = [];
    }

    executeCommand(command){
        this.objeto = command.execute(this.objeto);
        this.history.push(command);
    }

    /* public undo(){
        const command = this.history.pop();
        this.value = command.undo(this.value);
    } */

}
