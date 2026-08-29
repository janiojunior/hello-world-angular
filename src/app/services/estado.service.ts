import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Estado } from '../models/estado.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class EstadoService {
    private readonly apiUrl: string = 'http://localhost:8080/estados';

    constructor(private http: HttpClient) {}

    findAll(): Observable<Estado[]> {
        return this.http.get<Estado[]>(this.apiUrl);
    }
}
