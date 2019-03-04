import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js'

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  constructor() { }
  public chartType: string = "doughnut";
  public chartLabels: Array<string> =['Total checkouts', 'Total visitors', 'Total purchase'];
  public chartData: Array<number> = [350, 450, 100];
  public colorOptions: Array<any> = [
    {
      backgroundColor: ["rgba(175, 122, 197,0.4)","rgba(100, 123, 20, 0.4)","rgba(255, 20, 100, 0.4)" ],
      hoverBackgroundColor: ['rgba(175, 122, 197,1)', "rgba(100, 123, 20, 1)", "rgba(255, 20, 100, 1)"]
    }
  ];
  


  public chartOptions: any = {
    maintainAspectRatio: true,
    cutoutPercentage: 65,
    animateScale : true,
    responsive: true,
    legend: {
      display: false,
      
    },
    animation: {
      animateScale: true
    },
    
    hover:{
      animationDuration: 600,
    },

    tooltips:{
      enabled: false
    }
  }
  
  ngOnInit() {
  }

}
