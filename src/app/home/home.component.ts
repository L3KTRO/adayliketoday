import {Component, OnInit} from '@angular/core';
import {PullerService} from "../puller.service";
import {LinkComponent} from "../link/link.component";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {NgForOf} from "@angular/common";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {eventResult} from "wikipedia";
import {wikiSummary} from "wikipedia/dist/resultTypes";

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LinkComponent,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          '*',
          [
            style({opacity: 0, transform: 'translateY(-35px)'}),
            stagger(
              '100ms',
              animate(
                '250ms ease-out',
                style({opacity: 1, transform: 'translateY(0px)'})
              )
            )
          ],
        )
      ])
    ]),
    trigger('listLinksStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({opacity: 0, transform: 'translateY(-35px)'}),
            stagger(
              '150ms',
              animate(
                '250ms ease-out',
                style({opacity: 1, transform: 'translateY(0px)'})
              )
            )
          ],
        )
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  trigger = false;
  client_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  date = dayjs().tz(this.client_timezone).toDate();
  text!: string;
  references!: Array<wikiSummary>;
  year!: number | undefined;
  items!: eventResult;

  constructor(private puller: PullerService) {
  }

  ngOnInit() {
    this.getItems()
  }

  getItem(indexMod: number){

  }

  getInitialItem(){
    let item = this.items.events!![0];
    this.text = item.text.charAt(0).toUpperCase() + item.text.slice(1);
    this.references = item.pages;
    this.year = item.year;
    this.trigger = true
  }

  getItems() {
    this.puller.prepareItems(this.date.getDate(), this.date.getMonth()+1)
  }

  formatDate() {
    return `0${(this.date.getDate())}`.slice(-2) + " de " + this.puller.getWritedMonth(this.date.getMonth()) + " de ";
  }

}
