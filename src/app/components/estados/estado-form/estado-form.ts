import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EstadoService } from '../../../services/estado.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, 
            MatInputModule, MatButtonModule, MatToolbarModule, MatIconModule],
  selector: 'app-estado-form',
  styleUrl: './estado-form.css',
  templateUrl: './estado-form.html',
})
export class EstadoForm {

  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: [''],
      sigla: ['']
    });
  }

  salvar () {
      const estado = this.form.value;

      this.estadoService.create(estado).subscribe({
        next: () => {
          console.log('Estado salvo com sucesso!');
          this.router.navigate(['/estados']);
        },
        error: (error) => {
          console.error('Erro ao salvar estado:', error);
        }
      });
  }
}
