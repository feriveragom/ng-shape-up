# ShapeUp - Proyecto de Aprendizaje Angular

  https://angular-firebase-hub.web.app
  https://angular-firebase-hub.firebaseapp.com

## Conceptos de Angular

### Sistema de Routing en Angular

El sistema de rutas de Angular permite navegar entre diferentes componentes/vistas manteniendo la aplicación como SPA (Single Page Application).
Aquí veremos las dos formas de implementar el routing usando exactamente las mismas rutas de nuestro proyecto:

#### 1. Routing Básico (Carga Directa)

```typescript
import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/pages/reset-password/reset-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Ruta pública por defecto
  {
    path: '',
    component: AboutComponent
  },

  // Rutas de autenticación agrupadas
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      }
    ]
  },

  // Rutas protegidas
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'user-management',
        component: UserManagementComponent
      }
    ]
  },

  // Ruta para página no encontrada
  {
    path: '**',
    redirectTo: ''
  }
];
```

Características del Routing Básico:
- Todos los componentes se importan directamente al inicio
- El bundle inicial contiene TODO el código de la aplicación
- La aplicación carga más lento inicialmente
- Mayor consumo de memoria inicial
- Mejor para aplicaciones pequeñas

#### 2. Routing con Lazy Loading (Implementación Actual)

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Ruta pública por defecto
  {
    path: '',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },

  // Rutas de autenticación agrupadas
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
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
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent)
      }
    ]
  },

  // Ruta para página no encontrada
  {
    path: '**',
    redirectTo: ''
  }
];
```

Características del Lazy Loading:
- Los componentes se importan usando dynamic imports
- Cada ruta carga su componente solo cuando se necesita
- La aplicación inicial carga más rápido
- Menor consumo de memoria inicial
- Mejor para aplicaciones medianas y grandes
- Ideal cuando hay secciones que el usuario podría no visitar nunca

Principales Diferencias:
1. **Importaciones**:
   - Básico: `import { ComponentName } from './path'`
   - Lazy: `loadComponent: () => import('./path')`

2. **Declaración de rutas**:
   - Básico: `component: ComponentName`
   - Lazy: `loadComponent: () => import(...).then(m => m.ComponentName)`

3. **Tamaño del bundle inicial**:
   - Básico: Incluye todo el código
   - Lazy: Solo incluye lo necesario para la ruta inicial

4. **Rendimiento**:
   - Básico: Carga más lenta inicial, navegación más rápida después
   - Lazy: Carga inicial rápida, pequeña latencia al navegar por primera vez a cada ruta

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

Esta sección muestra cómo se integran el lazy loading y la autenticación para crear un sistema de rutas seguro y eficiente:

```typescript
export const routes: Routes = [
  // Rutas públicas con lazy loading
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
      }
    ]
  }
];
```

Esta implementación combina:
1. Lazy loading para optimización de rendimiento
2. Guards para protección de rutas
3. Agrupación lógica de rutas por funcionalidad
4. Separación clara entre rutas públicas y privadas

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

Los guards previenen el acceso no autorizado a rutas protegidas. En Angular, `canActivate` actúa como un sistema de seguridad que se ejecuta antes de que un usuario pueda acceder a una ruta protegida.

##### Implementación del Guard
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

##### Uso en las Rutas
```typescript
{
    path: '',
    canActivate: [authGuard],  // <- Protección de rutas
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
      },
      {
        path: 'user-management',
        loadComponent: () => import('./features/user-management/user-management.component')
      }
    ]
}
```

##### Funcionamiento del canActivate

1. **Momento de Ejecución**: 
   - Se ejecuta ANTES de cargar la ruta solicitada
   - Actúa como un middleware de autorización

2. **Proceso de Verificación**:
   - Verifica si el usuario está autenticado usando AuthService
   - Si está autenticado: permite acceso (retorna true)
   - Si no está autenticado: redirige a login (retorna false)

3. **Características Importantes**:
   - Puede recibir múltiples guards en el array: `canActivate: [authGuard, roleGuard]`
   - Todos los guards deben retornar true para permitir acceso
   - Puede retornar:
     - boolean: true/false
     - Promise<boolean>
     - Observable<boolean>
     - UrlTree (para redirección)

4. **Protección en Cascada**:
   - Al proteger una ruta padre, todas sus rutas hijas quedan protegidas
   - En nuestro caso, tanto dashboard como user-management requieren autenticación

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

### Interceptores HTTP en Angular

Los interceptores son una característica poderosa de Angular que permite interceptar y modificar las solicitudes y respuestas HTTP en toda la aplicación. Actúan como una capa intermedia entre tu aplicación y el servidor.

#### 1. Implementación de Nuestro AuthInterceptor

En nuestro proyecto, tenemos implementado un interceptor de autenticación que maneja automáticamente la adición del token JWT a las peticiones:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Si hay un token y la petición es a nuestra API
  if (token && req.url.includes('/api')) {
    // Clonamos la petición y añadimos el header de autorización
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
  }
  
  // Si no hay token o es una petición externa, la dejamos pasar sin modificar
  return next(req);
};
```

Características importantes de nuestro interceptor:
1. **Inyección moderna**: Usa `inject()` en lugar del constructor
2. **Verificación selectiva**: Solo modifica peticiones a nuestra API
3. **Inmutabilidad**: Clona la petición en lugar de modificarla directamente
4. **Transparencia**: Deja pasar peticiones sin token o externas sin modificar

#### 2. Registro del Interceptor

A partir de Angular 17, los interceptores se registran en el archivo `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

#### 3. Funcionamiento del Interceptor

1. **Flujo de una Petición HTTP**:
   ```
   Aplicación → Interceptor → API
   [Request sin token] → [Request + Token] → [API]
   ```

2. **Proceso Detallado**:
   - La aplicación hace una petición HTTP (por ejemplo, GET /api/users)
   - El interceptor captura la petición
   - Verifica si hay un token disponible
   - Si la URL incluye '/api', añade el token
   - La petición modificada llega al servidor

3. **Ejemplo Práctico**:
   ```typescript
   // Petición original en un servicio
   this.http.get('/api/users');

   // Lo que realmente llega al servidor después del interceptor
   GET /api/users
   Headers:
   Authorization: Bearer eyJhbGciOiJ...token...
   ```

#### 4. Casos de Uso en Nuestra Aplicación

1. **Rutas Protegidas**:
   - /api/dashboard
   - /api/user-management
   - /api/cycles

2. **Rutas Públicas** (no modificadas por el interceptor):
   - /auth/login
   - /auth/register
   - URLs externas

#### 5. Ventajas de Nuestra Implementación

1. **Centralización**:
   - Un solo lugar para gestionar tokens
   - Consistencia en todas las peticiones
   - Fácil mantenimiento

2. **Seguridad**:
   - Validación de URLs
   - No expone el token en peticiones externas
   - Manejo transparente de autenticación

3. **Flexibilidad**:
   - Fácil de extender para nuevos headers
   - Permite filtrar por URL
   - Compatible con diferentes tipos de tokens

#### 6. Patrones de Uso

```typescript
// En cualquier servicio de la aplicación:
export class UserService {
  constructor(private http: HttpClient) {}

  // El interceptor manejará automáticamente la autenticación
  getUsers() {
    return this.http.get('/api/users');
  }

  // Las peticiones externas no serán modificadas
  getExternalData() {
    return this.http.get('https://api.externa.com/data');
  }
}
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

### Diagramas de la Aplicación

#### 1. Diagrama de Autenticación y Autorización
```
┌─────────────────────────────────────────────┐
│            FLUJO DE AUTENTICACIÓN           │
└─────────────────────────────────────────────┘

1. Inicio de Sesión
   Usuario ──> Login Component
                    │
                    ▼
   [Credenciales] ──> AuthService ──> HTTP Interceptor ──> API
                           │
                           ▼
                     LocalStorage ────> BehaviorSubject<User>
                                            │
                                            ▼
                                    Actualizar UI/Estado

2. Acceso a Rutas Protegidas
   Usuario ──> Ruta Protegida
                    │
                    ▼
              AuthGuard ───┐
                          │
         ┌───────────────┘
         │
         ▼
   ¿Token válido? ──> No ──> Redirect a Login
         │
         ▼
        Sí
         │
         ▼
   Cargar Componente
         │
         ▼
   HTTP Interceptor
   añade token
         │
         ▼
   Petición a API
```

#### 2. Mapa de Navegación
```
┌─────────────────────────────────────┐
│          MAPA DE NAVEGACIÓN         │
└─────────────────────────────────────┘

RUTAS PÚBLICAS                RUTAS PROTEGIDAS
─────────────                 ────────────────
/                            /dashboard
│                            ├── Panel Principal
└── /auth                    ├── Estadísticas
    ├── /login              └── Notificaciones
    ├── /register           
    ├── /forgot-password    /user-management
    └── /reset-password     └── Gestión de Usuarios

                            /cycles
                            ├── Lista de Ciclos
                            └── Detalles de Ciclo
```

#### 3. Flujo de Datos
```
┌─────────────────────────────────────┐
│           FLUJO DE DATOS            │
└─────────────────────────────────────┘

1. Autenticación
   ┌──────────┐    ┌──────────┐    ┌────────┐
   │Component │───>│AuthService│───>│  API   │
   └──────────┘    └──────────┘    └────────┘
                        │              │
                        ▼              ▼
                   ┌──────────┐    ┌────────┘
                   │ Storage  │<───┤ Token  │
                   └──────────┘    └────────┘

2. Interceptor
   ┌──────────┐    ┌──────────┐    ┌────────┘
   │Petición  │───>│Interceptor│───>│Petición│
   │Original  │    │   Auth   │    │+ Token │
   └──────────┘    └──────────┘    └────────┘
                        │
                        ▼
                   ┌──────────┘
                   │  Token   │
                   │Storage   │
                   └──────────┘
```

### Estructura del Proyecto

```
ng-shape-up/
├── src/                         # Código fuente principal
│   ├── app/                    # Módulo principal de la aplicación
│   │   ├── auth/              # Módulo de autenticación
│   │   │   ├── guards/        # Guards de autenticación y roles
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/  # Interceptores HTTP
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/        # Modelos de datos
│   │   │   │   └── user.model.ts
│   │   │   ├── pages/         # Componentes de autenticación
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── reset-password/
│   │   │   └── services/      # Servicios de autenticación
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── features/          # Características principales
│   │   │   ├── dashboard/     # Panel de control
│   │   │   └── user-management/  # Gestión de usuarios
│   │   │
│   │   ├── pages/            # Páginas públicas
│   │   │   └── about/        # Página Acerca de
│   │   │
│   │   ├── services/         # Servicios globales
│   │   │   ├── cycle.model.ts
│   │   │   └── cycle.service.ts
│   │   │
│   │   ├── app.component.ts     # Componente raíz
│   │   ├── app.config.ts        # Configuración de la app
│   │   └── app.routes.ts        # Configuración de rutas
│   │
│   ├── index.html            # Punto de entrada HTML
│   ├── main.ts              # Punto de entrada TypeScript
│   └── styles.scss         # Estilos globales
│
├── angular.json             # Configuración de Angular
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración de TypeScript
├── tsconfig.app.json       # Config TypeScript para la app
├── tsconfig.spec.json      # Config TypeScript para tests
└── vercel.json            # Configuración de despliegue Vercel
```

Esta estructura sigue las mejores prácticas de Angular, organizando el código en módulos lógicos:

- **auth/**: Contiene toda la lógica de autenticación y autorización
- **features/**: Módulos funcionales principales de la aplicación
- **pages/**: Páginas públicas y componentes compartidos
- **services/**: Servicios globales de la aplicación

La estructura está diseñada para:
- Mantener una clara separación de responsabilidades
- Facilitar la escalabilidad del proyecto
- Mejorar la mantenibilidad del código
- Permitir la carga perezosa (lazy loading) de módulos

### Observables y Servicios en Angular

#### 1. Observables en Angular

Los Observables son una parte fundamental de Angular que permiten manejar flujos de datos asincrónicos. En nuestro proyecto los usamos extensivamente:

##### Tipos de Observables más comunes:

1. **Observable simple**
```typescript
// Creación
const simple$ = new Observable<string>(observer => {
  observer.next('dato');
  observer.complete();
});

// Uso
simple$.subscribe({
  next: (dato) => console.log(dato),
  error: (error) => console.error(error),
  complete: () => console.log('completado')
});
```

2. **BehaviorSubject**
```typescript
// Como lo usamos en nuestro AuthService
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// Emitir nuevo valor
this.currentUserSubject.next(user);

// Obtener valor actual sin suscripción
const usuario = this.currentUserSubject.value;
```

3. **of y from**
```typescript
// of: para valores simples
const datos$ = of(1, 2, 3);

// from: para arrays o promesas
const array$ = from([1, 2, 3]);
```

##### Operadores RxJS más utilizados en nuestro proyecto:

1. **tap**: Para efectos secundarios
```typescript
login(credentials: LoginRequest): Observable<User> {
  return this.validateUser(credentials).pipe(
    tap(user => {
      // Efecto secundario: guardar en localStorage
      this.setSession(user);
      // Efecto secundario: actualizar estado
      this.currentUserSubject.next(user);
    })
  );
}
```

2. **map**: Para transformar datos
```typescript
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    map(users => users.map(user => ({
      ...user,
      fullName: `${user.name} (${user.email})`
    })))
  );
}
```

3. **catchError**: Para manejar errores
```typescript
register(userData: RegisterRequest): Observable<User> {
  return this.http.post<User>('/api/register', userData).pipe(
    catchError(error => {
      console.error('Error en registro:', error);
      return throwError(() => new Error('Error al registrarse'));
    })
  );
}
```

4. **delay**: Para simular latencia (útil en desarrollo)
```typescript
getAllCycles(): Observable<Cycle[]> {
  return of(this.cycles).pipe(
    delay(800) // Simula latencia de red
  );
}
```

##### Patrones de Uso de Observables en Nuestro Proyecto:

1. **Estado Global** (como en AuthService):
```typescript
// Definición en el servicio
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// Uso en componentes
export class AppComponent implements OnInit {
  isAuthenticated = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
}
```

2. **Datos en Tiempo Real** (como en CycleService):
```typescript
// Observable para el ciclo actual
private currentCycleSubject = new BehaviorSubject<Cycle | null>(null);
currentCycle$ = this.currentCycleSubject.asObservable();

// Actualización y notificación automática
updateCycle(cycle: Cycle): void {
  this.currentCycleSubject.next(cycle);
}
```

#### 2. Servicios y Observables

Los servicios en Angular son el lugar perfecto para manejar observables, especialmente cuando:

1. **Gestionamos Estado**:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: LoginRequest): Observable<User> {
    return this.validateUser(credentials).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}
```

2. **Comunicación HTTP**:
```typescript
@Injectable({ providedIn: 'root' })
export class CycleService {
  getAllCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>('/api/cycles').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la operación:', error);
    return throwError(() => new Error('Error en la operación'));
  }
}
```

3. **Caché de Datos**:
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private cache = new BehaviorSubject<any>(null);

  getData(): Observable<any> {
    if (this.cache.value) {
      return of(this.cache.value);
    }
    
    return this.http.get('/api/data').pipe(
      tap(data => this.cache.next(data))
    );
  }
}
```

#### 3. Mejores Prácticas con Observables

1. **Nomenclatura**:
   - Sufijo $ para variables que son observables
   - Nombres descriptivos que indiquen el tipo de datos

2. **Manejo de Memoria**:
   - Usar takeUntil para desuscribirse en ngOnDestroy
   - Preferir async pipe en templates cuando sea posible
   - Limpiar suscripciones manuales

3. **Estructura de Servicios**:
   - Subjects/BehaviorSubjects privados
   - Observables públicos
   - Métodos claros para actualizar estado

4. **Manejo de Errores**:
   - Centralizar manejo de errores
   - Transformar errores a formatos amigables
   - Logging consistente

5. **Testing**:
   - Usar marbles para testing de observables
   - Simular delays y errores
   - Verificar efectos secundarios



# Guía de Firebase para Angular

## Ficheros relacionados con Firebase en ng-<project-name>

### 1. Ficheros de Configuración Base
- `src/environments/environment.development.ts` - Configuración Firebase desarrollo
- `src/environments/environment.ts` - Configuración Firebase producción
- `src/app/app.config.ts` - Providers de Firebase para Angular

### 2. Ficheros de Firebase
- `firebase.json` - Configuración principal de Firebase
- `.firebaserc` - Configuración del proyecto Firebase
- `firestore.rules` - Reglas de seguridad para Firestore
- `firestore.indexes.json` - Índices de Firestore
- `storage.rules` - Reglas de seguridad para Storage
- `.firebase/` - Directorio con caché y logs (ignorado en git)

### 3. Ficheros de GitHub Actions
- `.github/workflows/firebase-hosting-merge.yml` - Despliegue automático en merge
- `.github/workflows/firebase-hosting-pull-request.yml` - Preview en Pull Requests

### 4. Ficheros de Angular
- `angular.json` - Configuración de environments y build
- `package.json` - Dependencias Firebase (@angular/fire y firebase)

### 5. Ficheros Opcionales (si se usan esas características)
- `src/app/services/auth.service.ts` - Servicio de autenticación
- `src/app/services/firestore.service.ts` - Servicio para Firestore
- `src/app/services/storage.service.ts` - Servicio para Storage

## Configuración del proyecto en Firebase Console

### URLs de Referencia
```bash
  Firebase Console: https://console.firebase.google.com
  Proyecto ejemplo:
    https://angular-firebase-hub.web.app
    https://angular-firebase-hub.firebaseapp.com
```

### Pasos de Configuración Firebase
  I. Crear Proyecto en Firebase Console (una sola vez)
    1- Ir a Firebase Console
    2- Clic en "Añadir proyecto"
    3- Nombre del proyecto: angular-firebase-hub
    4- Configurar Google Analytics (opcional)
    5- Crear proyecto

  II. Registrar Aplicación Web
    1- En la consola del proyecto, clic en icono web </>
    2- Nombre de la app: ng-shape-up
    3- Registrar app
    4- Guardar configuración mostrada.
```bash  
      const firebaseConfig = {
        apiKey: "xxx",
        authDomain: "proyecto.firebaseapp.com",
        projectId: "proyecto",
        storageBucket: "proyecto.appspot.com",
        messagingSenderId: "xxx",
        appId: "xxx"
      };
```

## Pasos de Configuración Local- Configurar Hosting
    1- Instalar Firebase CLI (si no está instalado):
```bash 
      # Instalar Firebase CLI globalmente una sola vez
      npm install -g firebase-tools
```
    2- Iniciar sesión:
```bash
      # Iniciar sesión en Firebase (cuenta Google) una sola vez
      firebase login
```
    3- Inicializar proyecto: 
```bash
      # Configura Firebase para cada proyecto nuevo.
      firebase init
      # Seleccionar opciones:
      # ✓ Firestore: Configure security rules and indexes files for Firestore
      # ✓ Hosting: Configure files for Firebase Hosting
      # ✓ Storage: Configure a security rules file for Cloud Storage
      # ✓ Use an existing project
      # ✓ Select: tu-proyecto
      # ✓ What do you want to use as your public directory? dist/nombre-proyecto/browser
      # ✓ Configure as a single-page app? Yes
```

## Activación y Configuración de Servicios Firebase

### 1. Activar Authentication
1. En Firebase Console -> Authentication -> Get Started
2. Habilitar métodos de autenticación:
   - Email/Password -> Enable
   - Google (opcional) -> Enable
   - Otros providers según necesidad

### 2. Activar Firestore
1. En Firebase Console -> Firestore Database -> Create Database
2. Seleccionar modo: 
   - "Start in test mode" (desarrollo)
   - "Start in production mode" (producción)
3. Seleccionar región: "eur3 (europe-west)" recomendado para Europa

### 3. Activar Storage (opcional)
1. En Firebase Console -> Storage -> Get Started
2. Seleccionar región (misma que Firestore)
3. Iniciar con reglas de prueba

### 4. Configurar Reglas de Seguridad

Después de `firebase init`, modificar las reglas generadas:

#### Rules: 
  firestore.rules  
  storage.rules

## Configuración en el Proyecto Angular
```bash
    # Instalar dependencias
    npm install firebase @angular/fire
```

**environment.development.ts y environment.ts**:
```typescript
    export const environment = {
      production: false, // true en environment.ts
      firebase: {
        apiKey: "xxx",
        authDomain: "mi-proyecto.firebaseapp.com",
        projectId: "mi-proyecto",
        storageBucket: "mi-proyecto.appspot.com",
        messagingSenderId: "xxx",
        appId: "xxx"
      }
    };
```

**app.config.ts**:
```typescript
    import { ApplicationConfig } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { provideHttpClient } from '@angular/common/http';
    import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
    import { getFirestore, provideFirestore } from '@angular/fire/firestore';
    import { getAuth, provideAuth } from '@angular/fire/auth';
    import { environment } from '../environments/environment';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth())
      ]
    };
```

**Actualizar .gitignore**
```bash
    #Firebase
    .firebase/.cache
```

**firebase.json**
```typescript
    {
      "firestore": {
        "rules": "firestore.rules",
        "indexes": "firestore.indexes.json"
      },
      "hosting": {
        "public": "dist/ng-shape-up/browser",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      },
      "storage": {
        "rules": "storage.rules"
      }
    }
```

**angular.json** fileReplacements x2
    - src/environments/environment.ts (producción)
    - src/environments/environment.development.ts (desarrollo)

## Despliegue

  ### 1- Despliegue Manual (si es necesario)
```bash
    # Limpiar caché de Angular
    rm -rf .angular/cache

    # Construir la aplicación
    ng build

    # Desplegar a Firebase
    firebase deploy --only hosting

    # Listar canales de hosting. Verificacion
    firebase hosting:channel:list

    # Ver URLs disponibles
    firebase hosting:sites list
```
  ### 2- Despliegue automático
    .github\workflows\firebase-hosting-merge.yml
    .github\workflows\firebase-hosting-pull-request.yml
