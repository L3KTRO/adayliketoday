import {Component, Input} from '@angular/core';

@Component({
  selector: 'reference-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {
  @Input() url!: string;
  @Input() description!: string;
}
