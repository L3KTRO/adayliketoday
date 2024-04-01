import {Injectable} from '@angular/core';
import wiki from "wikipedia";

@Injectable({
  providedIn: 'root'
})
export class PullerService {

  async getOnThisDate() {
    wiki.setLang('es');
    return await wiki.onThisDay();
  }

  async getOnThisDateWithDate(day: number, month: number) {
    wiki.setLang('es');
    return await wiki.onThisDay({month: month.toString(), day: day.toString()});
  }
}
