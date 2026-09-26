import { Routes } from '@angular/router';
import { EstadoList } from './components/estados/estado-list/estado-list';
import { EstadoForm } from './components/estados/estado-form/estado-form';
import { MunicipioForm } from './components/municipios/municipio-form/municipio-form';
import { MunicipioList } from './components/municipios/municipio-list/municipio-list';
import { PacienteForm } from './components/pacientes/paciente-form/paciente-form';
import { PacienteList } from './components/pacientes/paciente-list/paciente-list';
import { PsicologoForm } from './components/psicologos/psicologo-form/psicologo-form';
import { PsicologoList } from './components/psicologos/psicologo-list/psicologo-list';
import { estadoResolver } from './resolvers/estado-resolver';
import { municipioResolver } from './resolvers/municipio-resolver';
import { pacienteResolver } from './resolvers/paciente-resolver';
import { psicologoResolver } from './resolvers/psicologo-resolver';

export const routes: Routes = [
    {path: 'estados', component: EstadoList, title: 'Lista de Estados',},
    {path: 'estados/new', component: EstadoForm, title: 'Novo Estado',},
    {path: 'estados/edit/:id', component: EstadoForm, title: 'Editar Estado', 
        resolve: { estado: estadoResolver }},
    {path: 'municipios', component: MunicipioList, title: 'Lista de Municípios',},
    {path: 'municipios/new', component: MunicipioForm, title: 'Novo Município',},
    {path: 'municipios/edit/:id', component: MunicipioForm, title: 'Editar Município',
        resolve: { municipio: municipioResolver }},
    {path: 'pacientes', component: PacienteList, title: 'Lista de Pacientes',},
    {path: 'pacientes/new', component: PacienteForm, title: 'Novo Paciente',},
    {path: 'pacientes/edit/:id', component: PacienteForm, title: 'Editar Paciente',
        resolve: { paciente: pacienteResolver }},
    {path: 'psicologos', component: PsicologoList, title: 'Lista de Psicólogos',},
    {path: 'psicologos/new', component: PsicologoForm, title: 'Novo Psicólogo',},
    {path: 'psicologos/edit/:id', component: PsicologoForm, title: 'Editar Psicólogo',
        resolve: { psicologo: psicologoResolver }},

];
