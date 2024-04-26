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
import { ItemComponent } from '../item/item.component';
import { timeout } from 'rxjs';
import { blockOverflow, unblockOverflow } from '../../main';

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LinkComponent,
    NgForOf,
    ItemComponent
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
    trigger('dataChange', [
      transition('entering => done', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0px)' })
        )
      ]),
      transition('done => entering', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateY(30px)' }),
        )
      ]),
    ]),
    trigger('branchChange', [
      transition('entering => done', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0px)' })
        )
      ]),
      transition('done => entering', [
        style({ opacity: 1, transform: 'translateX(0px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateX(30px)' }),
        )
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit {
  trigger = false;
  client_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  date = dayjs().tz(this.client_timezone).toDate();
  concept!: string;
  text!: string;
  references!: Array<wikiSummary>;
  year!: number | undefined;
  branches!: [Branch, Branch, Branch];
  indexBranch = 0;
  selectedBranch!: Branch;
  dataState: 'entering' | 'done' = 'done';
  dataStateYear: 'entering' | 'done' = 'done';
  branchChange: 'entering' | 'done' = 'done';
  refreshing = false;

  constructor(private puller: PullerService) { }

  async ngOnInit() {
    let branches = await this.puller.prepareItems(this.date.getDate(), this.date.getMonth() + 1);
    this.branches = branches;
    await this.initialization();
    await this.refresh();
  }

  async refresh(animate = true) {
    if (this.refreshing) return;
    this.refreshing = true;
    blockOverflow();

    if (animate == false) this.branchChange = 'entering';
    else {
      this.dataState = 'entering';
      this.dataStateYear = 'entering';
    }

    setTimeout(() => {
      this.trigger = false;
      let item = this.selectedBranch.get();
      this.concept = this.selectedBranch.concept;
      this.text = item.text.charAt(0).toUpperCase() + item.text.slice(1);
      this.references = item.pages;
      this.year = item.year;
      this.refreshing = false;
      unblockOverflow();
    }, 300);
  }

  async next() {
    this.selectedBranch.next();
    await this.refresh();
  }

  async prev() {
    this.selectedBranch.prev();
    await this.refresh();
  }

  async oldest() {
    this.selectedBranch.oldest();
    await this.refresh();
  }

  async newest() {
    this.selectedBranch.newest();
    await this.refresh();
  }

  async initialization() {
    this.selectedBranch = this.branches[0];
  }

  async checkBranch() {
    this.branchChange = 'entering';
    if (this.indexBranch < 0) {
      this.indexBranch = 2;
    } else if (this.indexBranch > 2) {
      this.indexBranch = 0;
    }
  }

  async nextBranch() {
    this.indexBranch = this.indexBranch + 1;
    await this.checkBranch()
    this.selectedBranch = this.branches[this.indexBranch];
    await this.refresh(false);
  }

  async prevBranch() {
    this.indexBranch = this.indexBranch - 1;
    await this.checkBranch()
    this.selectedBranch = this.branches[this.indexBranch];
    await this.refresh(false);
  }

  formatDate() {
    return `0${(this.date.getDate())}`.slice(-2) + " de " + this.puller.getWritedMonth(this.date.getMonth()) + " de ";
  }

}
