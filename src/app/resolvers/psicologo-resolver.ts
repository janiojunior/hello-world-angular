import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Psicologo } from '../models/psicologo.model';
import { PsicologoService } from '../services/psicologo.service';

export const psicologoResolver: ResolveFn<Psicologo> = (route) => {
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Psicologo id is required.');
  }

  return inject(PsicologoService).findById(id);
};
