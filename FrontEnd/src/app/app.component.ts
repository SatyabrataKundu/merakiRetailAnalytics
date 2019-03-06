import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, timer} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'retailanalytics';
  posWaitTime:any;

  constructor(private http: HttpClient){}

  ngOnInit(){
    Observable
    timer(1,1000 * 60).subscribe(() =>
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/waitTime')
    .subscribe(res => {
      this.posWaitTime = res;
    })
    )
  }
}


