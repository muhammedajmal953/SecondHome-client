import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { map } from "leaflet";
import { Router } from "@angular/router";

export function isEpiredToken(role:string,token: string): boolean {
  try {
    const authService = inject(AuthService)
    const router=inject(Router)

    let status:boolean=false

    authService.tokenValidate(role, token).subscribe({
      next: (res) => {
        if (res.success) {
          status=false
        }
      }, error: (err) => {
        if (err) {
          status=true
          localStorage.removeItem(role)
          localStorage.removeItem(`${role}Refresh`)
          router.navigate([`${role}/login`])
        }
      }
    })

    return status
  } catch (error) {
    console.error('Invalid token format:', error);
    return true;
  }
}
