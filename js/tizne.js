/* LLENO DE TIZNE — comportamiento compartido (sin librerías) */

// Cuántos textos caben en cada pestaña del Archivo.
// Si agregas más textos, las pestañas (Bloque I, II, III...) se crean solas.
const TEXTOS_POR_BLOQUE = 2;

const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/* ---------- MENÚ MÓVIL ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    menuToggle.setAttribute('aria-expanded', abierto);
    menuToggle.textContent = abierto ? 'Cerrar' : 'Menú';
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('abierto');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menú';
  }));
}

/* ---------- MODALES (proyectos y galería) ---------- */
let ultimoFoco = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  ultimoFoco = document.activeElement;
  modal.classList.add('active');
  document.body.classList.add('modal-abierto');
  const cerrar = modal.querySelector('.close-modal');
  if (cerrar) cerrar.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  if (!document.querySelector('.modal-overlay.active')) document.body.classList.remove('modal-abierto');
  if (ultimoFoco) ultimoFoco.focus();
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', () => openModal(el.dataset.modal));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
  const cerrar = overlay.querySelector('.close-modal');
  if (cerrar) cerrar.addEventListener('click', () => closeModal(overlay.id));
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
});

/* ---------- ARCHIVO: pestañas automáticas + filtros por género ---------- */
const archivo = document.querySelector('.archive-list');

if (archivo) {
  const items = Array.from(archivo.querySelectorAll('.archive-item'));
  const tabsBox = document.querySelector('.archive-tabs-container');
  const filtros = document.querySelectorAll('.filter-btn');
  let generoActual = 'all';
  let bloqueActual = 0;

  // Numerar cada texto (01, 02, 03...)
  items.forEach((item, i) => {
    const num = document.createElement('span');
    num.className = 'archive-num';
    num.textContent = String(i + 1).padStart(2, '0');
    item.prepend(num);
  });

  const vacio = document.createElement('p');
  vacio.className = 'archive-empty';
  vacio.textContent = '[ Sin textos de este género todavía. El carbón sigue ardiendo. ]';
  archivo.appendChild(vacio);

  function render() {
    const visibles = items.filter(it => generoActual === 'all' || it.dataset.category === generoActual);
    const totalBloques = Math.max(1, Math.ceil(visibles.length / TEXTOS_POR_BLOQUE));
    if (bloqueActual >= totalBloques) bloqueActual = 0;

    // Pestañas
    tabsBox.innerHTML = '';
    tabsBox.hidden = totalBloques < 2;
    for (let b = 0; b < totalBloques; b++) {
      const desde = b * TEXTOS_POR_BLOQUE + 1;
      const hasta = Math.min((b + 1) * TEXTOS_POR_BLOQUE, visibles.length);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (b === bloqueActual ? ' active' : '');
      btn.textContent = `Bloque ${ROMANOS[b] || b + 1} (${desde}-${hasta})`;
      btn.addEventListener('click', () => { bloqueActual = b; render(); });
      tabsBox.appendChild(btn);
    }

    // Items
    items.forEach(it => { it.hidden = true; });
    visibles
      .slice(bloqueActual * TEXTOS_POR_BLOQUE, (bloqueActual + 1) * TEXTOS_POR_BLOQUE)
      .forEach(it => { it.hidden = false; });

    vacio.hidden = visibles.length > 0;
  }

  function filtrar(genero) {
    generoActual = genero;
    bloqueActual = 0;
    filtros.forEach(f => f.classList.toggle('active', f.dataset.filter === genero));
    render();
  }

  filtros.forEach(f => f.addEventListener('click', () => filtrar(f.dataset.filter)));

  // Enlaces del footer: "Poesía", "Crónica"... filtran el archivo
  document.querySelectorAll('[data-filtrar]').forEach(a => {
    a.addEventListener('click', () => filtrar(a.dataset.filtrar));
  });

  render();
}

/* ---------- NAV: resalta la sección visible ---------- */
const enlacesNav = document.querySelectorAll('header nav a[href^="#"]');

if (enlacesNav.length && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      enlacesNav.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('main section[id]').forEach(s => obs.observe(s));
}

/* ---------- CONTACTO: abre el correo con el mensaje armado ---------- */
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const destino = form.dataset.correo;
    const nombre = form.querySelector('#nombre').value.trim();
    const correo = form.querySelector('#correo').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();
    const asunto = encodeURIComponent(`Propuesta desde Lleno de Tizne — ${nombre}`);
    const cuerpo = encodeURIComponent(`${mensaje}\n\n— ${nombre} (${correo})`);
    window.location.href = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;
    const status = form.querySelector('.form-status');
    if (status) status.textContent = '> Mensaje entregado al carbón. Se abrirá tu programa de correo.';
  });
}

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- PORTADA: fantasma de mala impresión ---------- */
const tituloHero = document.querySelector('#inicio h1');

if (tituloHero) {
  const fantasma = document.createElement('span');
  fantasma.className = 'fantasma';
  fantasma.setAttribute('aria-hidden', 'true');
  fantasma.innerHTML = tituloHero.innerHTML;
  tituloHero.appendChild(fantasma);
}

/* ---------- PORTADA: ceniza que cae y se agita con el cursor ---------- */
const lienzo = document.getElementById('hollin');

if (lienzo && lienzo.getContext) {
  const ctx = lienzo.getContext('2d');
  const hero = lienzo.parentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cursor = { x: -9999, y: -9999, activo: false };
  let ancho = 0, alto = 0, particulas = [], visible = true, ultimo = 0;

  const nueva = (enCualquierAltura) => ({
    x: Math.random() * ancho,
    y: enCualquierAltura ? Math.random() * alto : -10,
    t: 1 + Math.random() * 3.2,               // tamaño
    vy: 0.15 + Math.random() * 0.55,          // caída
    vx: 0,
    fase: Math.random() * Math.PI * 2,
    gris: 120 + Math.floor(Math.random() * 120),
    a: 0.25 + Math.random() * 0.6,
    giro: Math.random() * Math.PI,
  });

  function medir() {
    ancho = hero.clientWidth;
    alto = hero.clientHeight;
    lienzo.width = ancho * dpr;
    lienzo.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(170, (ancho * alto) / 9000));
    particulas = Array.from({ length: total }, () => nueva(true));
  }

  function dibujar(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.giro);
    ctx.fillStyle = `rgba(${p.gris},${p.gris},${p.gris},${p.a})`;
    // ceniza = esquirlas rectas, nunca círculos
    ctx.fillRect(-p.t / 2, -p.t / 2, p.t, p.t * 0.6);
    ctx.restore();
  }

  function cuadro(ahora) {
    if (!visible) return;
    const dt = Math.min(3, (ahora - ultimo) / 16.7 || 1);
    ultimo = ahora;
    ctx.clearRect(0, 0, ancho, alto);

    for (const p of particulas) {
      p.fase += 0.012 * dt;
      // el cursor sopla la ceniza
      if (cursor.activo) {
        const dx = p.x - cursor.x, dy = p.y - cursor.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (1 - d2 / 16000) * 0.9;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f * 0.6;
        }
      }
      p.vx *= 0.94;
      p.vy += (0.15 + p.t * 0.08 - p.vy) * 0.02;
      p.x += (p.vx + Math.sin(p.fase) * 0.35) * dt;
      p.y += p.vy * dt;
      p.giro += 0.01 * dt;
      if (p.y > alto + 10 || p.x < -20 || p.x > ancho + 20) Object.assign(p, nueva(false));
      dibujar(p);
    }
    requestAnimationFrame(cuadro);
  }

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    cursor.x = e.clientX - r.left;
    cursor.y = e.clientY - r.top;
    cursor.activo = true;
  });
  hero.addEventListener('pointerleave', () => { cursor.activo = false; });

  medir();
  let espera;
  window.addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(medir, 150); });

  if (sinMovimiento) {
    particulas.forEach(dibujar);
  } else {
    new IntersectionObserver(([en]) => {
      const antes = visible;
      visible = en.isIntersecting;
      if (visible && !antes) { ultimo = performance.now(); requestAnimationFrame(cuadro); }
    }).observe(hero);
    requestAnimationFrame(cuadro);
  }
}

/* ---------- TACHONES: en celular se revelan al tocar ---------- */
document.querySelectorAll('.tachon').forEach(t => {
  t.setAttribute('tabindex', '0');
  t.addEventListener('click', () => t.classList.toggle('visto'));
});

/* ---------- ENTRADAS TIPO IMPRENTA ---------- */
const porRevelar = document.querySelectorAll(
  '.section-title, .about-grid > *, .archive-item, .gallery-card, .project-card, .contact-container > *, .text-container'
);

if ('IntersectionObserver' in window && !sinMovimiento) {
  const impresor = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('impreso');
      impresor.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  porRevelar.forEach(el => { el.classList.add('revelar'); impresor.observe(el); });
}

/* ---------- LECTURA: barra de avance ---------- */
const barra = document.querySelector('.barra-lectura');
const textoLeido = document.querySelector('.text-container');

if (barra && textoLeido) {
  const avanzar = () => {
    const r = textoLeido.getBoundingClientRect();
    const cabecera = document.querySelector('header').offsetHeight;
    const total = r.height - window.innerHeight + cabecera;
    const hecho = total <= 0 ? 1 : Math.min(1, Math.max(0, (cabecera - r.top) / total));
    barra.style.transform = `scaleX(${hecho})`;
  };
  window.addEventListener('scroll', avanzar, { passive: true });
  avanzar();
}
