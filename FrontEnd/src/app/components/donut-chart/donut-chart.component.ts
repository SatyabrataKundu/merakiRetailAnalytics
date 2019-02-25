import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  constructor() { }
  public chartType: string = "doughnut";
  public chartLabels: Array<string> =['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public chartData: Array<number> = [350, 450, 100];
  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(139, 208, 10, 0.3)",
      borderColor: "#00496B"
    }
  ];
  public chartOptions: any = {
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      display: false
    }
  }
  
  ngOnInit() {
  }

}
