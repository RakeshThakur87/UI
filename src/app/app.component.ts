import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    positionClass: 'toast-top-right-half-width',
    showCloseButton: true,
    timeout: 8000
  });

  title = 'ObDesk App';
}
