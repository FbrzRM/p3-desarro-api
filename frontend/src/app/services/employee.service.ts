import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  ApiResponse,
  Employee,
  EmployeeInput,
} from '../models/employee.model';

/**
 * [Reto 3] Programación reactiva + estado inmutable.
 *
 * Este servicio es el ÚNICO lugar que conoce HttpClient. Los componentes nunca
 * consumen la API directamente: se suscriben a los observables expuestos aquí
 * (mediante el pipe `async`, sin `.subscribe()` manual).
 *
 * El estado vive en BehaviorSubjects PRIVADOS y se expone como Observables de
 * solo lectura. Toda mutación de la lista se hace de forma INMUTABLE con el
 * operador spread.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}/empleados`;

  // --- Estado privado (fuente de la verdad) ---
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // --- Streams públicos de solo lectura ---
  readonly employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
  readonly error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /** Acceso interno a la instantánea actual de la lista (para mutar inmutable). */
  private get snapshot(): Employee[] {
    return this.employeesSubject.getValue();
  }

  /** Carga la lista completa desde el backend y actualiza el estado. */
  loadEmployees(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get<ApiResponse<Employee[]>>(this.baseUrl)
      .pipe(
        map((res) => this.sortByNewest(res.data ?? [])),
        tap((employees) => this.employeesSubject.next(employees)),
        catchError((err) => this.handleError(err)),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe();
  }

  /** Crea un empleado y lo agrega de forma inmutable al estado. */
  createEmployee(input: EmployeeInput): Observable<Employee> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<ApiResponse<Employee>>(this.baseUrl, input).pipe(
      map((res) => res.data as Employee),
      tap((created) => {
        // Mutación inmutable: el más reciente se agrega al inicio.
        this.employeesSubject.next([created, ...this.snapshot]);
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  /** Actualiza un empleado y reemplaza el elemento de forma inmutable. */
  updateEmployee(id: string, input: EmployeeInput): Observable<Employee> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .put<ApiResponse<Employee>>(`${this.baseUrl}/${id}`, input)
      .pipe(
        map((res) => res.data as Employee),
        tap((updated) => {
          const next = this.snapshot.map((e) =>
            e.id === id ? updated : e,
          );
          this.employeesSubject.next(next);
        }),
        catchError((err) => this.handleError(err)),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  /** Elimina un empleado y lo remueve de forma inmutable (filter). */
  deleteEmployee(id: string): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        this.employeesSubject.next(this.snapshot.filter((e) => e.id !== id));
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  /** Ordena la lista dejando primero los creados más recientemente. */
  private sortByNewest(employees: Employee[]): Employee[] {
    return [...employees].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }

  /** Normaliza errores HTTP en un mensaje legible y lo publica en error$. */
  private handleError(err: unknown): Observable<never> {
    const body = (err as { error?: ApiResponse<unknown> })?.error;
    let message = 'Ocurrió un error inesperado.';

    if (body?.errors && body.errors.length > 0) {
      message = body.errors
        .map((e) => (e.campo ? `${e.campo}: ${e.mensaje}` : e.mensaje))
        .join(' · ');
    } else if (body?.message) {
      message = body.message;
    }

    this.errorSubject.next(message);
    return throwError(() => new Error(message));
  }
}
