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
  selectedValue: any;
  granularity: any;
  pattern: string = "";
  isDisabled: boolean = true;
  zones:any;
  zoneName: any;
  zoneGranularity:any;
  zoneDataFetched: any;
  zoneLabels: any;
  zoneChartFlag: boolean = false;
  selectedValue3: any;
  count:number = 0;

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Weekly Till Now", viewValue: "This Month" },
    { value: "Weekly", viewValue: "Last Month" }
  ];

  proximityDataFetched: any;
  scanningDataFetched: any;
  proximityChartData = [];
  scanningChartData = [];

  public chartType: string = "bar";
  public chartLabels: Array<any> = [];
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
            maxTicksLimit: 4,
            beginAtZero: true
          },
        }
      ]
    },
    tooltips: {
      callbacks: {
         label: function(tooltipItem) {
                return tooltipItem.yLabel;
         }
      }
  }
  };

  public chartType2: string = "bar";
  public chartLabels2: Array<string> = [];
  public chartData2: Array<number> = [];
  public colorOptions2: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(83, 173, 227,0.5)",
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
            maxTicksLimit: 3,
            beginAtZero: true
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
         label: function(tooltipItem) {
                return tooltipItem.yLabel;
         }
      }
  }
  };



  proximityChartUpdate() {

    this.chartService.getChartData()
      .subscribe(res => {
        this.chartData = [];
        this.proximityDataFetched = res;
        for (let i of this.proximityDataFetched) {
          this.chartData.push(i["count"]);
        }
        if(this.proximityDataFetched.length == 0){
          this.chartData.push(0);
        }
      })

    this.setChartData(this.chartData);
  }

  zoneAnalysisChartUpdate(){

    
      this.chartService.getZoneChartData()
        .subscribe(res => {
          this.chartData2 = [];
          this.zoneDataFetched = res;
          for (let i of this.zoneDataFetched) {
            this.chartData2.push(i["detected_clients"]);
          }
          if(this.zoneDataFetched.length == 0){
            this.chartData2.push(0);
          }
        })

    this.setZoneChartData(this.chartData2);

  }

  changeZone(zone){
    this.isDisabled = false;
    this.zoneName = zone.value;
    this.chartService.setZoneId(zone);
    
    if(this.count > 0){
      this.chartService.getZoneChartData()
    .subscribe(res => {
      this.chartLabels2 = [];
      this.zoneLabels = res;
      for(let i of this.zoneLabels){
        this.chartLabels2.push(i["timerange"])
      }
    })

    this.setZoneChartLabels(this.chartLabels2);
      this.zoneAnalysisChartUpdate();
    }
    this.count++;
  }

  changeZoneGran(gran){
    this.zoneGranularity = gran.value;
    this.chartService.setZoneGranularity(this.zoneGranularity);

    this.chartService.getZoneChartData()
    .subscribe(res => {
      this.chartLabels2 = [];
      this.zoneLabels = res;
      for(let i of this.zoneLabels){
        this.chartLabels2.push(i["timerange"])
      }
    })

    this.setZoneChartLabels(this.chartLabels2);
    this.zoneAnalysisChartUpdate();
  }


  changeGran(gran) {
    this.granularity = gran.value;

    this.chartService.setGranularity(this.granularity);


    this.chartService.getChartData()
      .subscribe(res => {
        this.chartLabels = [];
        this.proximityDataFetched = res;
        for (let i of this.proximityDataFetched) {
          this.chartLabels.push(i.timerange);
        }
      })
    this.setChartLabels(this.chartData);


    this.proximityChartUpdate();
  }

  private setChartData(data) {
    this.chartData = data;
  }

  private setChartLabels(labels) {
    this.chartLabels = labels;
  }

  private setZoneChartData(data){
    this.chartData2 = data;
  }

  private setZoneChartLabels(labels){
    this.chartLabels2 = labels;
  }

  ngOnInit() {
    this.http.get('http://localhost:4004/api/v0/meraki/camera/zones')
    .subscribe(res => {
      this.zones = res;
    })
  }
}
