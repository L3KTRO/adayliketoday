import { Component, Inject, Input } from '@angular/core';
import { NgForOf } from "@angular/common";
import { LinkComponent } from '../link/link.component';
import { wikiSummary } from "wikipedia/dist/resultTypes";

@Component({
  selector: 'history-item',
  standalone: true,
  imports: [
    LinkComponent,
    NgForOf
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  animations: []
})
export class ItemComponent {
  @Input("text") text!: string;
  @Input('references') references!: Array<wikiSummary>;
}
