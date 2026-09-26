import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
import { Paciente, PacienteRequest } from '../../../models/paciente.model';
import { Telefone } from '../../../models/telefone.model';
import { PacienteService } from '../../../services/paciente.service';

type TelefoneField = 'codigoArea' | 'numero' | 'whatsapp';
type CpfLookupState = 'idle' | 'paciente' | 'pessoa' | 'nao-encontrado';

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
  selector: 'app-paciente-form',
  styleUrl: './paciente-form.css',
  templateUrl: './paciente-form.html',
})
export class PacienteForm implements OnInit {
  readonly form: FormGroup;
  private readonly location = inject(Location);

  cpfLookupState: CpfLookupState = 'idle';

  private readonly fieldMessages: Record<string, Record<string, string>> = {
    nome: {
      required: 'Nome é obrigatório.',
      minlength: 'Nome deve ter ao menos 2 caracteres.',
      maxlength: 'Nome deve ter no máximo 120 caracteres.',
    },
    email: {
      required: 'E-mail é obrigatório.',
      email: 'Informe um e-mail válido.',
    },
    cpf: {
      required: 'CPF é obrigatório.',
      minlength: 'CPF deve ter 11 caracteres.',
      maxlength: 'CPF deve ter 11 caracteres.',
    },
    dataNascimento: {
      required: 'Data de nascimento é obrigatória.',
    },
    genero: {
      maxlength: 'Gênero deve ter no máximo 30 caracteres.',
    },
    endereco: {
      maxlength: 'Endereço deve ter no máximo 255 caracteres.',
    },
    ativo: {
      required: 'Situação é obrigatória.',
    },
  };

  private readonly telefoneMessages: Record<TelefoneField, Record<string, string>> = {
    codigoArea: {
      required: 'DDD é obrigatório.',
      minlength: 'DDD deve ter ao menos 2 caracteres.',
      maxlength: 'DDD deve ter no máximo 3 caracteres.',
    },
    numero: {
      required: 'Número é obrigatório.',
      minlength: 'Número deve ter ao menos 8 caracteres.',
      maxlength: 'Número deve ter no máximo 15 caracteres.',
    },
    whatsapp: {},
  };

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private activatedRoute: ActivatedRoute,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
      ],
      email: ['', [Validators.required, Validators.email]],
      cpf: [
        '',
        [Validators.required, Validators.minLength(11), Validators.maxLength(11)],
      ],
      dataNascimento: ['', [Validators.required]],
      genero: ['', [Validators.maxLength(30)]],
      endereco: ['', [Validators.maxLength(255)]],
      observacoes: [''],
      ativo: [true, [Validators.required]],
      telefones: this.fb.array([], [Validators.minLength(1)]),
    });

    this.adicionarTelefone();
  }

  ngOnInit(): void {
    const paciente = this.activatedRoute.snapshot.data['paciente'] as
      | Paciente
      | undefined;

    if (paciente) {
      this.preencherFormulario(paciente);
      this.cpfLookupState = 'paciente';
    }
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get cpfLookupMessage(): string {
    switch (this.cpfLookupState) {
      case 'paciente':
        return 'Paciente já cadastrado. Os dados foram carregados para edição.';
      case 'pessoa':
        return 'CPF encontrado apenas como pessoa. Complete os dados específicos para concluir o cadastro do paciente.';
      case 'nao-encontrado':
        return 'CPF não encontrado. Continue com o cadastro normalmente.';
      default:
        return '';
    }
  }

  adicionarTelefone(): void {
    this.telefones.push(this.criarTelefoneGroup());
    this.telefones.updateValueAndValidity();
  }

  removerTelefone(index: number): void {
    if (this.telefones.length === 1) {
      return;
    }

    this.telefones.removeAt(index);
    this.telefones.markAsTouched();
    this.telefones.updateValueAndValidity();
  }

  buscarPorCpf(): void {
    const cpfControl = this.form.get('cpf');

    if (!cpfControl || cpfControl.invalid) {
      cpfControl?.markAsTouched();
      return;
    }

    this.clearApiErrors();
    const cpf = this.onlyDigits(String(cpfControl.value));

    this.pacienteService.findByCpf(cpf).subscribe({
      next: (paciente) => {
        this.preencherFormulario(paciente);

        if (paciente.id) {
          this.cpfLookupState = 'paciente';
          this.exibirMensagem('Paciente encontrado pelo CPF.');
          return;
        }

        this.cpfLookupState = 'pessoa';
        this.form.patchValue({
          observacoes: '',
          ativo: true,
        });
        this.exibirMensagem(
          'Dados da pessoa encontrados. Complete o cadastro do paciente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.cpfLookupState = 'nao-encontrado';
          this.resetForNovoCadastro(cpf);
          this.exibirMensagem('CPF não encontrado. Continue o cadastro.');
          return;
        }

        this.handleApiError(error, 'Erro ao buscar CPF.');
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.clearApiErrors();
      this.form.markAllAsTouched();
      this.exibirMensagem('Corrija os campos obrigatórios antes de salvar.');
      return;
    }

    this.clearApiErrors();

    const pacienteId = this.form.get('id')?.value as number | null;
    const payload = this.toRequest();

    const resultado = pacienteId
      ? this.pacienteService.update(pacienteId, payload)
      : this.pacienteService.create(payload);

    resultado.subscribe({
      next: (pacienteSalvo) => {
        this.exibirMensagem('Paciente salvo com sucesso!');

        if (pacienteSalvo.id) {
          this.router.navigate(['/pacientes/edit', pacienteSalvo.id]);
          return;
        }

        this.voltar();
      },
      error: (error: HttpErrorResponse) => {
        this.handleApiError(error, 'Erro ao salvar paciente.');
      },
    });
  }

  excluir(): void {
    const pacienteId = this.form.get('id')?.value as number | null;

    if (!pacienteId) {
      return;
    }

    this.pacienteService.delete(pacienteId).subscribe({
      next: () => {
        this.exibirMensagem('Paciente excluído com sucesso!');
        this.voltar();
      },
      error: (error: HttpErrorResponse) => {
        this.handleApiError(error, 'Erro ao excluir paciente.');
      },
    });
  }

  voltar(): void {
    this.location.back();
  }

  getErrorMessage(field: string): string | null {
    return this.resolveErrorMessage(
      this.form.get(field),
      this.fieldMessages[field] ?? {},
    );
  }

  getTelefoneErrorMessage(index: number, field: TelefoneField): string | null {
    return this.resolveErrorMessage(
      this.getTelefoneControl(index, field),
      this.telefoneMessages[field],
    );
  }

  getTelefonesErrorMessage(): string | null {
    return this.resolveErrorMessage(this.telefones, {
      minlength: 'Informe ao menos 1 telefone.',
    });
  }

  private criarTelefoneGroup(telefone?: Partial<Telefone>): FormGroup {
    return this.fb.group({
      codigoArea: [
        telefone?.codigoArea ?? '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      ],
      numero: [
        telefone?.numero ?? '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(15)],
      ],
      whatsapp: [telefone?.whatsapp ?? false],
    });
  }

  private preencherFormulario(paciente: Paciente): void {
    this.form.patchValue({
      id: paciente.id,
      nome: paciente.nome ?? '',
      email: paciente.email ?? '',
      cpf: this.onlyDigits(paciente.cpf ?? ''),
      dataNascimento: this.normalizeDateInput(paciente.dataNascimento),
      genero: paciente.genero ?? '',
      endereco: paciente.endereco ?? '',
      observacoes: paciente.observacoes ?? '',
      ativo: paciente.ativo ?? true,
    });

    this.replaceTelefones(paciente.telefones ?? []);
  }

  private replaceTelefones(telefones: Telefone[]): void {
    const origem =
      telefones.length > 0
        ? telefones
        : [{ codigoArea: '', numero: '', whatsapp: false }];

    const telefonesArray = this.fb.array(
      origem.map((telefone) => this.criarTelefoneGroup(telefone)),
      [Validators.minLength(1)],
    );

    this.form.setControl('telefones', telefonesArray);
  }

  private resetForNovoCadastro(cpf: string): void {
    this.form.reset({
      id: null,
      nome: '',
      email: '',
      cpf,
      dataNascimento: '',
      genero: '',
      endereco: '',
      observacoes: '',
      ativo: true,
    });

    this.replaceTelefones([]);
  }

  private toRequest(): PacienteRequest {
    const value = this.form.getRawValue();

    return {
      nome: String(value.nome).trim(),
      email: String(value.email).trim(),
      cpf: this.onlyDigits(String(value.cpf)),
      dataNascimento: this.normalizeDateInput(String(value.dataNascimento)),
      genero: this.normalizeNullable(value.genero),
      endereco: this.normalizeNullable(value.endereco),
      observacoes: this.normalizeNullable(value.observacoes),
      ativo: Boolean(value.ativo),
      telefones: (value.telefones as Telefone[]).map((telefone) => ({
        codigoArea: String(telefone.codigoArea).trim(),
        numero: String(telefone.numero).trim(),
        whatsapp: Boolean(telefone.whatsapp),
      })),
    };
  }

  private normalizeNullable(value: unknown): string | null {
    const normalized = String(value ?? '').trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeDateInput(value: string): string {
    return value ? value.slice(0, 10) : '';
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  private getTelefoneControl(
    index: number,
    field: TelefoneField,
  ): AbstractControl | null {
    return (this.telefones.at(index) as FormGroup).get(field);
  }

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

  private handleApiError(error: HttpErrorResponse, fallbackMessage: string): void {
    const problem = error.error as ApiProblem | null;

    if (problem?.errors?.length) {
      this.applyProblemDetails(problem);
    }

    this.exibirMensagem(problem?.detail || problem?.title || fallbackMessage);
    console.error(fallbackMessage, error);
  }

  private applyProblemDetails(problem: ApiProblem): void {
    for (const fieldError of problem.errors ?? []) {
      const telefoneMatch = /^telefones\[(\d+)\]\.(codigoArea|numero|whatsapp)$/.exec(
        fieldError.field,
      );

      if (telefoneMatch) {
        const index = Number(telefoneMatch[1]);
        const field = telefoneMatch[2] as TelefoneField;
        const control = this.getTelefoneControl(index, field);

        if (control) {
          control.setErrors({
            ...(control.errors ?? {}),
            api: fieldError.message,
          });
          control.markAsTouched();
        }

        continue;
      }

      const control = this.form.get(fieldError.field);

      if (control) {
        control.setErrors({
          ...(control.errors ?? {}),
          api: fieldError.message,
        });
        control.markAsTouched();
      }
    }
  }

  private clearApiErrors(control: AbstractControl = this.form): void {
    if (control instanceof FormGroup || control instanceof FormArray) {
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

  private exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
