import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CurrencyServiceService } from 'src/app/service/currency-service.service';

@Component({
  selector: 'app-detail-coin',
  templateUrl: './detail-coin.component.html',
  styleUrls: ['./detail-coin.component.scss']
})
export class DetailCoinComponent implements OnInit {

  dataCoin: any;
  idCoin!: string;
  days: number = 30;
  currency: string = "USD";

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Price Trends',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#1d556b',
        pointBackgroundColor: '#1d556b',
        pointBorderColor: '#1d556b',
        pointHoverBackgroundColor: '#1d556b',
        pointHoverBorderColor: '#1d556b'
      }
    ], labels: []
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: {display: true}
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff'
        }
      }
    },
  }

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private api: ApiServiceService,
    private currencyServ: CurrencyServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe( value => {this.idCoin = value['id']});

    this.getCoingData();
    this.getGraphic(this.days);
    this.currencyServ.getCurrency().subscribe(value => {
      this.currency = value;
      this.getCoingData();
      this.getGraphic(this.days);
    })

  }

  getCoingData() {
    this.api.getCurrencyById(this.idCoin).subscribe(res => {

      // if(this.currency === 'USD') {
        res.market_data.current_price.usd = res.market_data.current_price.usd;
        res.market_data.market_cap.usd = res.market_data.market_cap.usd;
      // }
      this.dataCoin = res;
      console.log('DATA COIN ->', this.dataCoin);

    })
  }

  getGraphic(days:number) {
    this.days = days;

    this.api.getGrpahicalCurrencyData(this.idCoin, 
                                      this.currency, 
                                      this.days)
    .subscribe(res => {
      setTimeout(() => {
        this.myLineChart.chart?.update();
      }, 200);

      this.lineChartData.datasets[0].data = res.prices.map(
        (a:any) => {
          return a[1];
        }
      );

      this.lineChartData.labels = res.prices.map(
        (a:any) => {
          let date = new Date(a[0]);
          let time = date.getHours() > 12 
                ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
                : `${date.getHours() - 12}: ${date.getMinutes()} AM`;

          return this.days === 1 ? time : date.toLocaleDateString();
        }
      )
    })
                    
  }

}
