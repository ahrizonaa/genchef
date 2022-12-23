import { DishType } from './types';
import { GenshinDish, GenshinDishes } from './../GenshinDishes';
import { Component } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  genshinDishes: GenshinDish[];
  dishesByType: any = {};
  dishesByTypeCache: any = {};
  dishTypes: DishType[];
  searchQuery = '';
  constructor() {
    this.genshinDishes = GenshinDishes;
    this.dishesByType = _.groupBy(this.genshinDishes, 'type');
    this.dishesByTypeCache = structuredClone(this.dishesByType);
    this.dishTypes = Object.keys(this.dishesByType).map((e) => {
      return { name: e, qty: 0 };
    });
  }

  searchQueried(event: Event) {
    console.log(event, this.searchQuery);
    if (this.searchQuery == '') {
      this.genshinDishes = GenshinDishes;
    } else if (this.searchQuery.length < 3) {
      return;
    } else {
      for (let dishtype of this.dishTypes) {
        this.dishesByTypeCache[dishtype.name] = this.dishesByType[
          dishtype.name
        ].filter((each: GenshinDish) => {
          return each.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      }
    }
  }

  cellClicked(
    event: Event,
    item: GenshinDish,
    ref: HTMLElement,
    dishType: DishType
  ) {
    ref.classList.toggle('border-selected');

    item.quantity = !item.quantity ? 1 : item.quantity + 1;
    dishType.qty += 1;
  }

  removeIngredient(
    $event: Event,
    item: GenshinDish,
    ref: HTMLElement,
    dishType: DishType
  ) {
    $event.stopPropagation();
    if (!item.quantity) {
      return;
    }

    item.quantity -= 1;
    dishType.qty -= 1;
  }

  clearAllSelections($event: Event, dishType: DishType) {
    this.dishesByTypeCache[dishType.name].forEach((e: GenshinDish) => {
      e.quantity = 0;
    });
    dishType.qty = 0;
  }
}
