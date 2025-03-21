import {Component} from '@angular/core';
import {HomeComponent} from "./home/home.component";
import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'A day like today';
}
