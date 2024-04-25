import {Injectable} from '@angular/core';
import wiki, { eventResult } from "wikipedia";
import { BranchService } from './branch.service';

@Injectable({
  providedIn: 'root'
})
export class PullerService {
  items!: eventResult;
  events!: BranchService;
  births!: BranchService;
  deaths!: BranchService;
  branches: [BranchService, BranchService, BranchService] = [this.events, this.births, this.deaths];

  async prepareItems(day: number | undefined, month: number | undefined) {
    wiki.setLang('es');
    let items = (!day || !month) ? await wiki.onThisDay() : await wiki.onThisDay({month: month.toString(), day: day.toString()});
    this.events = new BranchService(items.events!!);
    this.births = new BranchService(items.births!!);
    this.deaths = new BranchService(items.deaths!!);
    
    return true;
  }

  getWritedMonth(month: number) : string {
    switch((month+1)) {
      case 1:
        return 'Enero';
      case 2:
        return 'Febrero';
      case 3:
        return 'Marzo';
      case 4:
        return 'Abril';
      case 5:
        return 'Mayo';
      case 6:
        return 'Junio';
      case 7:
        return 'Julio';
      case 8:
        return 'Agosto';
      case 9:
        return 'Septiembre';
      case 10:
        return 'Octubre';
      case 11:
        return 'Noviembre';
      case 12:
        return 'Diciembre';
      default:
        return 'Error';
    }
  }

}
