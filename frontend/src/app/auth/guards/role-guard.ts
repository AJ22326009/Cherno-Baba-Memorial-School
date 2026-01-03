import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as String[];

  if(!allowedRoles.includes(user.role)){
    router.navigate(['/error'], { queryParams: { reason: 'Access Denied' } });
    return false;
  }
  
  return true;
};
