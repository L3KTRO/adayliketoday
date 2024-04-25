import { Component, OnInit } from '@angular/core';
import { PullerService } from "../puller.service";
import { LinkComponent } from "../link/link.component";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { NgForOf } from "@angular/common";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Branch } from "../branch";
import { wikiSummary } from "wikipedia/dist/resultTypes";

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
  client_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  date = dayjs().tz(this.client_timezone).toDate();
  text!: string;
  references!: Array<wikiSummary>;
  year!: number | undefined;
  branches!: [Branch, Branch, Branch];
  indexBranch = 0;
  selectedBranch!: Branch;

  constructor(private puller: PullerService) { }

  ngOnInit() {
    this.puller.prepareItems(this.date.getDate(), this.date.getMonth() + 1).then((branches) => {
      this.branches = branches;
      this.initialization();
      this.refresh();
    })
  }

  refresh() {
    this.trigger = false;
    let item = this.selectedBranch.get();
    this.text = item.text;
    this.references = item.pages;
    this.year = item.year;
  }

  next() {
    this.selectedBranch.next();
    this.refresh();
  }

  prev() {
    this.selectedBranch.prev();
    this.refresh();
  }

  oldest() {
    this.selectedBranch.oldest();
    this.refresh();
  }

  newest() {
    this.selectedBranch.newest();
    this.refresh();
  }

  initialization() {
    this.selectedBranch = this.branches[0];
  }

  checkBranch() {
    if (this.indexBranch < 0) {
      this.indexBranch = 2;
    } else if (this.indexBranch > 2) {
      this.indexBranch = 0;
    }
  }

  nextBranch() {
    this.indexBranch = this.indexBranch + 1;
    this.checkBranch()
    this.selectedBranch = this.branches[this.indexBranch];
    this.refresh();
  }

  prevBranch() {
    this.indexBranch = this.indexBranch - 1;
    this.checkBranch()
    this.selectedBranch = this.branches[this.indexBranch];
    this.refresh();
  }

  formatDate() {
    return `0${(this.date.getDate())}`.slice(-2) + " de " + this.puller.getWritedMonth(this.date.getMonth()) + " de ";
  }

}
