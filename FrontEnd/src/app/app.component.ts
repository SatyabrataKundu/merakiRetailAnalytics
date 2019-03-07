import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'retailanalytics';
  posWaitTime:any;
  zoneData: any;
  zoneName: string;
  message: string;

  private notifier: NotifierService;

  constructor(private http: HttpClient,  notifier: NotifierService){
    this.notifier = notifier;
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

  ngOnInit(){
    Observable
    timer(1,1000 * 60).subscribe(() =>
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/waitTime')
    .subscribe(res => {
      this.posWaitTime = res;
    })
    )

    Observable
    timer(1,1000 * 30).subscribe(() =>
    this.http.get('http://localhost:4004/api/v0/meraki/camera/currentVisitorsPerZone')
    .subscribe(res => {
      this.zoneData =  res;
      for(let i of this.zoneData){
        if(i.count == 0){
          this.zoneName = i.zone_name;
          this.message = this.zoneName + " zone has 0 visitors, please turn off lights to conserve energy"
          this.showNotification('default',this.message);
        }
      }
    })
    )

  }
}


