import { Component, Inject, Input } from '@angular/core';
import { NgClass, NgForOf } from "@angular/common";
import { LinkComponent } from '../link/link.component';
import { wikiSummary } from "wikipedia/dist/resultTypes";
import { getColorByBranch } from '../../main';

@Component({
  selector: 'history-item',
  imports: [
    LinkComponent,
    NgForOf,
    NgClass
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  standalone: true,
  animations: []
})
export class ItemComponent {
  @Input("text") text!: string;
  @Input('references') references!: Array<wikiSummary>;
  @Input("indexBranch") indexBranch!: number;

  getColorByBranch(branchIndex: number) {
    return getColorByBranch(branchIndex);
  }
}
