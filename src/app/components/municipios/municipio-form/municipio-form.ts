import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiProblem } from '../../../models/api-problem.model';
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

  private readonly fieldMessages: Record<string, Record<string, string>> = {
    nome: {
      required: 'Nome é obrigatório.',
      minlength: 'Nome deve ter ao menos 2 caracteres.',
      maxlength: 'Nome deve ter no máximo 60 caracteres.',
    },
    estado: {
      required: 'Estado é obrigatório.',
    },
  };

  // Inicializa as dependencias do componente e configura os controles do formulario.
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
      nome: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      estado: [null, [Validators.required]],
    });
  }

  // Carrega os dados resolvidos da edicao e a lista de estados para o select.
  ngOnInit(): void {
    const municipio = this.activatedRoute.snapshot.data['municipio'];

    if (municipio) {
      this.form.patchValue(municipio);
    }

    this.estadoService.findAll(0, 1000).subscribe({
      next: (response) => {
        this.estados = response.items;

        if (municipio?.estado?.id) {
          const estadoSelecionado = this.estados.find(
            (estado) => estado.id === municipio.estado?.id,
          );

          if (estadoSelecionado) {
            this.form.patchValue({ estado: estadoSelecionado });
          }
        }
      },
      error: (error) => {
        console.error('Erro ao buscar estados:', error);
      },
    });
  }

  // Valida o formulario e envia uma requisicao de criacao ou atualizacao do municipio.
  salvar() {
    if (this.form.invalid) {
      this.clearApiErrors();
      this.form.markAllAsTouched();
      this.exibirMensagem('Corrija os campos obrigatórios antes de salvar.');
      return;
    }

    this.clearApiErrors();
    const municipio = this.form.value;

    const resultado = municipio.id
      ? this.municipioService.update(municipio.id, municipio)
      : this.municipioService.create(municipio);

    resultado.subscribe({
      next: () => {
        this.exibirMensagem('Município salvo com sucesso!');
        this.router.navigate(['/municipios']);
      },
      error: (error: HttpErrorResponse) => {
        this.handleApiError(error, 'Erro ao salvar município!');
      },
    });
  }

  // Remove o municipio atual quando o formulario estiver em modo de edicao.
  excluir() {
    const municipio = this.form.value;

    if (municipio.id) {
      this.municipioService.delete(municipio.id).subscribe({
        next: () => {
          this.exibirMensagem('Município excluído com sucesso!');
          this.router.navigate(['/municipios']);
        },
        error: (error: HttpErrorResponse) => {
          this.handleApiError(error, 'Erro ao excluir município!');
        },
      });
    }
  }

  // Retorna a mensagem de erro apropriada para um campo do formulario.
  getErrorMessage(field: string): string | null {
    return this.resolveErrorMessage(
      this.form.get(field),
      this.fieldMessages[field] ?? {},
    );
  }

  // Exibe uma notificacao curta no topo da tela para feedback ao usuario.
  exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Retorna para a pagina anterior usando o historico do navegador.
  voltar(): void {
    this.location.back();
  }

  // Traduz os erros de um controle em uma mensagem amigavel para exibicao no template.
  private resolveErrorMessage(
    control: AbstractControl | null,
    messages: Record<string, string>,
  ): string | null {
    if (!control || !control.touched || !control.errors) {
      return null;
    }

    if (typeof control.errors['api'] === 'string') {
      return control.errors['api'];
    }

    for (const key of Object.keys(messages)) {
      if (control.hasError(key)) {
        return messages[key];
      }
    }

    return 'Campo inválido.';
  }

  // Centraliza o tratamento de erro das requisicoes HTTP e aplica erros de validacao ao formulario.
  private handleApiError(error: HttpErrorResponse, fallbackMessage: string): void {
    const problem = error.error as ApiProblem | null;

    if (problem?.errors?.length) {
      this.applyProblemDetails(problem);
    }

    this.exibirMensagem(problem?.detail || problem?.title || fallbackMessage);
    console.error(fallbackMessage, error);
  }

  // Mapeia os erros retornados pelo backend para os campos equivalentes no formulario.
  private applyProblemDetails(problem: ApiProblem): void {
    for (const fieldError of problem.errors ?? []) {
      const fieldName = fieldError.field === 'idEstado' ? 'estado' : fieldError.field;
      const control = this.form.get(fieldName);

      if (control) {
        control.setErrors({
          ...(control.errors ?? {}),
          api: fieldError.message,
        });
        control.markAsTouched();
      }
    }
  }

  // Remove erros de API previamente aplicados para evitar mensagens obsoletas entre tentativas.
  private clearApiErrors(control: AbstractControl = this.form): void {
    if (control instanceof FormGroup) {
      for (const childControl of Object.values(control.controls)) {
        this.clearApiErrors(childControl);
      }
    }

    if (!control.errors?.['api']) {
      return;
    }

    const { api, ...rest } = control.errors;
    control.setErrors(Object.keys(rest).length > 0 ? rest : null);
  }
}