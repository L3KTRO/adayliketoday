import {Component, computed, inject, OnDestroy, OnInit, resource, ResourceStatus, signal} from '@angular/core';
import {PullerService} from "../puller.service";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {NgClass, NgIf} from "@angular/common";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {wikiSummary} from "wikipedia/dist/resultTypes";
import {ItemComponent} from '../item/item.component';
import {blockOverflow, getColorByBranch, unblockOverflow} from '../../main';
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import {FooterComponent} from "../footer/footer.component";

const transitionTime = 300;

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  selector: 'app-home',
  imports: [
    ItemComponent,
    NgClass,
    NgIf,
    ProgressBarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)', opacity: 0}), // Inicio fuera de la vista
        animate('500ms ease-out', style({transform: 'translateY(0)', opacity: 1})) // Transición hacia dentro
      ]),
      transition(':leave', [
        animate('500ms 400ms ease-in', style({transform: 'translateY(100%)', opacity: 0})) // Transición hacia fuera
      ])
    ]),
    trigger('listStagger', [
      transition('* <=> *', [
        query('*', [
          style({opacity: 0, transform: 'translateY(-35px)'}),
          stagger('100ms', animate('250ms 1s ease-out', style({opacity: 1, transform: 'translateY(0px)'})))
        ])
      ])
    ]),
    trigger('dataChange', [
      transition('entering => done', [
        style({opacity: 0, transform: 'translateY(-30px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 1, transform: 'translateY(0px)'}))
      ]),
      transition('leaving => done', [
        style({opacity: 0, transform: 'translateY(30px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 1, transform: 'translateY(0px)'}))
      ]),
      transition('done => entering', [
        style({opacity: 1, transform: 'translateY(0px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 0, transform: 'translateY(30px)'}))
      ]),
      transition('done => leaving', [
        style({opacity: 1, transform: 'translateY(0px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 0, transform: 'translateY(-30px)'}))
      ]),
    ]),
    trigger('branchChange', [
      transition('entering => done', [
        style({opacity: 0, transform: 'translateX(-30px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 1, transform: 'translateX(0px)'}))
      ]),
      transition('leaving => done', [
        style({opacity: 0, transform: 'translateX(30px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 1, transform: 'translateX(0px)'}))
      ]),
      transition('done => entering', [
        style({opacity: 1, transform: 'translateX(0px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 0, transform: 'translateX(30px)'}))
      ]),
      transition('done => leaving', [
        style({opacity: 1, transform: 'translateX(0px)'}),
        animate(`${transitionTime}ms ease-out`, style({opacity: 0, transform: 'translateX(-30px)'}))
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  client_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  dataState = 'done';
  dataStateYear = 'done';
  branchChange = 'done';
  block = false;
  puller = inject(PullerService)
  date = dayjs().tz(this.client_timezone).toDate();
  indexBranch = signal(0);
  selectedBranch = computed(() => {
    const _branches = this.branches.value()
    return _branches ? _branches[this.indexBranch()] : null
  });
  references = computed(() => this.selectedBranch() ? this.selectedBranch()!.get().pages : Array<wikiSummary>());
  year = computed(() => this.selectedBranch()?.get().year);
  colorBranch = computed(() => getColorByBranch(this.indexBranch()))
  text = computed(() => this.selectedBranch() ? (this.selectedBranch()!.get().text[0].toUpperCase() + this.selectedBranch()!.get().text.slice(1)) : "");

  branches = resource({
    request: () => ({date: this.date}),
    loader: async ({request}) =>
      await this.puller.prepareItems(request.date.getDate(), request.date.getMonth() + 1)
  })

  ngOnInit() {
    window.addEventListener('keydown', this.onKeydown.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.onKeydown.bind(this));
  }

  transition() {
    blockOverflow();
    this.block = true;
    unblockOverflow();
  }

  next() {
    if (this.block) return;
    this.transition();
    this.dataStateYear = 'leaving';
    this.dataState = 'leaving'
    setTimeout(() => {
      this.selectedBranch()?.next();
      this.block = false;
    }, transitionTime);
  }

  prev() {
    if (this.block) return;
    this.transition();
    this.dataStateYear = 'entering';
    this.dataState = 'entering'
    setTimeout(() => {
      this.selectedBranch()?.prev();
      this.block = false;
    }, transitionTime);
  }

  nextBranch() {
    if (this.block) return;
    this.transition();
    this.branchChange = 'entering';
    setTimeout(() => {
      this.checkBranch(+1)
      this.block = false;
    }, transitionTime);
  }

  prevBranch() {
    if (this.block) return;
    this.transition();
    this.branchChange = 'leaving';
    setTimeout(() => {
      this.checkBranch(-1)
      this.block = false;
    }, transitionTime);
  }

  checkBranch(mod: number) {
    const supossedBranch = this.indexBranch() + mod;
    if (supossedBranch < 0) {
      return this.indexBranch.set(2);
    } else if (supossedBranch > 2) {
      return this.indexBranch.set(0);
    } else {
      return this.indexBranch.set(supossedBranch);
    }
  }

  formatDate() {
    return `0${(this.date.getDate())}`.slice(-2) + " de " + this.puller.getWritedMonth(this.date.getMonth());
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.next();
        break;
      case 'ArrowDown':
        this.prev();
        break;
      case 'ArrowLeft':
        this.prevBranch();
        break;
      case 'ArrowRight':
        this.nextBranch();
        break;
      default:
        return;
    }
  }

  protected readonly ResourceStatus = ResourceStatus;
}
