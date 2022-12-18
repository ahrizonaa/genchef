import { Component } from '@angular/core';
import GenshinItems from '../GenshinItems';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  genshinItems = GenshinItems;
  genshinItemCache = this.genshinItems;
  searchQuery = '';
  constructor() {}

  searchQueried() {
    if (this.searchQuery == '') {
      this.genshinItems = GenshinItems;
    } else {
      this.genshinItems = GenshinItems.filter((each) => {
        return each.item.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
}
