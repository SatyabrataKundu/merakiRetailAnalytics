import { Component, OnInit, Input } from '@angular/core';
import { Observable, interval} from 'rxjs';

// import 'rxjs/add/operator/startWith';
// import 'rxjs/add/operator/switchMap';
import { RealTimeUpdateService } from 'src/app/services/real-time-update.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'information-cards',
  templateUrl: './information-cards.component.html',
  styleUrls: ['./information-cards.component.scss']
})
export class InformationCardsComponent implements OnInit {
  @Input() products$: Observable<any>;
  countUpdt : any;
  countUpdt1 : any;
  countUpdt2 : any;
  delay = interval(1000);
  constructor(private http : HttpClient) { 
    
  }

 
  ngOnInit() {
    
    Observable
    interval(500).subscribe(() => {
      this.http.get('http://localhost:4004/api/v0/meraki/scanning/')
      .subscribe(res => {
        this.countUpdt = res.count;
        this.countUpdt1 = res.count;
        this.countUpdt2 = res.count + 45367;
        console.log(this.countUpdt);
      })
    })
  }

}
