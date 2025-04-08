# ShapeUp - Proyecto de Aprendizaje Angular

## Conceptos de Angular

### Routing y Navegación

El sistema de rutas de Angular permite navegar entre diferentes componentes/vistas manteniendo la aplicación como SPA (Single Page Application).

#### Configuración básica de rutas

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', component: PageNotFoundComponent }  // Ruta para 404
];
```

#### Lazy Loading (Carga Perezosa)

El lazy loading permite cargar módulos o componentes solo cuando se necesitan, mejorando el rendimiento inicial de la aplicación.

**Ventajas:**
- Reduce el tiempo de carga inicial
- Mejora el rendimiento en aplicaciones grandes
- Optimiza el uso de recursos

**Implementación en Angular:**

```typescript
export const routes: Routes = [
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent) 
  },
  // Otras rutas...
];
```

#### Rutas con Protección (Guards)

Los Guards permiten proteger rutas basándose en ciertas condiciones (como autenticación).

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard], // Protege la ruta
    component: AdminComponent
  }
];
```

### Estructura de Proyecto para Autenticación

Para implementar un sistema de autenticación, se recomienda la siguiente estructura:

```
src/
  app/
    auth/
      pages/
        login/
        register/
      services/
      guards/
      models/
```

#### Componentes clave para autenticación

1. **Login Component**: Maneja la autenticación de usuarios existentes
2. **Register Component**: Permite a nuevos usuarios crear una cuenta
3. **Auth Service**: Servicio centralizado para gestionar operaciones de autenticación
4. **Auth Guard**: Protege rutas que requieren autenticación
5. **User Model**: Define la estructura de datos para usuarios
6. **Token Interceptor**: Intercepta solicitudes HTTP para agregar tokens de autenticación

### Implementación de Lazy Loading con Autenticación

Para combinar lazy loading con rutas protegidas:

```typescript
export const routes: Routes = [
  // Rutas públicas
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
      }
    ]
  },
  
  // Rutas protegidas con lazy loading
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      // Otras rutas protegidas...
    ]
  }
];
```

### Servicios en Angular

Los servicios son clases con un propósito específico que pueden ser reutilizados en toda la aplicación. Se utilizan para:

- Compartir datos entre componentes
- Encapsular lógica de negocio
- Comunicarse con APIs externas
- Mantener el estado de la aplicación

#### Implementación básica de un servicio

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class DataService {
  private data: any[] = [];

  constructor() { }

  getData(): any[] {
    return this.data;
  }

  addData(item: any): void {
    this.data.push(item);
  }
}
```

### Autenticación y Manejo de Sesiones

La autenticación es un aspecto crítico en aplicaciones web modernas. Angular facilita su implementación mediante:

#### 1. Servicios de Autenticación

Un servicio centralizado que gestiona:
- Login/logout
- Registro
- Almacenamiento de tokens
- Verificación del estado de autenticación

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  login(credentials: LoginRequest): Observable<User> {
    // Lógica de autenticación
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
```

#### 2. Persistencia de Sesión

Para mantener al usuario autenticado entre recargas de página, se suele usar:
- `localStorage`: Almacenamiento persistente
- `sessionStorage`: Almacenamiento temporal (durante la sesión)

```typescript
// Guardar datos de sesión
private setSession(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Recuperar datos al iniciar la aplicación
private checkAuthStatus(): void {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    this.currentUserSubject.next(JSON.parse(storedUser));
  }
}
```

#### 3. Guards para Protección de Rutas

Los guards previenen el acceso no autorizado a rutas protegidas:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permite acceso a la ruta
  }

  router.navigate(['/auth/login']); // Redirige al login
  return false; // Bloquea acceso a la ruta
};
```

### Formularios Reactivos

Los formularios reactivos ofrecen un enfoque basado en modelos para manejar entradas de formularios:

#### Características principales:

- Construidos alrededor de observables
- Control de formulario inmutable
- Validación síncrona y asíncrona
- Testabilidad mejorada

#### Implementación básica:

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    // Procesar datos del formulario
    console.log(this.loginForm.value);
  }
}
```

#### Validaciones comunes:

```typescript
Validators.required         // Campo obligatorio
Validators.minLength(6)     // Longitud mínima
Validators.maxLength(50)    // Longitud máxima
Validators.email            // Formato de email válido
Validators.pattern(regex)   // Patrón personalizado
```

### Gestión de Estado con RxJS

RxJS es fundamental en Angular para manejar flujos de datos asincrónicos y gestionar el estado:

#### BehaviorSubject para Estado

- `BehaviorSubject` es una variante de `Subject` que:
- Mantiene el valor actual
- Emite el valor más reciente a los nuevos suscriptores
- Requiere un valor inicial

```typescript
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// Actualizar el estado
login(user: User): void {
  this.currentUserSubject.next(user);
}

// Acceder al valor actual sin suscripción
get currentUser(): User | null {
  return this.currentUserSubject.value;
}
```

#### Operadores comunes de RxJS:

```typescript
// Transformar datos
map(user => user.name)

// Manejar errores
catchError(error => {
  console.error('Error:', error);
  return throwError(() => error);
})

// Efectos secundarios sin modificar datos
tap(data => console.log('Datos recibidos:', data))

// Simular latencia de red (útil para demos)
delay(800)
```

### Interceptores HTTP

Los interceptores HTTP permiten interceptar y modificar las solicitudes y respuestas HTTP en una aplicación Angular.

#### Usos comunes:

- Añadir tokens de autenticación a las solicitudes
- Manejo centralizado de errores
- Logging y depuración
- Transformación de datos
- Caché de respuestas

#### Implementación de un interceptor de autenticación:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Si hay un token, lo añadimos al header Authorization
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
  }
  
  // Si no hay token, continuamos sin modificar
  return next(req);
};
```

#### Registro de interceptores:

En Angular 17, los interceptores se registran en el `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Otros providers...
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Recuperación de Contraseñas

La funcionalidad de recuperación de contraseñas es esencial en sistemas de autenticación. Consiste en dos flujos principales:

#### 1. Solicitud de recuperación:

- Usuario ingresa su correo electrónico
- Sistema valida el correo y envía un enlace especial con token único
- El token tiene tiempo de expiración por seguridad

#### 2. Restablecimiento de contraseña:

- Usuario accede al enlace especial con el token
- Sistema valida el token (existencia y expiración)
- Usuario ingresa nueva contraseña
- Sistema actualiza la contraseña y redirige al login

#### Implementación del flujo:

```typescript
// Modelos
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

// Métodos en AuthService
forgotPassword(request: ForgotPasswordRequest): Observable<void> {
  // Enviar email con token de recuperación
}

resetPassword(request: ResetPasswordRequest): Observable<void> {
  // Validar token y actualizar contraseña
}
```

#### Componentes necesarios:

1. **ForgotPasswordComponent**: Formulario para solicitar recuperación
2. **ResetPasswordComponent**: Formulario para establecer nueva contraseña
3. **Enlaces en LoginComponent**: Permitir acceso al flujo de recuperación

#### Consideraciones de seguridad:

- Tokens de un solo uso
- Tiempo de expiración corto (15-30 minutos)
- No revelar si el correo existe o no en respuestas
- Limitar intentos de recuperación por IP/usuario
- Notificar al usuario cuando su contraseña cambia


### Diagrama de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          FLUJOS DE AUTENTICACIÓN                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌────────────────┐
│             │     │             │     │                │
│    Login    │────▶│  AuthService│────▶│    Dashboard   │
│             │     │             │     │                │
└─────────────┘     └─────────────┘     └────────────────┘
       ▲                   ▲                    ▲
       │                   │                    │
       │                   │                    │
┌─────────────┐            │                    │
│             │            │                    │
│   Register  │────────────┘                    │
│             │                                 │
└─────────────┘                                 │
                                                │
┌─────────────┐     ┌─────────────┐            │
│             │     │             │            │
│   Forgot    │────▶│    Reset    │────────────┘
│  Password   │     │  Password   │
│             │     │             │
└─────────────┘     └─────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         INTERCEPTOR DE TOKENS                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────┐     ┌─────────────┐     ┌────────────┐
│            │     │             │     │            │
│  Petición  │────▶│ Interceptor │────▶│  Petición  │────▶ API
│  HTTP      │     │    Auth     │     │ + Token    │
│            │     │             │     │            │
└────────────┘     └─────────────┘     └────────────┘
                         │
                         │
                         ▼
                   ┌──────────────┐
                   │              │
                   │ AuthService  │
                   │  (getToken)  │
                   │              │
                   └──────────────┘
```

### Mapa de Navegación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          MAPA DE NAVEGACIÓN                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐          ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  RUTAS PÚBLICAS (/auth/*)                           RUTAS PROTEGIDAS
│                                         │          │                     │
  ┌─────────┐     ┌──────────┐
│ │  Login  │◀───▶│ Register │            │          │  ┌───────────┐      │
  └────┬────┘     └──────────┘                          │ Dashboard │
│      │                                  │          │  └─────┬─────┘      │
       │        ┌────────────────┐                           │
│      └───────▶│ Forgot Password│         │          │      │             │
                └────────┬───────┘                           ▼
│                        │                │          │  ┌───────────┐      │
                         ▼                              │  Cycles   │
│               ┌─────────────────┐       │          │  └───────────┘      │
                │  Reset Password │
│               └─────────────────┘       │          │  ┌───────────┐      │
                                                        │  Pitches  │
│                                         │          │  └───────────┘      │
  
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘          └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Flujo de datos en la autenticación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     FLUJO DE DATOS EN AUTENTICACIÓN                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │  (1)    │             │  (4)    │             │
│  Formulario │────────▶│ AuthService │────────▶│ LocalStorage│
│  de Login   │         │             │         │             │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │ (2)
                               ▼
                        ┌─────────────┐
                        │             │
                        │ API Backend │
                        │ (simulada)  │
                        └──────┬──────┘
                               │ (3)
                               ▼
                        ┌─────────────┐
                        │  Token JWT  │
                        │   + User    │
                        └─────────────┘

Flujo:
(1) Usuario envía credenciales
(2) AuthService intenta autenticar al usuario
(3) Backend responde con token y datos de usuario
(4) AuthService almacena el token en localStorage
```

Estos diagramas nos ayudan a visualizar:

1. **Estructura del proyecto**: Organización de carpetas y archivos
2. **Flujo de autenticación**: Cómo se conectan los componentes
3. **Interceptor de tokens**: Cómo se procesan las peticiones HTTP
4. **Mapa de navegación**: Estructura de rutas públicas vs protegidas
5. **Flujo de datos**: Cómo fluye la información durante la autenticación


