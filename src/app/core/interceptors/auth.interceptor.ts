import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true // Esto permite enviar la cookie HttpOnly
  });
  return next(clonedRequest);
};