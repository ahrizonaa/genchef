import { DishType } from './types';
import { GenshinDish, GenshinDishes } from './../GenshinDishes';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as _ from 'lodash';
import { IonModal } from '@ionic/angular';

let parseInt: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements AfterViewInit {
  objectKeys = Object.keys;
  @ViewChild('modal') modal: IonModal | undefined;
  genshinDishes: GenshinDish[];
  dishesByType: any = {};
  dishesByTypeCache: any = {};
  dishTypes: DishType[];
  searchQuery = '';
  isRecipeModalOpen: boolean;
  selectedDishes: GenshinDish[];
  totalHarvest: any;
  constructor() {
    this.genshinDishes = GenshinDishes;
    this.dishesByType = _.groupBy(this.genshinDishes, 'type');
    this.dishesByTypeCache = structuredClone(this.dishesByType);
    this.dishTypes = Object.keys(this.dishesByType).map((e) => {
      return { name: e, qty: 0 };
    });
    this.isRecipeModalOpen = false;
    this.selectedDishes = [];
    this.totalHarvest = [];
  }
  ngAfterViewInit(): void {
    console.log(this.modal);
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

    for (let ingredient of item.recipe) {
      if (this.totalHarvest[ingredient.ingredient] != undefined) {
        this.totalHarvest[ingredient.ingredient] += ingredient.quantity;
      } else {
        this.totalHarvest[ingredient.ingredient] = ingredient.quantity;
      }
    }

    if (item.quantity == 1) {
      this.selectedDishes.push(item);
    }
    this.isRecipeModalOpen = true;
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

    for (let ingredient of item.recipe) {
      this.totalHarvest[ingredient.ingredient] -= ingredient.quantity;
    }

    if (item.quantity == 0) {
      _.remove(this.selectedDishes, item);

      if (this.selectedDishes.length == 0) {
        this.isRecipeModalOpen = false;
      }
    }
  }

  clearAllSelections($event: Event, dishType: DishType) {
    this.dishesByTypeCache[dishType.name].forEach((e: GenshinDish) => {
      e.quantity = 0;
    });
    dishType.qty = 0;
    this.isRecipeModalOpen = false;
    this.selectedDishes = [];
    this.totalHarvest = [];
  }

  modalIsDismissing(event: Event, modal: IonModal) {
    if (this.selectedDishes.length > 0) {
      modal.setCurrentBreakpoint(0.25);
    }
  }

  canModalDismiss(event: Event): Promise<boolean> {
    if (this.selectedDishes.length > 0) {
      this.modal?.setCurrentBreakpoint(0.25);
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }
}
