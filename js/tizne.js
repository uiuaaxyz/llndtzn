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
