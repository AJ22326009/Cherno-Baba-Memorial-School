import { Routes } from '@angular/router';
import { AdminDashboard } from './admin/dashboard/dashboard';
import { TeacherDashboard } from './teacher/dashboard/dashboard';
import { StudentsForAdmin } from './admin/students/students';
import { StudentsForTeacher } from './teacher/students/students';
import { Users } from './admin/users/users';
import { Results } from './teacher/results/results';
import { Login } from './auth/login/login';
import { UserProfile } from './shared/user-profile/user-profile';

export const routes: Routes = [
    // ADMIN GROUP
    {
        path: 'admin',
        children: [
            { path: 'students', component: StudentsForAdmin },
            { path: 'users', component: Users },
            { path: '', component: AdminDashboard }, // Matches /admin
            { path: '**', component: AdminDashboard } // Matches /admin/invalid-path
        ]
    },

    // TEACHER GROUP
    {
        path: 'teacher',
        children: [
            { path: 'students', component: StudentsForTeacher },
            { path: 'results', component: Results },
            { path: '', component: TeacherDashboard }, // Matches /teacher
            { path: '**', component: TeacherDashboard } // Matches /teacher/invalid-path
        ]
    },

    { path: 'login', component: Login },
    { path: 'profile', component: UserProfile },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' } // Global 404 fallback
];
