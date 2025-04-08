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
      
      <!-- Sección de FAQ incorporada -->
      <section class="faq">
        <h2>Preguntas Frecuentes</h2>
        
        <div class="search-box">
          <input type="text" placeholder="Buscar preguntas..." disabled />
          <small><em>(Funcionalidad en desarrollo)</em></small>
        </div>
        
        <div class="faq-section">
          <h3>Conceptos Básicos</h3>
          
          <div class="faq-item">
            <h4>¿Qué es Shape Up y quién lo creó?</h4>
            <div class="faq-answer">
              <p>
                Shape Up es una metodología de desarrollo de productos creada por <strong>Ryan Singer</strong> en Basecamp,
                una empresa pionera en trabajo remoto y herramientas de colaboración. La metodología fue publicada abiertamente 
                en 2019 y desde entonces ha ganado popularidad en empresas que buscan alternativas a los métodos ágiles tradicionales.
              </p>
              <p>
                El enfoque se diseñó específicamente para resolver problemas que Basecamp experimentó con metodologías tradicionales:
                ciclos de feedback demasiado cortos, falta de autonomía en los equipos y dificultad para entregar funcionalidades 
                completas y significativas.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Para qué tipo de empresas o proyectos es adecuado Shape Up?</h4>
            <div class="faq-answer">
              <p>
                Shape Up funciona mejor en:
              </p>
              <ul>
                <li><strong>Equipos de producto que desarrollan software</strong> (startups, empresas de SaaS, equipos digitales)</li>
                <li><strong>Organizaciones con cierta madurez</strong> donde ya entienden su mercado y usuarios</li>
                <li><strong>Equipos que valoran la autonomía</strong> y confían en la experiencia de sus miembros</li>
                <li><strong>Proyectos donde la calidad y la estrategia</strong> son tan importantes como la velocidad</li>
              </ul>
              <p>
                Puede ser menos adecuado para:
              </p>
              <ul>
                <li>Entornos altamente regulados con requisitos inflexibles</li>
                <li>Equipos muy grandes o distribuidos sin experiencia en autoorganización</li>
                <li>Proyectos con plazos externos rígidos que no se alinean con los ciclos de 6 semanas</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="faq-section">
          <h3>Ciclos de Trabajo</h3>
          
          <div class="faq-item">
            <h4>¿Por qué los ciclos duran exactamente 6 semanas?</h4>
            <div class="faq-answer">
              <p>
                La duración de 6 semanas se eligió cuidadosamente por varias razones:
              </p>
              <ul>
                <li>Es suficientemente larga para completar un proyecto significativo con todas sus partes (diseño, desarrollo, pruebas)</li>
                <li>Es suficientemente corta para mantener la presión y urgencia necesarias</li>
                <li>Permite 6-8 ciclos de entrega por año, lo que facilita la planificación anual</li>
                <li>Reduce la ansiedad en comparación con sprints cortos donde siempre hay una nueva planificación</li>
              </ul>
              <p>
                Basecamp experimentó con ciclos más cortos (2-4 semanas) y los encontró insuficientes para entregar 
                funcionalidades completas sin acumular deuda técnica.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Qué ocurre si el trabajo no se completa en 6 semanas?</h4>
            <div class="faq-answer">
              <p>
                Una regla fundamental en Shape Up es que <strong>el plazo es fijo pero el alcance es variable</strong>. 
                Esto significa que:
              </p>
              <ul>
                <li>Los equipos deben ajustar la implementación para cumplir con el plazo de 6 semanas</li>
                <li>Se espera que reduzcan alcance inteligentemente, priorizando la esencia de la solución</li>
                <li>No se extienden los plazos, ya que esto desestabilizaría todo el proceso de apuestas</li>
              </ul>
              <p>
                Si realmente no se puede completar, el trabajo no se arrastra automáticamente al siguiente ciclo. 
                Para continuar, debe competir nuevamente con otras propuestas en la próxima reunión de apuestas, 
                lo que fomenta decisiones deliberadas sobre qué es realmente importante.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Qué sucede durante el período de enfriamiento (cooldown)?</h4>
            <div class="faq-answer">
              <p>
                El período de enfriamiento de 2 semanas entre ciclos es crucial para:
              </p>
              <ul>
                <li><strong>Limpieza técnica:</strong> Resolver bugs encontrados, optimizar rendimiento, etc.</li>
                <li><strong>Reflexión:</strong> Analizar qué funcionó y qué no en el ciclo anterior</li>
                <li><strong>Exploración:</strong> Investigar ideas para futuras propuestas</li>
                <li><strong>Prevenir el agotamiento:</strong> Evitar que los equipos trabajen a alta presión constantemente</li>
                <li><strong>Preparación:</strong> Los stakeholders tienen tiempo para moldear propuestas para el próximo ciclo</li>
              </ul>
              <p>
                Este periodo evita que la deuda técnica se acumule y permite un equilibrio saludable entre entrega y sostenibilidad.
              </p>
            </div>
          </div>
        </div>
        
        <div class="faq-section">
          <h3>Propuestas (Pitches)</h3>
          
          <div class="faq-item">
            <h4>¿Qué debe contener una buena propuesta (pitch)?</h4>
            <div class="faq-answer">
              <p>
                Una propuesta efectiva en Shape Up contiene:
              </p>
              <ol>
                  <li><strong>Problema:</strong> Descripción clara del problema a resolver y por qué importa</li>
                  <li><strong>Apetito:</strong> Cuánto tiempo vale la pena invertir (2 o 6 semanas generalmente)</li>
                  <li><strong>Solución:</strong> Bocetos, diagramas o descripciones de la solución propuesta</li>
                  <li><strong>Límites:</strong> Clarificación explícita de lo que está fuera del alcance</li>
                  <li><strong>Riesgos:</strong> Identificación de aspectos técnicos o de diseño desafiantes</li>
              </ol>
              <p>
                Las propuestas son breves (1-3 páginas) y están redactadas en lenguaje sencillo accesible tanto 
                para personas técnicas como no técnicas. No incluyen listas detalladas de tareas ni historias de usuario.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Quién puede crear propuestas?</h4>
            <div class="faq-answer">
              <p>
                Idealmente, las propuestas son creadas por personas con:
              </p>
              <ul>
                  <li>Experiencia en el producto y comprensión de las necesidades de los usuarios</li>
                  <li>Suficiente conocimiento técnico para entender las complejidades y limitaciones</li>
                  <li>Visión estratégica para priorizar lo importante</li>
              </ul>
              <p>
                En Basecamp, esto suele ser trabajo de líderes de producto o fundadores. En otras organizaciones,
                pueden ser product managers, diseñadores senior o cualquier persona con la experiencia adecuada.
              </p>
              <p>
                Aunque cualquiera puede sugerir ideas, convertirlas en propuestas bien formadas requiere un proceso
                cuidadoso de "moldeado" (shaping), que es una habilidad específica que se desarrolla con el tiempo.
              </p>
            </div>
          </div>
        </div>
        
        <div class="faq-section">
          <h3>Equipos y Roles</h3>
          
          <div class="faq-item">
            <h4>¿Cuál es el tamaño ideal de equipo para trabajar con Shape Up?</h4>
            <div class="faq-answer">
              <p>
                Shape Up recomienda equipos pequeños, normalmente formados por:
              </p>
              <ul>
                  <li>1 diseñador</li>
                  <li>1-2 programadores</li>
              </ul>
              <p>
                Estos equipos reducidos (de 2-3 personas) maximizan la comunicación directa y minimizan la sobrecarga 
de coordinación. Basecamp ha descubierto que añadir más personas suele ralentizar el trabajo en lugar 
de acelerarlo, debido a la mayor necesidad de sincronización.
              </p>
              <p>
                Para proyectos más grandes, es preferible tener múltiples equipos pequeños trabajando en diferentes 
                propuestas, en lugar de un equipo grande trabajando en la misma propuesta.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Cómo se gestionan las dependencias entre equipos?</h4>
            <div class="faq-answer">
              <p>
                Shape Up aborda las dependencias entre equipos de varias formas:
              </p>
              <ul>
                  <li><strong>Durante el moldeado:</strong> Se identifican dependencias potenciales y se resuelven antes de proponer el trabajo</li>
                  <li><strong>Equipos integrales:</strong> Cada equipo tiene todas las habilidades necesarias para completar su trabajo</li>
                  <li><strong>"Interfaces no negociables":</strong> Se definen claramente los puntos de integración entre sistemas</li>
                  <li><strong>Comunicación ad-hoc:</strong> Los equipos coordinan directamente cuando surgen problemas inesperados</li>
              </ul>
              <p>
                El objetivo es minimizar las dependencias desde el principio, dando a los equipos autonomía para 
                entregar su trabajo completo sin bloqueos externos.
              </p>
            </div>
          </div>
        </div>
        
        <div class="faq-section">
          <h3>Implementación</h3>
          
          <div class="faq-item">
            <h4>¿Cómo podemos empezar a implementar Shape Up en nuestro equipo?</h4>
            <div class="faq-answer">
              <p>
                Para implementar Shape Up de forma gradual:
              </p>
              <ol>
                  <li><strong>Educación:</strong> Leen el libro gratuito de Shape Up y compártanlo con el equipo</li>
                  <li><strong>Experimento inicial:</strong> Prueba un ciclo de 6 semanas con un solo equipo pequeño</li>
                  <li><strong>Adaptación:</strong> Crea un ciclo de moldeado-apuesta-construcción que funcione en tu contexto</li>
                  <li><strong>Herramientas:</strong> Utiliza herramientas simples; no necesitas software especializado al principio</li>
                  <li><strong>Análisis:</strong> Al final del ciclo, evalúen qué funcionó y qué necesita ajustes</li>
              </ol>
              <p>
                Una implementación exitosa suele llevar varios ciclos mientras el equipo se adapta al nuevo ritmo 
                y forma de trabajar. Lo más importante es mantener el principio de trabajo autónomo con límites claros.
              </p>
            </div>
          </div>
          
          <div class="faq-item">
            <h4>¿Podemos combinar Shape Up con otras metodologías?</h4>
            <div class="faq-answer">
              <p>
                Sí, muchas organizaciones adaptan Shape Up combinándolo con elementos de otras metodologías:
              </p>
              <ul>
                  <li><strong>Shape Up + Kanban:</strong> Usar tableros Kanban para visualizar el trabajo durante los ciclos</li>
                  <li><strong>Shape Up + OKRs:</strong> Alinear los ciclos y apuestas con objetivos trimestrales</li>
                  <li><strong>Shape Up parcial:</strong> Aplicar solo a ciertos equipos o tipos de trabajo</li>
              </ul>
              <p>
                Lo importante es mantener la integridad de los principios centrales: ciclos con tiempo definido, 
                apuestas deliberadas en lugar de backlog infinito, y equipos con autonomía para ejecutar.
              </p>
            </div>
          </div>
        </div>
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
      
      h4 {
        margin-top: 1.2rem;
        margin-bottom: 0.5rem;
        color: #666;
        font-size: 1.2rem;
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
      
      /* Estilos para la sección de FAQ */
      .faq {
        margin-top: 3rem;
      }
      
      .search-box {
        margin-bottom: 2rem;
        
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        small {
          display: block;
          margin-top: 0.5rem;
          color: #888;
        }
      }
      
      .faq-section {
        margin-bottom: 2rem;
      }
      
      .faq-item {
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
        
        &:last-child {
          border-bottom: none;
        }
      }
      
      .faq-answer {
        margin-top: 0.5rem;
      }
    }
  `]
})
export class AboutComponent {} 