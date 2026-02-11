import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordComplexity {
  
  // Validador estático
  static validator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value ?? '';

    if (!value) return null; // Deja que Validators.required maneje vacío

    // Regex para mayúsculas, minúsculas, números y caracteres especiales
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{8,}$/;

    const valid = regex.test(value);

    return valid ? null : { passwordComplexity: true };
  };
}