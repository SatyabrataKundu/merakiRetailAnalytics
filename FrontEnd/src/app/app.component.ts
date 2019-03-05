import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/waitTime')
    .subscribe(res => {
      this.posWaitTime = res;
    })
  }
}


