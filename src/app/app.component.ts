import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import {FooterComponent} from "./footer/footer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HttpClientModule,
    FontAwesomeModule,
    HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'A day like today';
}
