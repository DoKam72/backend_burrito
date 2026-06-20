import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RegisterInterface} from '../models/register.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
providedIn:
'root',
})

export class RegisterService {

urlBase=
environment.apiUrl;

constructor(

private httpClient:
HttpClient

){}

registrarse(

usuario:
RegisterInterface

):Observable<any>{

return this.httpClient.post(

`${this.urlBase}/auth/register`,

usuario,

);

}

}