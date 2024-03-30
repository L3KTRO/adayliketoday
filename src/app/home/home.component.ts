import {Component, OnInit} from '@angular/core';
import {PullerService} from "../puller.service";
import {WikiHistory, Data} from "../../types";
import {LinkComponent} from "../link/link.component";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {NgForOf} from "@angular/common";

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
            style({ opacity: 0, transform: 'translateY(-35px)' }),
            stagger(
              '100ms',
              animate(
                '250ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
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
            style({ opacity: 0, transform: 'translateY(-35px)' }),
            stagger(
              '150ms',
              animate(
                '250ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
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
  date = new Date();
  incident!: Data;

  constructor(private puller: PullerService) {
  }

  ngOnInit() {
    this.getHistory()
  }

  getHistory() {
    this.puller.get(`https://history.muffinlabs.com/date/${this.date.getMonth()+1}/${this.date.getDate()}`).subscribe(data => {
      this.incident = this.getIncident(data);
      this.trigger = !this.trigger;
    });
  }

  getIncident(history: WikiHistory) {
    let events = history.data.Events;
    let births = history.data.Births;
    let deaths = history.data.Deaths;

    let incidents: Data[] = events.concat(births, deaths);

    return incidents[0];
  }

  formatDate() {
    let formatted = this.date;
    return formatted.getDate() + " / " + ('0' + (formatted.getMonth() + 1)).slice(-2) + " / ";
  }

  getYear() {
    let formatted = new Date(this.incident?.year);
    return formatted.getFullYear();
  }
}
