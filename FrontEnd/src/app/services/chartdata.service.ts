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
    this.granularity = granularity;
  }

  getChartData(){
    return this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorPattern?pattern='+this.granularity)
    .pipe(map((res:Response) => {
      return res;
    }))
  }
}
