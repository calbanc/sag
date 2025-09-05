import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./components/login/login.component')
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'main',
        pathMatch: 'full',
        loadComponent: () => import('./components/main/main.component')
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
