import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  public chartType: string = "bar";
  public chartLabels: Array<string> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  public chartData: Array<number> = [343,232,345,532,233,122,241];
  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(139, 208, 10, 0.3)",
      borderColor: "#00496B"
    }
  ];
  public chartOptions: any = {
    aspectRatio: 3,
    maintainAspectRatio: true,
    responsive: false,
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

  ngOnInit() {
  }

}
