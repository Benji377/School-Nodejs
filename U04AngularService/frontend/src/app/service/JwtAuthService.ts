import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Zum Dekodieren des JWTs
import jwt_decode, { JwtPayload } from 'jwt-decode';
// Um mit Zeitangaben rechnen zu können
import * as moment from 'moment';

const URL = 'http://localhost:8080';
@Injectable({ providedIn: 'root' })
export class JwtAuthService {
    constructor(
        private httpClient: HttpClient
    ) { }
    async login(na: string, pw: string) {
        try {
            // Holen des JWT vom Server
            const result = await this.httpClient
                .post<{ jwt: string }>(`${URL}/movie/login`, { na, pw })
                .toPromise();
            // Schreibe codiertes JWT in LocalStorage
            localStorage.setItem('jwt', result.jwt);
        } catch (error) {
            // Wenn Benutzer sich nicht authentifizieren konnte
            this.logout();
            throw error;
        }
    }
    logout() {
        localStorage.removeItem('jwt');
    }
    isLoggedIn() {
        const jwt = localStorage.getItem('jwt');
        if (jwt == null) {
            return false;
        } else {
            // Dekodiere JWT um die Verfallsdatum (exp) zu ermitteln
            const jwtDecodet = jwt_decode<JwtPayload>(jwt);
            if (jwtDecodet.exp != undefined) {
                return moment().isBefore(moment(jwtDecodet.exp! * 1000));
            }
            console.error("jwtDecodet.exp is undefined");
            return moment().isBefore(moment(0));
        }
    }
}