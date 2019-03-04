import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ChartdataService {

  granularity:any;

  constructor(private http: HttpClient) { }

  setGranularity(granularity){
    if(granularity == "Hourly Till Now")
    this.granularity = "today";
    
    else if(granularity == "Hourly")
    this.granularity = "yesterday";
    
    else if(granularity == "Daily Till Now")
    this.granularity = "this week";
    
    else if(granularity == "Daily")
    this.granularity = "last week";
    
    else if(granularity == "Weekly Till Now")
    this.granularity = "this month";
    
    else
    this.granularity="last month";
  }

  getChartData(){
    return this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorPattern?pattern='+this.granularity)
    .pipe(map((res:Response) => {
      return res;
    }))
  }
}
