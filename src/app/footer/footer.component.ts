import {AfterViewInit, Component} from '@angular/core';
import { VERSION } from '@angular/core';
import packageJson from '../../../package.json'


@Component({
  selector: 'footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  angularVersion = VERSION.full;
  projectVersion = packageJson.version;
}
