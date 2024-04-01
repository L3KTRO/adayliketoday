import {Component, Input} from '@angular/core';
import {wikiSummary} from "wikipedia/dist/resultTypes";

@Component({
  selector: 'reference-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() link!: wikiSummary;
}
