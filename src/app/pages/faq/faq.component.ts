import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-container">
      <h1>Preguntas Frecuentes sobre Shape Up</h1>
      
      <div class="search-box">
        <input type="text" placeholder="Buscar preguntas..." disabled />
        <small><em>(Funcionalidad en desarrollo)</em></small>
      </div>
      
      <div class="faq-section">
        <h2>Conceptos Básicos</h2>
        
        <div class="faq-item">
          <h3>¿Qué es Shape Up y quién lo creó?</h3>
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
          <h3>¿Para qué tipo de empresas o proyectos es adecuado Shape Up?</h3>
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
        <h2>Ciclos de Trabajo</h2>
        
        <div class="faq-item">
          <h3>¿Por qué los ciclos duran exactamente 6 semanas?</h3>
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
          <h3>¿Qué ocurre si el trabajo no se completa en 6 semanas?</h3>
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
          <h3>¿Qué sucede durante el período de enfriamiento (cooldown)?</h3>
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
        <h2>Propuestas (Pitches)</h2>
        
        <div class="faq-item">
          <h3>¿Qué debe contener una buena propuesta (pitch)?</h3>
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
          <h3>¿Quién puede crear propuestas?</h3>
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
        <h2>Equipos y Roles</h2>
        
        <div class="faq-item">
          <h3>¿Cuál es el tamaño ideal de equipo para trabajar con Shape Up?</h3>
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
          <h3>¿Cómo se gestionan las dependencias entre equipos?</h3>
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
        <h2>Implementación</h2>
        
        <div class="faq-item">
          <h3>¿Cómo podemos empezar a implementar Shape Up en nuestro equipo?</h3>
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
          <h3>¿Podemos combinar Shape Up con otras metodologías?</h3>
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
            <p>
              Tener cuidado con mezclar demasiado, ya que algunas prácticas de otras metodologías pueden 
              socavar los beneficios de Shape Up (como planificación diaria detallada o estimaciones de tareas).
            </p>
          </div>
        </div>
      </div>
      
      <div class="faq-section">
        <h2>Herramientas y Técnicas</h2>
        
        <div class="faq-item">
          <h3>¿Qué son los Hill Charts y cómo se utilizan?</h3>
          <div class="faq-answer">
            <p>
              Los Hill Charts son una herramienta visual única de Shape Up para mostrar el progreso, representando 
              el trabajo como una colina que el equipo debe subir y bajar:
            </p>
            <ul>
                <li><strong>Subiendo la colina:</strong> Representa la fase de descubrimiento, donde el equipo está 
                resolviendo problemas desconocidos y tomando decisiones clave</li>
                <li><strong>Cima de la colina:</strong> El punto donde los principales problemas están resueltos 
                y existe un plan claro</li>
                <li><strong>Bajando la colina:</strong> La fase de ejecución, donde el trabajo está mayormente definido 
                y consiste en implementar soluciones conocidas</li>
            </ul>
            <p>
              Los equipos actualizan manualmente sus Hill Charts (usualmente 1-2 veces por semana) para comunicar 
              su progreso sin necesidad de reuniones formales. Esto revela rápidamente si algún aspecto del trabajo 
              está estancado en la fase de "subida", requiriendo atención.
            </p>
            <img src="https://basecamp.com/assets/general/hill_chart-c809cc9a5596aad9e29f258c3f36b5fceecfcff34e8d8ce8c96c5aa5bf2f4c27.png" 
                 alt="Ejemplo de Hill Chart" style="width: 100%; max-width: 600px; margin: 1rem 0; border-radius: 4px;">
          </div>
        </div>
        
        <div class="faq-item">
          <h3>¿Qué herramientas de software se recomiendan para Shape Up?</h3>
          <div class="faq-answer">
            <p>
              Shape Up no requiere herramientas especializadas, pero estas son algunas opciones:
            </p>
            <ul>
                <li><strong>Basecamp:</strong> La herramienta original creada por los inventores de Shape Up</li>
                <li><strong>Linear, Shortcut o similar:</strong> Herramientas de gestión de proyectos adaptables a ciclos</li>
                <li><strong>Notion, Coda:</strong> Para documentación y seguimiento personalizado</li>
                <li><strong>Shape Up Manager (esta aplicación):</strong> Especializada en la gestión de ciclos Shape Up</li>
            </ul>
            <p>
              Lo más importante es que la herramienta:
            </p>
            <ul>
                <li>Permita definir ciclos claros</li>
                <li>Ofrezca un lugar para documentar propuestas</li>
                <li>Facilite la visualización del progreso (idealmente con Hill Charts)</li>
                <li>No fuerce flujos de trabajo que contradigan los principios de Shape Up</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
      
      h1 {
        margin-bottom: 2rem;
        color: #333;
        font-size: 2.5rem;
      }
      
      h2 {
        margin-top: 3rem;
        margin-bottom: 1.5rem;
        color: #444;
        font-size: 1.8rem;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 0.5rem;
      }
      
      .search-box {
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        
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
          color: #777;
        }
      }
      
      .faq-section {
        margin-bottom: 2rem;
      }
      
      .faq-item {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        
        &:last-child {
          border-bottom: none;
        }
        
        h3 {
          margin-bottom: 1rem;
          color: #7048e8;
          font-size: 1.3rem;
          cursor: pointer;
          
          &:hover {
            color: #5a30cb;
          }
          
          &::before {
            content: "Q: ";
            font-weight: bold;
          }
        }
        
        .faq-answer {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 0.5rem;
          
          p {
            line-height: 1.7;
            margin-bottom: 1rem;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
          
          ul, ol {
            margin: 1rem 0 1.5rem 1.5rem;
            
            li {
              margin-bottom: 0.75rem;
              line-height: 1.6;
              
              strong {
                color: #444;
              }
            }
          }
          
          img {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
        }
      }
      
      @media (max-width: 768px) {
        padding: 1.5rem;
        
        .faq-item h3 {
          font-size: 1.2rem;
        }
      }
    }
  `]
})
export class FaqComponent {} 