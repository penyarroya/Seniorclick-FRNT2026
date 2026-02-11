import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../../shared/toolbar/toolbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  imports: [
    ToolbarComponent,
    FooterComponent,
    RouterOutlet
  ]
})
export class AuthLayoutComponent { }