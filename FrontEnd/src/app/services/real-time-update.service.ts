import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdateService {

  constructor(private http : HttpClient) { }

  getCount(){
    return this.http.get('http://localhost:4004/api/v0/meraki/scanning');
  }
}
