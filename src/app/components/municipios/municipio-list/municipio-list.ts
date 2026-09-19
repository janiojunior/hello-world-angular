import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  selector: 'app-municipio-list',
  styleUrl: './municipio-list.css',
  templateUrl: './municipio-list.html',
})
export class MunicipioList {
  displayedColumns: string[] = ['numero', 'nome', 'estado', 'sigla', 'regiao', 'acao'];
  dataSource = new MatTableDataSource<Municipio>();
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  constructor(private municipioService: MunicipioService) {}

  ngOnInit() {
    this.loadMunicipios();
  }

  loadMunicipios() {
    this.municipioService.findAll(this.pageIndex, this.pageSize).subscribe((response) => {
      this.dataSource.data = response.items;
      this.pageIndex = response.page;
      this.pageSize = response.pageSize;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMunicipios();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}