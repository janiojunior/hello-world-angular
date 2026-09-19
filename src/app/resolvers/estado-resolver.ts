import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EstadoService } from '../services/estado.service';
import { Estado } from '../models/estado.model';

export const estadoResolver: ResolveFn<Estado> = (route, state) => {
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Estado id is required.');
  }

  return inject(EstadoService).findById(id);
};
