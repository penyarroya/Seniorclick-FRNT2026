// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-footer',
//   imports: [],
//   templateUrl: './footer.component.html',
//   styleUrl: './footer.component.scss',
// })
// export class FooterComponent {

// }

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  // Año actual
  currentYear = signal(new Date().getFullYear());

  // Nombre de la empresa
  companyName = signal('JLRNSisoft Peñarroya-Pueblonuevo');
}
