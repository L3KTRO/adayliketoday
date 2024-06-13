import { Component, OnInit } from '@angular/core';
import { PullerService } from "../puller.service";
import { LinkComponent } from "../link/link.component";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Branch } from "../branch";
import { wikiSummary } from "wikipedia/dist/resultTypes";
import { ItemComponent } from '../item/item.component';
import { getColorByBranch } from '../../main';
import { blockOverflow, unblockOverflow } from '../../main';
import {RouterOutlet} from "@angular/router";

const transitionTime = 300;

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LinkComponent,
    ItemComponent,
    NgForOf,
    NgClass,
    NgIf,
    RouterOutlet
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
          `${transitionTime}ms ease-out`,
          style({ opacity: 1, transform: 'translateY(0px)' })
        )
      ]),
      transition('done => entering', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate(
          `${transitionTime}ms ease-out`,
          style({ opacity: 0, transform: 'translateY(30px)' }),
        )
      ]),
    ]),
    trigger('branchChange', [
      transition('entering => done', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          `${transitionTime}ms ease-out`,
          style({ opacity: 1, transform: 'translateX(0px)' })
        )
      ]),
      transition('done => entering', [
        style({ opacity: 1, transform: 'translateX(0px)' }),
        animate(
          `${transitionTime}ms ease-out`,
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

  getColorByBranch(branchIndex: number) {
    return getColorByBranch(branchIndex);
  }

  async ngOnInit() {
    let branches = await this.puller.prepareItems(this.date.getDate(), this.date.getMonth() + 1);
    this.branches = branches;
    await this.initialization();
  }

  async refresh(animate = true, indexBranchChecked: number = this.indexBranch) {
    if (this.refreshing) return;
    this.refreshing = true;
    blockOverflow();

    if (animate == false) this.branchChange = 'entering';
    else {
      this.dataState = 'entering';
      this.dataStateYear = 'entering';
    }

    setTimeout(() => {
      this.indexBranch = indexBranchChecked;
      this.selectedBranch = this.branches[this.indexBranch];
      let item = this.selectedBranch.get();
      this.concept = this.selectedBranch.concept;
      this.text = item.text.charAt(0).toUpperCase() + item.text.slice(1);
      this.references = item.pages;
      this.year = item.year;
      this.refreshing = false;
      unblockOverflow();
    }, transitionTime);
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
    await this.refresh();
  }

  async checkBranch(mod: number) {
    this.branchChange = 'entering';
    if (this.indexBranch+mod < 0) {
      return 2;
    } else if (this.indexBranch+mod > 2) {
      return 0;
    } else {
      return this.indexBranch+mod;
    }
  }

  async nextBranch() {
    let indexBranchChecked = await this.checkBranch(+1)
    await this.refresh(false, indexBranchChecked);
  }

  async prevBranch() {
    let indexBranchChecked = await this.checkBranch(-1)
    await this.refresh(false, indexBranchChecked);
  }

  formatDate() {
    return `0${(this.date.getDate())}`.slice(-2) + " de " + this.puller.getWritedMonth(this.date.getMonth()) + " de ";
  }

}
