import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

export interface MunicipioPagedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

@Injectable({providedIn: 'root'})
export class MunicipioService {
    private readonly apiUrl: string = 'http://localhost:8080/municipios';

    constructor(private http: HttpClient) {}

    findAll(page: number = 0, pageSize: number = 10): Observable<MunicipioPagedResponse<Municipio>> {
        return this.http.get<MunicipioPagedResponse<Municipio>>(
            `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
        );
    }

    findById(id: number | string): Observable<Municipio> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Municipio>(url);
    }

    create(municipio: Municipio): Observable<Municipio> {
        return this.http.post<Municipio>(this.apiUrl, municipio);
    }

    update(id: number, municipio: Municipio): Observable<Municipio> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Municipio>(url, municipio);
    }

    delete(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}