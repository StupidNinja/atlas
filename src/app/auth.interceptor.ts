import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const excludedUrls = [
    '/api/users/login/',
    '/api/users/register/',
    '/api/token/refresh/',
  ];

  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  if (shouldExclude) {
    return next(req);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
