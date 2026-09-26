import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Psicologo } from '../../../models/psicologo.model';
import { PsicologoService } from '../../../services/psicologo.service';

@Component({
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
  ],
  selector: 'app-psicologo-list',
  styleUrl: './psicologo-list.css',
  templateUrl: './psicologo-list.html',
})
export class PsicologoList {
  displayedColumns: string[] = [
    'numero',
    'nome',
    'cpf',
    'email',
    'crp',
    'especialidade',
    'valorConsulta',
    'duracaoConsulta',
    'ativo',
    'acao',
  ];
  dataSource = new MatTableDataSource<Psicologo>();
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  filtroNome = '';

  constructor(
    private psicologoService: PsicologoService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadPsicologos();
  }

  loadPsicologos() {
    const termo = this.filtroNome.trim();
    const request = termo
      ? this.psicologoService.findByNome(termo, this.pageIndex, this.pageSize)
      : this.psicologoService.findAll(this.pageIndex, this.pageSize);

    request.subscribe((response) => {
      this.dataSource.data = response.items;
      this.pageIndex = response.page;
      this.pageSize = response.pageSize;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPsicologos();
  }

  applyFilter(event: Event) {
    this.filtroNome = (event.target as HTMLInputElement).value;
    this.pageIndex = 0;
    this.loadPsicologos();
  }

  excluir(psicologo: Psicologo) {
    if (!psicologo.id) {
      return;
    }

    this.psicologoService.delete(psicologo.id).subscribe({
      next: () => {
        this.exibirMensagem('Psicólogo excluído com sucesso!');

        if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
          this.pageIndex -= 1;
        }

        this.loadPsicologos();
      },
      error: (error) => {
        this.exibirMensagem('Erro ao excluir psicólogo!');
        console.error('Erro ao excluir psicólogo:', error);
      },
    });
  }

  formatarCpf(cpf: string): string {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) {
      return cpf;
    }

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarStatus(ativo: boolean | null): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  formatarValor(valor: number | null): string {
    if (valor == null) {
      return '';
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarDuracao(duracao: number | null): string {
    if (duracao == null) {
      return '';
    }

    return `${duracao} min`;
  }

  private exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
