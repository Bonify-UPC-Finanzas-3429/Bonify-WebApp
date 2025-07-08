import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private roleSubject = new BehaviorSubject<string>(this.getStoredRole());
  role$ = this.roleSubject.asObservable();

  private getStoredRole(): string {
    const storedRole = localStorage.getItem('userRole')?.toUpperCase();
    if (storedRole === 'USER') return 'user';
    if (storedRole === 'ADMIN') return 'admin';
    return '';
  }

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  getRole$() {
    return this.role$;
  }
}
