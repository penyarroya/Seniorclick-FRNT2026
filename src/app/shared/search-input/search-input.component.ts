import { Component, Output, EventEmitter, input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- INDISPENSABLE para ngModel
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Para el botón de la X
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,         // Necesario para [(ngModel)]
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule,
    MatButtonModule      // Necesario para mat-icon-button
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnDestroy {
  // Inputs usando la API de signals
  label = input<string>('Buscar');
  placeholder = input<string>('Ej: Madrid...');
  debounceMs = input<number>(300);
  
  query: string = ''; // Variable normal para el binding

  @Output() search = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private sub: Subscription;

  constructor() {
    this.sub = this.searchSubject.pipe(
      debounceTime(this.debounceMs()), // Acceso correcto a la signal
      distinctUntilChanged()
    ).subscribe(value => this.search.emit(value));
  }

  // Se llama en cada pulsación de tecla
  onInputChange() {
    this.searchSubject.next(this.query);
  }

  clearSearch() {
    this.query = '';
    this.searchSubject.next(''); // Pasamos por el subject para limpiar
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}