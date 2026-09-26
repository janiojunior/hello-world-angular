import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Paciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';

export const pacienteResolver: ResolveFn<Paciente> = (route) => {
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Paciente id is required.');
  }

  return inject(PacienteService).findById(id);
};
