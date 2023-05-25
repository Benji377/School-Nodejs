import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (request.url !== 'http://localhost:8080/movie/login') {
            // Beim Login wird kein JWT mitgeschickt
            const authToken = localStorage.getItem('jwt');
            request = request.clone({
                setHeaders: { Authorization: 'Bearer ' + authToken }
            });
        }
        return next.handle(request);
    }
}