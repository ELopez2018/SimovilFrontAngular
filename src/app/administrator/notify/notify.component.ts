import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../services/nomina.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  listaUserWebTokens:[] =  [];
  selectedUsers:[]= [];

  notifyform = new UntypedFormGroup({
    titulo: new UntypedFormControl(null, Validators.required),
    mensaje: new UntypedFormControl(null, Validators.required),
    users: new UntypedFormControl(this.selectedUsers, Validators.required)
  })

  constructor(private servicioNomina: NominaService) { }

  ngOnInit(): void {
    this.consultarUsersWebTokens();
  }

  consultarUsersWebTokens(){
    this.servicioNomina.consultarUsersWebToken().subscribe(result => {
      this.listaUserWebTokens = result
    })
  }

  enviarNotify(){
    console.log("enviando mensaje")
    let data = {
      "userData":this.selectedUsers,
      "msgData": {
        "titulo": this.notifyform.get('titulo').value,
        "msg":this.notifyform.get('mensaje').value
      }
    }

    console.log(JSON.stringify(data))

    this.servicioNomina.enviarNotificacion(data).subscribe(result => {
      console.log("resultado: ",result)
    })

    this.selectedUsers= [];
    this.notifyform.reset();
  }

  test(){
    console.log("data: ",this.listaUserWebTokens)
    console.log("seleccion: ",this.selectedUsers)
  }

}
