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
import { Paciente } from '../../../models/paciente.model';
import { PacienteService } from '../../../services/paciente.service';

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
  selector: 'app-paciente-list',
  styleUrl: './paciente-list.css',
  templateUrl: './paciente-list.html',
})
export class PacienteList {
  displayedColumns: string[] = [
    'numero',
    'nome',
    'cpf',
    'email',
    'dataNascimento',
    'ativo',
    'acao',
  ];
  dataSource = new MatTableDataSource<Paciente>();
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  filtroNome = '';

  constructor(
    private pacienteService: PacienteService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    const termo = this.filtroNome.trim();
    const request = termo
      ? this.pacienteService.findByNome(termo, this.pageIndex, this.pageSize)
      : this.pacienteService.findAll(this.pageIndex, this.pageSize);

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
    this.loadPacientes();
  }

  applyFilter(event: Event) {
    this.filtroNome = (event.target as HTMLInputElement).value;
    this.pageIndex = 0;
    this.loadPacientes();
  }

  excluir(paciente: Paciente) {
    if (!paciente.id) {
      return;
    }

    this.pacienteService.delete(paciente.id).subscribe({
      next: () => {
        this.exibirMensagem('Paciente excluído com sucesso!');

        if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
          this.pageIndex -= 1;
        }

        this.loadPacientes();
      },
      error: (error) => {
        this.exibirMensagem('Erro ao excluir paciente!');
        console.error('Erro ao excluir paciente:', error);
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

  formatarData(data: string): string {
    if (!data) {
      return '';
    }

    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
  }

  formatarStatus(ativo: boolean | null): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  private exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
