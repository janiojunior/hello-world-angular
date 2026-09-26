import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page-response.model';
import { Psicologo, PsicologoRequest } from '../models/psicologo.model';

@Injectable({ providedIn: 'root' })
export class PsicologoService {
  private readonly apiUrl = 'http://localhost:8080/psicologos';

  constructor(private http: HttpClient) {}

  findAll(
    page: number = 0,
    pageSize: number = 10,
  ): Observable<PageResponse<Psicologo>> {
    return this.http.get<PageResponse<Psicologo>>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`,
    );
  }

  findByNome(
    nome: string,
    page: number = 0,
    pageSize: number = 10,
  ): Observable<PageResponse<Psicologo>> {
    return this.http.get<PageResponse<Psicologo>>(
      `${this.apiUrl}/nome/${encodeURIComponent(nome)}?page=${page}&pageSize=${pageSize}`,
    );
  }

  findById(id: number | string): Observable<Psicologo> {
    return this.http.get<Psicologo>(`${this.apiUrl}/${id}`);
  }

  findByCpf(cpf: string): Observable<Psicologo> {
    return this.http.get<Psicologo>(`${this.apiUrl}/cpf/${encodeURIComponent(cpf)}`);
  }

  findByCrp(crp: string): Observable<Psicologo> {
    return this.http.get<Psicologo>(`${this.apiUrl}/crp/${encodeURIComponent(crp)}`);
  }

  create(psicologo: PsicologoRequest): Observable<Psicologo> {
    return this.http.post<Psicologo>(this.apiUrl, psicologo);
  }

  update(id: number, psicologo: PsicologoRequest): Observable<Psicologo> {
    return this.http.put<Psicologo>(`${this.apiUrl}/${id}`, psicologo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
