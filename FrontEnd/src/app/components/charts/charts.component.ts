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
  flag: boolean = false;

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

  public chartType: string = "line";
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
            maxTicksLimit: 4
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
  public chartData2: Array<number> = [23, 12, 15, 22, 23, 12, 24];
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



  proximityChartUpdate() {

    this.chartService.getChartData()
      .subscribe(res => {
        this.chartData = [];
        this.proximityDataFetched = res;
        for (let i of this.proximityDataFetched) {
          this.chartData.push(i["count"]);
        }
      })

    this.setChartData(this.chartData);
  }



  changeGran(gran) {
    this.flag = false;
    this.granularity = gran.value;

    this.chartService.setGranularity(this.granularity);


    this.chartService.getChartData()
      .subscribe(res => {
        this.chartLabels = [];
        this.proximityDataFetched = res;
        for (let i of this.proximityDataFetched) {
          this.chartLabels.push(i.date);
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

  ngOnInit() {
  }
}
