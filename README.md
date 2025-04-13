# ShapeUp - Proyecto de Aprendizaje Angular

  https://angular-firebase-hub.web.app
  https://angular-firebase-hub.firebaseapp.com
  https://ng-shape-up.web.app/

## Conceptos Fundamentales de Angular

A continuación, se detallan los conceptos clave de Angular abordados en este proyecto:

*   [Sistema de Routing y Navegación](#sistema-de-routing-y-navegación)
*   [Protección de Rutas (Guards)](#protección-de-rutas-con-guards)
*   [Servicios e Inyección de Dependencias](#servicios)
*   [Formularios Reactivos](#formularios-reactivos) (Incluye uso de Componentes)
*   [Gestión de Estado con RxJS (Observables)](#gestión-de-estado-con-rxjs)
*   [Interceptores HTTP](#interceptores-http)
*   [Autenticación y Gestión de Usuarios](#autenticación-y-gestión-de-usuarios)
*   [Integración con Firebase](#guía-rápida-de-firebase)
*   [Estructura del Proyecto](#estructura-del-proyecto)

### Sistema de Routing y Navegación

El sistema de rutas de Angular permite navegar entre diferentes componentes/vistas manteniendo la aplicación como SPA (Single Page Application). Este proyecto utiliza Lazy Loading para optimizar el rendimiento.

#### Comparación de Enfoques de Routing

##### 1. Routing Básico (Carga Directa - No Usado Actualmente)

```typescript
// Ejemplo conceptual de carga directa
import { Routes } from '@angular/router';
// ... importaciones directas de todos los componentes ...
import { authGuard } from './auth/guards/auth.guard';
import { permissionGuard } from './auth/guards/permission.guard';
import { UserRole } from './auth/models/user.model';

export const routes: Routes = [
  // ... Definiciones con 'component: ComponentName' ...
];
```

*   **Características**:
    *   Todos los componentes se importan directamente al inicio.
    *   El bundle inicial contiene todo el código.
    *   Carga inicial más lenta.
    *   Mayor consumo de memoria inicial.
    *   Adecuado para aplicaciones muy pequeñas.

##### 2. Routing con Lazy Loading (Implementación Actual)

```typescript
// app.routes.ts (Implementación actual)
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { permissionGuard } from './auth/guards/permission.guard';
import { UserRole } from './auth/models/user.model'; // Asegúrate que UserRole existe y es usado

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) // Ejemplo ruta pública
  },
  // Rutas de autenticación agrupadas con lazy loading
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/pages/register/register.component')
          .then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/pages/forgot-password/forgot-password.component')
          .then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth/pages/reset-password/reset-password.component')
          .then(m => m.ResetPasswordComponent)
      }
    ]
  },
  // Rutas protegidas con lazy loading y guards
  {
    path: '',
    canActivate: [authGuard], // Protección general de autenticación
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./features/user-management/user-management.component')
          .then(m => m.UserManagementComponent),
        // Protección adicional por permiso específico
        canActivate: [permissionGuard(['ADMINISTRACION_TOTAL'])]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component')
          .then(m => m.ProfileComponent),
        // Ejemplo protección por permiso
        canActivate: [permissionGuard(['INVITADO'])]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // Ruta para página no encontrada (Wildcard)
  {
    path: '**',
    redirectTo: 'dashboard' // O a una página 'NotFoundComponent'
  }
];
```

*   **Características**:
    *   Componentes importados dinámicamente (`loadComponent`).
    *   Cada ruta carga su componente sólo cuando se necesita.
    *   Carga inicial más rápida.
    *   Menor consumo de memoria inicial.
    *   Ideal para aplicaciones medianas y grandes.

#### Protección de Rutas con Guards

Los Guards son mecanismos para controlar el acceso a las rutas.

##### Funcionamiento (`canActivate`)

1.  **Momento de Ejecución**: Antes de cargar/activar la ruta solicitada.
2.  **Proceso**: Verifica condiciones (autenticación, roles, permisos).
3.  **Resultado**:
    *   `true`: Permite el acceso.
    *   `false`: Bloquea el acceso.
    *   `UrlTree`: Redirige a otra ruta (`router.navigate(...)`).
    *   Puede retornar `boolean`, `Promise<boolean>`, `Observable<boolean>`, `UrlTree`.
4.  **Encadenamiento**: `canActivate: [guard1, guard2]` (todos deben retornar `true`).
5.  **Protección en Cascada**: Al proteger una ruta padre, las hijas también quedan protegidas por ese guard.

##### Tipos de Guards Implementados

###### 1. `AuthGuard` (Autenticación)

```typescript
// auth/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  // Redirige al login si no está autenticado
  router.navigate(['/auth/login']);
  return false;
};
```
*   Verifica si el usuario tiene una sesión activa.

###### 2. `PermissionGuard` (Autorización por Permiso)

```typescript
// auth/guards/permission.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { map, catchError, of } from 'rxjs';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const roleService = inject(RoleService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser?.roles || currentUser.roles.length === 0) {
      router.navigate(['/dashboard'], { queryParams: { error: 'Acceso denegado: Sin roles asignados.' } });
      return false;
    }

    // Verifica si el usuario tiene AL MENOS UNO de los permisos requeridos
    return roleService.getUserPermissions(currentUser.roles).pipe(
      map(userPermissions => {
        const hasRequiredPermission = requiredPermissions.some(reqPerm =>
          userPermissions.some(userPerm => userPerm.id === reqPerm)
        );

        if (hasRequiredPermission) {
          return true;
        }

        // Si no tiene el permiso, redirigir al dashboard con mensaje
        router.navigate(['/dashboard'], { queryParams: { error: 'Acceso denegado: Permisos insuficientes.' } });
        return false;
      }),
      catchError(() => {
        // En caso de error obteniendo permisos, redirigir
        router.navigate(['/dashboard'], { queryParams: { error: 'Error al verificar permisos.' } });
        return of(false);
      })
    );
  };
};
```
*   Verifica si el usuario posee al menos uno de los permisos específicos necesarios para acceder a la ruta. Es el método preferido para control de acceso granular.

##### Sistema de Protección Multicapa

El proyecto combina estos guards para una seguridad robusta:

1.  **Nivel de Autenticación (`authGuard`)**: ¿Está el usuario logueado?
2.  **Nivel de Permisos (`permissionGuard`)**: ¿Tiene el usuario los permisos necesarios para esta acción/ruta específica?

*   **Uso Típico**:
    *   `canActivate: [authGuard]` para secciones que solo requieren login.
    *   `canActivate: [authGuard, permissionGuard(['PERMISO_X'])]` para secciones que requieren permisos específicos.

#### Configuración del Provider de Rutas

Las rutas y sus configuraciones se registran en `app.config.ts`:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Registra las rutas
    provideHttpClient( // Configura HttpClient
      withInterceptors([authInterceptor /*, otrosInterceptores */ ])
    )
    // Otros providers globales
  ]
};
```

### Servicios

Clases reutilizables para encapsular lógica de negocio, comunicación con API, gestión de estado, etc.

#### Implementación Básica

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Singleton disponible en toda la app
})
export class MiServicio {
  private dataSubject = new BehaviorSubject<string[]>([]);
  public data$ = this.dataSubject.asObservable(); // Observable público

  constructor() { }

  getData(): Observable<string[]> {
    // Lógica para obtener datos (ej. HTTP)
    // this.http.get(...).subscribe(datos => this.dataSubject.next(datos));
    return this.data$;
  }

  addData(item: string): void {
    const currentData = this.dataSubject.value;
    this.dataSubject.next([...currentData, item]);
  }
}
```

### Formularios Reactivos

Enfoque basado en modelos para manejar formularios, usando `FormGroup`, `FormControl`, `FormBuilder` y validadores.

#### Características Principales

*   Modelo de datos explícito (el `FormGroup`).
*   Inmutabilidad (cambios crean nuevas instancias).
*   Validación síncrona y asíncrona incorporada.
*   Más predecible y testeable que los formularios por plantilla.

#### Implementación Básica

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  // ... selector, templateUrl, styleUrls
})
export class MiFormularioComponent implements OnInit {
  miForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.miForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      // ... otros controles
    });
  }

  onSubmit(): void {
    if (this.miForm.invalid) {
      this.miForm.markAllAsTouched(); // Marca campos para mostrar errores
      return;
    }
    // Procesar datos válidos: this.miForm.value
    console.log('Formulario válido:', this.miForm.value);
  }

  // Helper para acceder a controles en la plantilla
  get nombreControl() { return this.miForm.get('nombre'); }
  get emailControl() { return this.miForm.get('email'); }
}
```

```html
<!-- En la plantilla HTML -->
<form [formGroup]="miForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="nombre">Nombre:</label>
    <input id="nombre" type="text" formControlName="nombre">
    <!-- Mensajes de error -->
    <div *ngIf="nombreControl?.invalid && (nombreControl?.dirty || nombreControl?.touched)">
      <small *ngIf="nombreControl?.errors?.['required']">El nombre es requerido.</small>
      <small *ngIf="nombreControl?.errors?.['minlength']">Mínimo 3 caracteres.</small>
    </div>
  </div>
  <!-- ... otros campos ... -->
  <button type="submit" [disabled]="miForm.invalid">Enviar</button>
</form>
```

### Gestión de Estado con RxJS

RxJS es clave en Angular para manejar flujos de datos asíncronos y estado reactivo.

#### `BehaviorSubject` para Estado Compartido

Ideal para mantener y emitir el estado actual (ej. usuario autenticado).

```typescript
// En AuthService
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model'; // Asegúrate de importar User

private currentUserSubject = new BehaviorSubject<User | null>(null);
// Observable público para que los componentes se suscriban
public currentUser$ = this.currentUserSubject.asObservable();
// Getter para acceso síncrono al valor actual (usar con precaución)
public get currentUserValue(): User | null {
  return this.currentUserSubject.value;
}

// Al hacer login
login(user: User): void {
  // ... lógica de login ...
  localStorage.setItem('currentUser', JSON.stringify(user)); // Persistencia
  this.currentUserSubject.next(user); // Emitir nuevo estado
}

// Al hacer logout
logout(): void {
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}

// Al iniciar la app (en el constructor del servicio)
constructor() {
  this.checkAuthStatus();
}

private checkAuthStatus(): void {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      this.currentUserSubject.next(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing stored user data:", e);
      localStorage.removeItem('currentUser'); // Limpiar si está corrupto
    }
  }
}
```

#### Operadores Comunes de RxJS

*   `map()`: Transformar cada valor emitido.
*   `tap()`: Ejecutar efectos secundarios (logs, guardar datos) sin modificar el flujo.
*   `switchMap()`: Mapear a un nuevo Observable, cancelando el anterior si llega un nuevo valor fuente (útil para peticiones anidadas o dependientes).
*   `catchError()`: Manejar errores en el flujo.
*   `filter()`: Emitir solo valores que cumplan una condición.
*   `debounceTime()`: Esperar un tiempo de inactividad antes de emitir (ej. en inputs de búsqueda).
*   `distinctUntilChanged()`: Emitir solo si el valor actual es diferente al anterior.
*   `take()`: Tomar un número específico de emisiones y completar.
*   `takeUntil()`: Completar cuando otro Observable emita (útil para desuscripciones).
*   `forkJoin()`: Ejecutar varios Observables en paralelo y emitir un array con los últimos valores de cada uno cuando todos completen.

### Interceptores HTTP

Middleware que intercepta peticiones (`HttpRequest`) y respuestas (`HttpResponse`) HTTP salientes y entrantes. Útil para tareas transversales como añadir tokens, manejar errores globales, logging, etc.

#### Implementación (`AuthInterceptor`)

```typescript
// auth/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de la ruta correcta

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Método para obtener el token guardado

  // Clonar la petición para modificarla (las peticiones son inmutables)
  let authReq = req;

  // Añadir el token solo si existe
  // La verificación de URL (ej. /api) es opcional, depende si TODAS las peticiones lo necesitan
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pasar la petición (original o clonada) al siguiente manejador
  return next(authReq);
  // Aquí se podrían añadir operadores pipe() para manejar respuestas o errores
  // ej. .pipe(catchError(...))
};
```

#### Registro del Interceptor

Se registran en `app.config.ts` usando `provideHttpClient` y `withInterceptors`.

```typescript
// app.config.ts (ya mostrado en la sección de Routing)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

// ...
providers: [
  // ... otros providers
  provideHttpClient(
    withInterceptors([authInterceptor /*, otrosInterceptores */ ])
  )
]
// ...
```

#### Flujo de Funcionamiento

1.  Componente/Servicio realiza una petición HTTP (`HttpClient.get(...)`).
2.  La petición es interceptada por `authInterceptor`.
3.  El interceptor obtiene el token del `AuthService`.
4.  Si hay token, clona la petición y añade el header `Authorization`.
5.  La petición (modificada o no) continúa hacia el backend.
6.  La respuesta del backend puede ser interceptada también (si se añade lógica `pipe()` en el interceptor).

### Autenticación y Gestión de Usuarios

#### Flujo de Autenticación

1.  **Login**:
    *   Usuario introduce credenciales en `LoginComponent`.
    *   Se llama a `AuthService.login(credentials)`.
    *   `AuthService` valida contra el backend (simulado o real).
    *   Si es exitoso, guarda el token/datos de usuario (localStorage) y actualiza `currentUserSubject`.
    *   Redirige al `DashboardComponent`.
2.  **Registro**:
    *   Usuario introduce datos en `RegisterComponent`.
    *   Se llama a `AuthService.register(userData)`.
    *   `AuthService` envía datos al backend.
    *   Si es exitoso, usualmente redirige al Login o directamente loguea al usuario.
3.  **Protección de Rutas**:
    *   Al navegar a una ruta protegida, los `Guards` (`authGuard`, `permissionGuard`) verifican el estado de `AuthService` (`isAuthenticated`, `currentUserValue`, y `roleService.getUserPermissions`).
4.  **Peticiones Autenticadas**:
    *   `AuthInterceptor` añade el token a las peticiones HTTP salientes.
5.  **Logout**:
    *   Usuario clickea en "Cerrar Sesión".
    *   Se llama a `AuthService.logout()`.
    *   `AuthService` limpia el estado (localStorage, `currentUserSubject`) y redirige al Login.

#### Recuperación de Contraseñas

Flujo típico (puede variar según implementación backend):

1.  **Solicitud (`ForgotPasswordComponent`)**:
    *   Usuario introduce su email/username.
    *   Llama a `AuthService.forgotPassword(email)`.
    *   Backend envía un email con un enlace/token de reseteo único y temporal.
2.  **Restablecimiento (`ResetPasswordComponent`)**:
    *   Usuario accede al enlace del email (que contiene el token).
    *   La ruta (`/reset-password?token=...`) carga el componente.
    *   Usuario introduce la nueva contraseña.
    *   Llama a `AuthService.resetPassword(token, newPassword)`.
    *   Backend valida el token y actualiza la contraseña.
    *   Redirige al Login.

#### Componentes Clave de Autenticación

*   `LoginComponent`: Formulario de inicio de sesión.
*   `RegisterComponent`: Formulario de registro.
*   `ForgotPasswordComponent`: Formulario para solicitar reseteo.
*   `ResetPasswordComponent`: Formulario para establecer nueva contraseña.
*   `AuthService`: Lógica centralizada de autenticación, estado y comunicación con backend.
*   `User`, `Role`, `Permission` (en `auth/models`): Modelos de datos.
*   `auth.guard.ts`: Guard de autenticación.
*   `permission.guard.ts`: Guard de permisos.
*   `auth.interceptor.ts`: Interceptor para añadir tokens.

### Estructura del Proyecto

Organización recomendada para mantenibilidad y escalabilidad.

```
ng-shape-up/
├── src/                         # Código fuente principal
│   ├── app/                    # Módulo raíz de la aplicación
│   │   ├── auth/              # Funcionalidad de Autenticación
│   │   │   ├── guards/        #   - Guards (auth, permission)
│   │   │   ├── interceptors/  #   - Interceptores HTTP (auth)
│   │   │   ├── models/        #   - Modelos/Interfaces (User, Role, Permission)
│   │   │   ├── pages/         #   - Componentes/Páginas (Login, Register, etc.)
│   │   │   └── services/      #   - Servicios (AuthService, RoleService, PermissionService)
│   │   │
│   │   ├── features/          # Módulos de Características Principales
│   │   │   ├── dashboard/     #   - Dashboard
│   │   │   └── user-management/  #   - Gestión de Usuarios
│   │   │   └── profile/       #   - Perfil de Usuario
│   │   │   └── (otras features...)
│   │   │
│   │   ├── pages/            # Páginas Genéricas/Públicas
│   │   │   └── about/        #   - Página "Acerca de"
│   │   │   └── not-found/    #   - Página "No Encontrado" (Opcional)
│   │   │
│   │   ├── core/             # (Opcional) Servicios Core, Singleton
│   │   │   └── services/     #   - Servicios base, logging, etc.
│   │   │   └── models/       #   - Modelos base
│   │   │
│   │   ├── shared/           # (Opcional) Componentes, Directivas, Pipes Compartidos
│   │   │   └── components/
│   │   │   └── pipes/
│   │   │   └── directives/
│   │   │   └── models/
│   │   │
│   │   ├── app.component.ts     # Componente Raíz (Shell)
│   │   ├── app.config.ts        # Configuración Principal (Providers)
│   │   └── app.routes.ts        # Definición de Rutas Principales
│   │
│   ├── assets/               # Recursos estáticos (imágenes, fuentes)
│   ├── environments/         # Ficheros de entorno (dev, prod)
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   │
│   ├── index.html            # Punto de entrada HTML
│   ├── main.ts               # Punto de entrada TypeScript (bootstrap)
│   └── styles.scss           # Estilos globales
│
├── angular.json             # Configuración del CLI de Angular
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración raíz de TypeScript
├── tsconfig.app.json       # Config TS específica de la app
├── tsconfig.spec.json      # Config TS para tests
└── README.md              # Este archivo :)
```

### Gestión de Usuarios, Roles y Permisos

Sistema de control de acceso basado en roles y permisos.

#### Configuración Base del Sistema (Hardcoded)

*   **Usuario Superadmin**: `superadmin`. Existe siempre, roles no modificables (`ADMINISTRADOR`, `INVITADO`).
*   **Permisos Base**:
    *   `INVITADO`: Acceso básico.
    *   `ADMINISTRACION_TOTAL`: Acceso administrativo completo.
*   **Roles Base**:
    *   `ADMINISTRADOR`: Asociado al permiso `ADMINISTRACION_TOTAL`.
    *   `INVITADO`: Asociado al permiso `INVITADO`.
*   **Reglas de Integridad**:
    *   Un usuario con rol `ADMINISTRADOR` *siempre* tiene también el rol `INVITADO`.

#### Lógica de Negocio Clave (`UserManagementComponent`)

*   **Carga Inicial**: Usa `forkJoin` para cargar roles y permisos en paralelo. Luego carga usuarios.
*   **Gestión de Roles de Usuario**:
    *   Permite asignar/desasignar roles a usuarios (excepto `superadmin`).
    *   Aplica la regla de integridad: si se asigna `ADMINISTRADOR`, se asegura que `INVITADO` también esté asignado.
    *   Llama a `AuthService.updateUserRoles`.
*   **Gestión de Permisos de Rol**:
    *   Permite asignar/desasignar permisos a roles personalizados.
    *   Roles `ADMINISTRADOR` e `INVITADO` tienen permisos fijos no modificables.
    *   Llama a `RoleService.updateRolePermissions` (o método similar).
*   **Creación de Usuarios/Roles/Permisos**: Formularios reactivos con validaciones.

### Experiencia de Usuario (UX)

Consideraciones implementadas para mejorar la interacción.

1.  **Control Granular de Estados de Carga**: Indicadores específicos (`loadingUsers`, `loadingRoles`, etc.) para evitar bloqueos totales de UI.
2.  **Validación de Formularios en Tiempo Real**: Feedback inmediato al usuario.
3.  **Feedback Informativo**: Mensajes claros de éxito/error.
4.  **Organización Visual**: Uso de pestañas (`UserManagementComponent`) para separar funcionalidades.
5.  **Renderizado Condicional**: Uso de `*ngIf` para mostrar/ocultar elementos dinámicamente.

### Diagramas de Flujo

*(Los diagramas ASCII se mantienen aquí para referencia visual)*

#### Diagrama de Autenticación y Autorización
```
┌─────────────────────────────────────────────┐
│            FLUJO DE AUTENTICACIÓN           │
└─────────────────────────────────────────────┘
(Diagrama ASCII como estaba)
```

#### Mapa de Navegación
```
┌─────────────────────────────────────┐
│          MAPA DE NAVEGACIÓN         │
└─────────────────────────────────────┘
(Diagrama ASCII como estaba, revisar si rutas son actuales)
```

#### Flujo de Datos (Simplificado)
```
┌─────────────────────────────────────┐
│           FLUJO DE DATOS            │
└─────────────────────────────────────┘
(Diagrama ASCII como estaba)
```

## Guía Rápida de Firebase

NOTA: El proyecto si esta integrado con Firebase y se despliega en Firebase
*(Esta sección solo aplica si el proyecto está integrado con Firebase. Si no, puede eliminarse)* 

### Ficheros Clave de Firebase

*   `src/environments/environment.*.ts`: Contienen `firebaseConfig`.
*   `src/app/app.config.ts`: Registro de providers (`provideFirebaseApp`, `provideAuth`, `provideFirestore`, etc.).
*   `firebase.json`: Configuración de Hosting, Firestore (reglas, índices), etc., para Firebase CLI.
*   `.firebaserc`: Mapeo de proyectos de Firebase.
*   `firestore.rules`, `storage.rules`: Reglas de seguridad.

### Configuración Inicial (Resumen)

1.  **Firebase Console**: Crear proyecto, registrar aplicación web (obtener `firebaseConfig`), activar servicios (Auth, Firestore, Storage).
2.  **Localmente**:
    *   `npm install firebase @angular/fire`
    *   `npm install -g firebase-tools` (CLI, una vez)
    *   `firebase login` (una vez)
    *   `firebase init` (Firestore, Hosting, Storage - por proyecto) -> Genera `firebase.json`, `.firebaserc`, `*.rules`.
3.  **Proyecto Angular**:
    *   Añadir `firebaseConfig` a `environments`.
    *   Configurar providers en `app.config.ts`.
    *   Ajustar `firebase.json` (directorio `public` a `dist/ng-shape-up/browser`, rewrites SPA).
    *   Configurar `angular.json` para usar los environments correctos.

### Despliegue a Firebase Hosting

*   **Manual**: `ng build` seguido de `firebase deploy --only hosting`.
*   **Automático**: Vía GitHub Actions (workflows `.github/workflows/firebase-*.yml`).
