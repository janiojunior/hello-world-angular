import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  selector: 'app-municipio-form',
  styleUrl: './municipio-form.css',
  templateUrl: './municipio-form.html',
})
export class MunicipioForm implements OnInit {
  readonly form: FormGroup;
  private readonly location = inject(Location);
  estados: Estado[] = [];

  constructor(
    private fb: FormBuilder,
    private municipioService: MunicipioService,
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: [''],
      idEstado: null,
    });
  }

  ngOnInit(): void {
    const municipio = this.activatedRoute.snapshot.data['municipio'];

    if (municipio) {
      this.form.patchValue(municipio);
    }

    this.estadoService.findAll(0, 1000).subscribe({
      next: (response) => {
        this.estados = response.items;

        if (municipio?.estado?.id) {
          this.form.patchValue({ idEstado: municipio.estado.id });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar estados:', error);
      },
    });
  }

  salvar() {
    const municipio = this.form.value;

    const resultado = municipio.id
      ? this.municipioService.update(municipio.id, municipio)
      : this.municipioService.create(municipio);

    resultado.subscribe({
      next: () => {
        this.exibirMensagem('Município salvo com sucesso!');
        this.router.navigate(['/municipios']);
      },
      error: (error) => {
        this.exibirMensagem('Erro ao salvar município!');
        console.error('Erro ao salvar município:', error);
      },
    });
  }

  excluir() {
    const municipio = this.form.value;

    if (municipio.id) {
      this.municipioService.delete(municipio.id).subscribe({
        next: () => {
          this.exibirMensagem('Município excluído com sucesso!');
          this.router.navigate(['/municipios']);
        },
        error: (error) => {
          this.exibirMensagem('Erro ao excluir município!');
          console.error('Erro ao excluir município:', error);
        },
      });
    }
  }

  exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  voltar(): void {
    this.location.back();
  }
}