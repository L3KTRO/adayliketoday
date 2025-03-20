import {Component, Input} from '@angular/core';
import {LinkComponent} from "../link/link.component";
import {NgForOf} from "@angular/common";
import {wikiSummary} from "wikipedia/dist/resultTypes";

@Component({
    selector: 'app-context',
    imports: [
        LinkComponent,
        NgForOf
    ],
    templateUrl: './context.component.html',
    styleUrl: './context.component.scss'
})
export class ContextComponent {
    @Input() text!: string;
    @Input() references!: wikiSummary[];
}
