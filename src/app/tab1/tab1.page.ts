import { Component } from '@angular/core';
import GenshinIngredients from '../GenshinIngredients';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  genshinItems = GenshinIngredients;
  searchQuery = '';
  constructor() {}

  searchQueried() {
    if (this.searchQuery == '') {
      this.genshinItems = GenshinIngredients;
    } else {
      this.genshinItems = GenshinIngredients.filter((each) => {
        return each.item.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
}
