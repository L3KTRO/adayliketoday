import {Injectable} from '@angular/core';
import wiki, {eventResult} from "wikipedia";
import {Branch} from './branch';

@Injectable({
  providedIn: 'root'
})
export class PullerService {

  async prepareItems(day: number | undefined, month: number | undefined): Promise<[Branch, Branch, Branch]> {
    wiki.setLang('es');
    let items = (!day || !month) ? await wiki.onThisDay() : await wiki.onThisDay({
      month: month.toString(),
      day: day.toString()
    });
    return [
      new Branch("Hecho histórico", items.events),
      new Branch("Nacimiento", items.births),
      new Branch("Fallecimiento", items.deaths)
    ];
  }


  getWritedMonth(month: number): string {
    switch ((month + 1)) {
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
