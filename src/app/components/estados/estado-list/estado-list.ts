import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';
import { Estado } from '../../../models/estado.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RegiaoService } from '../../../services/regiao.service';

@Component({
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatPaginatorModule,
            MatToolbarModule, MatButtonModule, MatIconModule, RouterLink
            ],
  selector: 'app-estado-list',
  styleUrl: './estado-list.css',
  templateUrl: './estado-list.html',
})
export class EstadoList {

  displayedColumns: string[] = ['numero', 'nome', 'sigla', 'regiao', 'acao'];
  dataSource = new MatTableDataSource<Estado>();
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  private readonly regiaoNomePorId = new Map<number, string>();

  constructor(
    private estadoService: EstadoService,
    private regiaoService: RegiaoService,
  ) { }

  ngOnInit() {
    this.loadRegioes();
    this.loadEstados();
  }

  loadRegioes() {
    this.regiaoService.findAll().subscribe((regioes) => {
      this.regiaoNomePorId.clear();

      for (const regiao of regioes) {
        this.regiaoNomePorId.set(regiao.id, regiao.nome);
      }
    });
  }

  loadEstados() {
    this.estadoService.findAll(this.pageIndex, this.pageSize).subscribe((response) => {
      this.dataSource.data = response.items;
      console.log('Estados carregados:', response.items);
      this.pageIndex = response.page;
      this.pageSize = response.pageSize;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEstados();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
