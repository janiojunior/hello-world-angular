import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estado } from '../models/estado.model';
import { Observable } from 'rxjs';

export interface PagedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

@Injectable({providedIn: 'root'})
export class EstadoService {
    private readonly apiUrl: string = 'http://localhost:8080/estados';

    constructor(private http: HttpClient) {}

    findAll(page: number = 0, pageSize: number = 10): Observable<PagedResponse<Estado>> {
        return this.http.get<PagedResponse<Estado>>(
            `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
        );
    }

    findById(id: number | string): Observable<Estado> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Estado>(url);
    }

    create(estado: Estado): Observable<Estado> {
        return this.http.post<Estado>(this.apiUrl, estado);
    }

    update(id: number, estado: Estado): Observable<Estado> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Estado>(url, estado);
    }

    delete(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}
