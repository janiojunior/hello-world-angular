import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente, PacienteRequest } from '../models/paciente.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly apiUrl = 'http://localhost:8080/pacientes';

  constructor(private http: HttpClient) {}

  findAll(
    page: number = 0,
    pageSize: number = 10,
  ): Observable<PageResponse<Paciente>> {
    return this.http.get<PageResponse<Paciente>>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`,
    );
  }

  findByNome(
    nome: string,
    page: number = 0,
    pageSize: number = 10,
  ): Observable<PageResponse<Paciente>> {
    return this.http.get<PageResponse<Paciente>>(
      `${this.apiUrl}/nome/${encodeURIComponent(nome)}?page=${page}&pageSize=${pageSize}`,
    );
  }

  findById(id: number | string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  findByCpf(cpf: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/cpf/${encodeURIComponent(cpf)}`);
  }

  create(paciente: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  update(id: number, paciente: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
