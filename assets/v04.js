// Versión 04: cabecera fija con sombra al bajar y menú móvil accesible.
const header = document.querySelector('.site-header');
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('#menu');
function setMenu(open){
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });
const paint = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', paint, { passive: true }); paint();
// El mosaico de Colaborar entra una vez al aparecer.
const mosaic = document.querySelector('.mosaic');
if (mosaic && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { mosaic.classList.add('is-in'); io.disconnect(); } }), { threshold: .2 });
  io.observe(mosaic);
} else if (mosaic) mosaic.classList.add('is-in');
// Formularios de empresa y centros: validan y abren el correo con el mensaje preparado.
document.querySelectorAll('.contact-form').forEach(form => {
  const err = form.querySelector('.form-error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    form.querySelectorAll('[required]').forEach(f => {
      const bad = f.type === 'checkbox' ? !f.checked : (!f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)));
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !first) first = f;
    });
    if (first) {
      err.hidden = false;
      err.textContent = first.type === 'checkbox' ? 'Para enviar, acepta la política de privacidad.' : first.type === 'email' && first.value ? 'Revisa el correo electrónico: parece que le falta algo.' : 'Completa los campos marcados para poder enviarlo.';
      first.focus();
      return;
    }
    err.hidden = true;
    const d = new FormData(form);
    const body = `Nombre: ${d.get('nombre')}\nCorreo: ${d.get('correo')}\nTeléfono: ${d.get('telefono') || '-'}\nOrganización: ${d.get('organizacion')}\n\n${d.get('mensaje') || ''}`;
    location.href = `mailto:aperfosa@aperfosa.org?subject=${encodeURIComponent(form.dataset.asunto)}&body=${encodeURIComponent(body)}`;
  });
});
