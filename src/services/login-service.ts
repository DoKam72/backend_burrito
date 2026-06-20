import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginInterface } from '../models/login.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})

export class LoginService {

  urlBase = environment.apiUrl;

  constructor(
    private httpClient:
    HttpClient,
  ) {}

  login(
    usuario:
    LoginInterface,
  ):Observable<any>{

    return this.httpClient.post(

      `${this.urlBase}/auth/login`,

      usuario,

    );

  }

  guardarToken(
    token:string,
    role:string,
  ){

    localStorage.setItem(
      'token',
      token,
    );

    localStorage.setItem(
      'role',
      role,
    );

  }

  cerrarSesion(){

    localStorage.removeItem(
      'token',
    );

    localStorage.removeItem(
      'role',
    );

  }

  recuperarToken(){

    return localStorage.getItem(
      'token',
    );

  }

  sesionIniciada(){

    return (
      this.recuperarToken()
      !== null
    );

  }

}