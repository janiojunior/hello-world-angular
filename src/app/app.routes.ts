import { Routes } from '@angular/router';
import { EstadoList } from './components/estados/estado-list/estado-list';

export const routes: Routes = [
    {
        path: 'estados', component: EstadoList, title: 'Lista de Estados',
    }
];
