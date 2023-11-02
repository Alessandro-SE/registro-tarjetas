import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/Services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit{
  lisTarjetas: any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _tarjetaService: TarjetaService){
    this.form = this.fb.group({
      titular: ['', Validators.required], //validator campo requerido
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]], //Cuando se pone mas de una validacion va en un array
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
  }

  ngOnInit(): void{
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe(data => {
      console.log(data);
      this.lisTarjetas = data;
    }, error => {
      console.log(error);
    })
  }


  guardarTarjeta(){

    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }

    if(this.id == undefined){
      //agregamos una nueva tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data =>{
        this.toastr.success('La Tarjeta fue registrada con exito', 'Tarjeta Registrada');
        this.obtenerTarjetas();
        this.form.reset();
      }, error => {
        this.toastr.error("Opss.. Ocurrio un error","Error")
        console.log(error);
      })
    }
    else{
      tarjeta.id = this.id;
      //Editamos una tarjeta
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data => {
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con exito', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      })
    }


  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La Tarjeta fue Eliminada con Exito','Tarjeta Eliminada');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
    })
  }

  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv

    })
  }
}
