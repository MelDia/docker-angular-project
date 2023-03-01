import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CurrencyServiceService } from 'src/app/service/currency-service.service';

@Component({
  selector: 'app-list-coin',
  templateUrl: './list-coin.component.html',
  styleUrls: ['./list-coin.component.scss']
})
export class ListCoinComponent implements OnInit {

  // DECLARO VARIABLES
  bannerDatos: any = [];
  currency: string = "USD";

  dataSource!: MatTableDataSource<any>;
  displayColumns: string[] = [
    'symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiServiceService,
    private currencyServ: CurrencyServiceService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();

    this.currencyServ.getCurrency().subscribe( 
      value => {
        this.currency = value;
        this.getAllData();
        this.getBannerData();
      }
    )
  }

  // OBTENER DATA DE BANNER
  getBannerData() {
    this.api.getTrendingCurrency(this.currency).subscribe(
      res => {
        console.log('response get banner data ->', res);
        this.bannerDatos = res;
      }
    )

  }

  // OBTENER TODOS LOS DATOS
  getAllData() {
    this.api.getCurrency(this.currency).subscribe(
      res => {
        console.log('response all data ->', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  // FILTRO
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // IR A DETALLES
  goDetails(row: any) {
    this.route.navigate(['detail-coin', row.id])
  }

}
