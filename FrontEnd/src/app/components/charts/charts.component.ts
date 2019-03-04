import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { ChartdataService } from 'src/app/services/chartdata.service';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor(private http: HttpClient, private chartService: ChartdataService) { }
  selectedValue:  any;
  granularity: any;
  pattern : string = "";
  flag:boolean =  false;

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Weekly Till Now", viewValue: "This Month" },
    { value: "Weekly", viewValue: "Last Month" }
  ];

  proximityDataFetched:any;
  scanningDataFetched:any;
  proximityChartData=[];
  scanningChartData=[];

  public chartType: string = "bar";
  public chartLabels: Array<any>=[];
  public chartData: Array<number> = [];
  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(139, 208, 10, 0.3)",
      borderColor: "#00496B"
    }
  ];
  public chartOptions: any = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 1,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 3
          }
        }
      ]
    }
  };

  public chartType2: string = "bar";
  public chartLabels2: Array<string> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  public chartData2: Array<number> = [23,12,15,22,23,12,24];
  public colorOptions2: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(139, 208, 10, 0.3)",
      borderColor: "#00496B"
    }
  ];
  public chartOptions2: any = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 1,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 3
          }
        }
      ]
    }
  };

  proximityChartUpdate(){
    
    if(this.flag){
    this.chartData=[];
    this.chartLabels=[];
    for(let i of this.proximityDataFetched){
      this.chartData.push(i.count);
      this.chartLabels.push(i.date);

    }
    }

    this.chartService.getChartData()
    .subscribe(res => {
      this.chartData = [];
      this.chartLabels = [];
      this.proximityDataFetched = res;
      for(let i of this.proximityDataFetched){
        this.chartData.push(i.count);
        this.chartLabels.push(i.date);
      }
    })
  }

  changeGran(gran){
    this.flag = false;
    this.granularity = gran.value;

    this.chartService.setGranularity(this.granularity);

    if(this.granularity == "Daily" || this.granularity == "Daily Till Now"){
      this.chartLabels = [];
      this.chartLabels2 = [];
    }

    else if(this.granularity == "Hourly" || this.granularity == "Hourly Till Now"){
      this.chartLabels = 
      [ "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "23:59",];
      this.chartLabels2 = this.chartLabels;
      }
    
    this.proximityChartUpdate();
  }

  ngOnInit() {


    this.flag = true;
    this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorPattern?pattern=this week')
    .subscribe(res => {
      this.proximityDataFetched = res;
      this.proximityChartUpdate();
    })
  }

}
