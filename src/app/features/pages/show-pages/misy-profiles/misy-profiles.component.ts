import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';

// Material
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { UserProfileService } from '../../../services/universilabs/userprofiles/user-profile.service';
import { UserProfileDTO } from '../../../models/universilabas/userprofiles/userprofile.model';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-misy-profiles',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './misy-profiles.component.html',
  styleUrl: './misy-profiles.component.scss',
})
export class MisyProfilesComponent implements OnInit {
//  
  private authService = inject(AuthService);
  private profileService = inject(UserProfileService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Estado del componente
  profileData: UserProfileDTO | null = null;
  loading = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadMyProfile();
  }


// ... dentro de tu clase MisyProfilesComponent

  sessionUser: any = null;

  private loadMyProfile() {
    this.loading = true;

    this.authService.currentUser$.pipe(
      // Solo procedemos si el usuario no es null
      filter(user => user !== null),
      // switchMap cancela la petición anterior si llega un nuevo usuario
      switchMap(user => {
        this.sessionUser = user;
        console.log('Usuario detectado, cargando datos de:', user.username);
        return this.profileService.getMe();
      })
    ).subscribe({
      next: (profile) => {
        console.log('Perfil cargado con éxito:', profile);
        this.profileData = profile;
        this.loading = false;
        this.errorMessage = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMessage = "No se pudo cargar la información del perfil.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Manejo de sesión no encontrada
    this.authService.isInitialized$.pipe(take(1)).subscribe(isInit => {
      if (isInit && !this.authService.currentUserValue) {
        this.errorMessage = "No se ha encontrado ninguna sesión activa.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private fetchProfileData() {
    this.profileService.getMe().subscribe({
      next: (profile) => {
        this.profileData = profile;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = "Error al cargar el perfil.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
    /**
     * Cierra el perfil y redirige siempre a la pantalla de inicio
     */
    goBack() {
      this.router.navigate(['/inicio']);
    }

  /**
   * Genera un avatar con iniciales si la imagen original falla.
   * Ajustado para que el fondo combine con el estilo claro (background=008c96).
   */
  // handleImageError(event: any) {
  //   const name = this.profileData 
  //     ? `${this.profileData.firstName}+${this.profileData.lastName}` 
  //     : 'User';
    
  //   // Cambiamos el color de fondo de la API de avatars para que sea más acorde al modo claro
  //   event.target.src = `https://ui-avatars.com/api/?name=${name}&background=008c96&color=fff&size=128`;
  // }

  handleImageError(event: any) {
    const name = this.profileData?.firstName ? 
                `${this.profileData.firstName}+${this.profileData.lastName}` : 
                'Usuario';
                
    event.target.src = `https://ui-avatars.com/api/?name=${name}&background=008c96&color=fff`;
  }
}