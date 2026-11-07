const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const opened = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(opened));
    });
}
document.querySelectorAll('.nav a').forEach(a => { if (a.href===location.href) a.classList.add('active')});