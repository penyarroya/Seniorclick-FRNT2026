import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

// Material
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { UserProfileService } from '../../../services/universilabs/userprofiles/user-profile.service';
import { UserProfileDTO } from '../../../models/universilabas/userprofiles/userprofile.model';

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

  /**
   * Carga los datos del perfil desde el servicio.
   * Maneja estados de carga, éxito y error 500.
   */
  private loadMyProfile() {
    this.loading = true;
    this.errorMessage = null;

    this.profileService.getMe().subscribe({
      next: (profile: UserProfileDTO) => {
        this.profileData = profile;
        this.loading = false;
        this.cdr.detectChanges(); // Asegura la actualización de la vista tras la respuesta
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.profileData = null;
        this.errorMessage = 'No se pudo encontrar tu perfil de usuario.';
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
  // Intentamos usar nombre completo, si no el username (si existe), si no 'U'
  const nameLabel = this.profileData?.firstName 
    ? `${this.profileData.firstName}+${this.profileData.lastName}`
    : (this.profileData as any)?.username || 'User'; 
  
  event.target.src = `https://ui-avatars.com/api/?name=${nameLabel}&background=008c96&color=fff&size=128`;
}
}