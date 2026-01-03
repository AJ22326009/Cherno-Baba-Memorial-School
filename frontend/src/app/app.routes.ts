import { Routes } from '@angular/router';
import { AdminDashboard } from './admin/dashboard/dashboard';
import { TeacherDashboard } from './teacher/dashboard/dashboard';
import { StudentsForAdmin } from './admin/students/students';
import { Users } from './admin/users/users';
import { Results } from './teacher/results/results';
import { Login } from './auth/login/login';
import { UserProfile } from './shared/user-profile/user-profile';
import { roleGuard } from './auth/guards/role-guard';
import { authGuard } from './auth/guards/auth-guard';
import { Error } from './auth/error/error';

export const routes: Routes = [
    // ADMIN GROUP
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] },
        children: [
            { path: 'students', component: StudentsForAdmin },
            { path: 'users', component: Users },
            { path: '', component: AdminDashboard }, // Matches /admin
            { path: '**', component: Error, data: { reason: 'Page not found' } } // Matches /admin/invalid-path
        ]
    },

    // TEACHER GROUP
    {
        path: 'teacher',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['teacher'] },
        children: [
            { path: 'results', component: Results },
            { path: '', component: TeacherDashboard }, // Matches /teacher
            { path: '**', component: Error, data: { reason: 'Page not found' } } // Matches /teacher/invalid-path
        ]
    },

    { path: 'login', component: Login },
    { path: 'profile',canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'teacher'] }, component: UserProfile },
    {path: 'error', component: Error}, // Placeholder for Error component
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: Error, data: { reason: 'Page not found' } }
];
