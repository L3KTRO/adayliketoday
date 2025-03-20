import { Component, Input } from '@angular/core';
import { wikiSummary } from "wikipedia/dist/resultTypes";
import { getColorByBranch } from '../../main';
import { NgClass } from '@angular/common';

@Component({
  selector: 'reference-link',
  imports: [
    NgClass
  ],
  templateUrl: './link.component.html',
  standalone: true,
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() link!: wikiSummary;
  @Input() indexBranch!: number;

  getColorByBranch(branchIndex: number) {
    return getColorByBranch(branchIndex);
  }
}
