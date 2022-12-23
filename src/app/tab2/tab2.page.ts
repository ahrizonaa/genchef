import { GenshinDish, GenshinDishes } from './../GenshinDishes';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  genshinDishes = GenshinDishes;
  searchQuery = '';
  constructor() {}

  searchQueried() {
    if (this.searchQuery == '') {
      this.genshinDishes = GenshinDishes;
    } else {
      this.genshinDishes = GenshinDishes.filter((each: GenshinDish) => {
        return each.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }

  cellClicked(event: Event, item: GenshinDish, ref: HTMLElement) {
    ref.classList.toggle('border-selected');

    item.quantity = !item.quantity ? 1 : item.quantity + 1;

    console.log(event, item, ref);
  }

  removeIngredient($event: Event, item: GenshinDish, ref: HTMLElement) {
    $event.stopPropagation();
    if (!item.quantity) return;

    item.quantity -= 1;

    console.log(event, item, ref);
  }
}
