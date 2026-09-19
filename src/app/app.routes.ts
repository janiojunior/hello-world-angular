import { Routes } from '@angular/router';
import { EstadoList } from './components/estados/estado-list/estado-list';
import { EstadoForm } from './components/estados/estado-form/estado-form';
import { MunicipioForm } from './components/municipios/municipio-form/municipio-form';
import { MunicipioList } from './components/municipios/municipio-list/municipio-list';
import { estadoResolver } from './resolvers/estado-resolver';
import { municipioResolver } from './resolvers/municipio-resolver';

export const routes: Routes = [
    {path: 'estados', component: EstadoList, title: 'Lista de Estados',},
    {path: 'estados/new', component: EstadoForm, title: 'Novo Estado',},
    {path: 'estados/edit/:id', component: EstadoForm, title: 'Editar Estado', 
        resolve: { estado: estadoResolver }},
    {path: 'municipios', component: MunicipioList, title: 'Lista de Municípios',},
    {path: 'municipios/new', component: MunicipioForm, title: 'Novo Município',},
    {path: 'municipios/edit/:id', component: MunicipioForm, title: 'Editar Município',
        resolve: { municipio: municipioResolver }},

];
