import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailCoinComponent } from './components/detail-coin/detail-coin.component';
import { ListCoinComponent } from './components/list-coin/list-coin.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'list-coin' },
  { path: 'list-coin', component: ListCoinComponent },
  { path: 'detail-coin/:id', component: DetailCoinComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
