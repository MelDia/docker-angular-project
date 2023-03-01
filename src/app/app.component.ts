import { Component } from '@angular/core';
import { CurrencyServiceService } from './service/currency-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  selectedCurrency: string = 'USD';

  constructor(
    private currency: CurrencyServiceService
  ) {}

  sendCurrency(event: string) {
    console.log('EVENTO ->', event);
    this.currency.setCurrency(event);
  }

}
