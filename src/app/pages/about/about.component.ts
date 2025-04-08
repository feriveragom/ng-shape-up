import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <h1>Sobre Shape Up</h1>
      
      <section class="intro-section">
        <p class="lead">
          Shape Up es una metodología innovadora de desarrollo de productos, creada por Basecamp, que revoluciona
          la forma en que los equipos planifican, diseñan y construyen software. A diferencia de las metodologías
          ágiles tradicionales, Shape Up utiliza ciclos de trabajo de 6 semanas, eliminando los sprints 
          continuos y el backlog infinito.
        </p>
      </section>
      
      <section class="core-concept">
        <h2>Los tres pilares de Shape Up</h2>
        <div class="pillars">
          <div class="pillar">
            <h3>1. Shaping (Dar forma)</h3>
            <p>
              Antes de que comience cualquier trabajo, las ideas se "moldean" hasta convertirse en propuestas 
              concretas. Este proceso lo realizan personas experimentadas que comprenden tanto las necesidades 
              del negocio como las complejidades técnicas.
            </p>
            <p>
              Una propuesta bien formada:
            </p>
            <ul>
              <li>Define claramente el problema a resolver</li>
              <li>Establece los límites del trabajo (lo que está dentro y fuera del alcance)</li>
              <li>Identifica los riesgos y propone soluciones a alto nivel</li>
              <li>Evita especificaciones detalladas que limiten la creatividad del equipo</li>
            </ul>
          </div>
          
          <div class="pillar">
            <h3>2. Betting (Apostar)</h3>
            <p>
              En lugar de mantener un backlog infinito de tareas, en Shape Up las propuestas compiten entre sí 
              en una "reunión de apuestas" que se realiza cada 6 semanas. Los stakeholders deciden en qué propuestas
              "apostar" para el próximo ciclo, basándose en su valor estratégico.
            </p>
            <p>
              Características clave:
            </p>
            <ul>
              <li>No hay backlog permanente - las propuestas no seleccionadas pueden volver a presentarse 
                  o simplemente desaparecer</li>
              <li>Las decisiones son deliberadas y comprometidas - cuando se apuesta por un pitch, 
                  se asignan recursos dedicados</li>
              <li>El proceso es ligero y ágil, evitando la burocracia de estimaciones detalladas</li>
            </ul>
          </div>
          
          <div class="pillar">
            <h3>3. Building (Construir)</h3>
            <p>
              Los equipos pequeños (normalmente de 1 diseñador y 1-2 programadores) tienen autonomía 
              total para ejecutar las propuestas seleccionadas durante el ciclo de 6 semanas.
            </p>
            <p>
              Principios clave de esta fase:
            </p>
            <ul>
              <li><strong>No hay microgestión</strong> - los equipos deciden cómo resolver los problemas</li>
              <li><strong>Alcance variable</strong> - ajustan la implementación para cumplir con el plazo fijo</li>
              <li><strong>Integración temprana</strong> - trabajan en funcionalidades completas desde el principio</li>
              <li><strong>Hill Chart</strong> - utilizan una visualización de "subir la colina" para mostrar progreso</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section>
        <h2>El ciclo de trabajo completo</h2>
        <div class="cycle-info">
          <div class="cycle-part">
            <h3>Ciclos de 6 semanas</h3>
            <p>
              Los ciclos de 6 semanas proporcionan suficiente tiempo para completar proyectos significativos.
              Esta duración:
            </p>
            <ul>
              <li>Es lo suficientemente larga para permitir un trabajo sustancial</li>
              <li>Es lo suficientemente corta para mantener la urgencia y el enfoque</li>
              <li>Permite entregar valor real a los usuarios en cada ciclo</li>
            </ul>
          </div>
          
          <div class="cycle-part">
            <h3>Periodo de enfriamiento (Cooldown)</h3>
            <p>
              Después de cada ciclo de 6 semanas, hay un periodo de "enfriamiento" de 2 semanas donde los equipos:
            </p>
            <ul>
              <li>Resuelven bugs y problemas técnicos pendientes</li>
              <li>Exploran ideas para futuros ciclos</li>
              <li>Reflexionan sobre el trabajo completado</li>
              <li>Recargan energías antes del siguiente ciclo</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section>
        <h2>Beneficios de Shape Up</h2>
        <div class="benefits">
          <ul>
            <li><strong>Menor estrés y mayor calidad</strong> - Los ciclos largos permiten trabajo reflexivo</li>
            <li><strong>Autonomía y creatividad</strong> - Los equipos determinan cómo resolver los problemas</li>
            <li><strong>Compromiso real con las fechas</strong> - El alcance se ajusta para cumplir con plazos fijos</li>
            <li><strong>Eliminación del multitasking</strong> - Enfoque total en una sola propuesta por ciclo</li>
            <li><strong>Menos reuniones</strong> - No hay planificación diaria/semanal ni actualizaciones constantes</li>
            <li><strong>Priorización estratégica explícita</strong> - Las apuestas son decisiones deliberadas</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2>Diferencias con Scrum y otras metodologías ágiles</h2>
        <div class="comparison">
          <table>
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Scrum</th>
                <th>Shape Up</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Duración de iteraciones</td>
                <td>Sprints de 1-4 semanas</td>
                <td>Ciclos de 6 semanas</td>
              </tr>
              <tr>
                <td>Backlog</td>
                <td>Permanente y priorizado constantemente</td>
                <td>No existe backlog formal, solo propuestas para el ciclo actual</td>
              </tr>
              <tr>
                <td>Gestión de tareas</td>
                <td>Historias de usuario detalladas y estimadas</td>
                <td>Propuestas a alto nivel, sin estimaciones detalladas</td>
              </tr>
              <tr>
                <td>Planificación</td>
                <td>Planificación detallada al inicio de cada sprint</td>
                <td>El equipo decide cómo organizar su trabajo durante el ciclo</td>
              </tr>
              <tr>
                <td>Roles</td>
                <td>Scrum Master, Product Owner, Equipo de desarrollo</td>
                <td>Shaper, Stakeholders, Builders (diseñador y programadores)</td>
              </tr>
              <tr>
                <td>Métricas de progreso</td>
                <td>Velocidad, burndown charts</td>
                <td>Hill charts (visualización de progreso en forma de colina)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section>
        <h2>Sobre esta aplicación</h2>
        <p>
          Esta herramienta te ayuda a implementar Shape Up en tu organización:
        </p>
        <ul>
          <li>Gestiona ciclos de trabajo de 6 semanas</li>
          <li>Facilita la creación y presentación de propuestas (pitches)</li>
          <li>Permite visualizar el progreso de los equipos</li>
          <li>Proporciona un lugar central para documentar decisiones y resultados</li>
        </ul>
      </section>
      
      <section class="resources">
        <h2>Recursos adicionales</h2>
        <p>Para profundizar en la metodología, recomendamos:</p>
        <ul>
          <li><a href="https://basecamp.com/shapeup" target="_blank">Libro oficial de Shape Up (gratuito)</a></li>
          <li><a href="https://www.youtube.com/watch?v=AqoA86rJl9g" target="_blank">Presentación por Ryan Singer (creador de Shape Up)</a></li>
          <li><a href="https://basecamp.com/hill-charts" target="_blank">Explicación detallada de los Hill Charts</a></li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
      
      h1 {
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 2.5rem;
      }
      
      h2 {
        margin-top: 2.5rem;
        margin-bottom: 1.25rem;
        color: #444;
        font-size: 1.8rem;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 0.5rem;
      }
      
      h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: #555;
        font-size: 1.4rem;
      }
      
      p, li {
        line-height: 1.7;
        color: #555;
        margin-bottom: 1rem;
      }
      
      ul {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
        
        li {
          margin-bottom: 0.5rem;
          position: relative;
        }
      }
      
      section {
        margin-bottom: 3rem;
      }
      
      .lead {
        font-size: 1.2rem;
        color: #444;
        line-height: 1.8;
        margin-bottom: 2rem;
      }
      
      .pillars {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 1.5rem;
        
        .pillar {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          
          h3 {
            color: #7048e8;
            margin-top: 0;
          }
        }
      }
      
      .cycle-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        
        .cycle-part {
          background-color: #f5f5f5;
          padding: 1.5rem;
          border-radius: 8px;
        }
      }
      
      .comparison {
        overflow-x: auto;
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          
          th, td {
            padding: 0.75rem 1rem;
            border: 1px solid #ddd;
            text-align: left;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        }
      }
      
      .resources {
        background-color: #f0f7ff;
        padding: 1.5rem;
        border-radius: 8px;
        
        a {
          color: #7048e8;
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      @media (max-width: 768px) {
        padding: 1.5rem;
        
        .pillars, .cycle-info {
          grid-template-columns: 1fr;
        }
      }
    }
  `]
})
export class AboutComponent {} 