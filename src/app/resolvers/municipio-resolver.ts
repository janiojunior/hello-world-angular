import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Municipio } from '../models/municipio.model';
import { MunicipioService } from '../services/municipio.service';

export const municipioResolver: ResolveFn<Municipio> = (route, state) => {
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Municipio id is required.');
  }

  return inject(MunicipioService).findById(id);
};