/* =========================================================
   Jonatan Castro Fotografia — interações
   Autor: Neto Frazão
   - Menu mobile
   - Topo que muda ao rolar + link ativo
   - Slideshow do topo
   - Filtro do portfólio
   - Visualizador de fotos (setas, teclado e deslizar)
   - Animações ao rolar
   - Formulário que abre o WhatsApp pronto
   ========================================================= */

(function () {
  "use strict";

  const WHATSAPP = "5591992279801";
  const doc = document.documentElement;
  doc.classList.add("js");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const header = $(".header");
  const toggle = $(".menu-toggle");
  const nav = $("#menu");

  function setMenu(aberto) {
    nav.classList.toggle("is-open", aberto);
    header.classList.toggle("is-open", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("no-scroll", aberto);
  }
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => window.innerWidth >= 900 && setMenu(false));

  /* ---------- Topo ao rolar + link ativo ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$(".nav__link");
  if ("IntersectionObserver" in window) {
    const secoes = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secoes.forEach((s) => obs.observe(s));
  }

  /* ---------- Slideshow do topo ---------- */
  const slides = $$(".hero__slide");
  const dotsBox = $(".hero__dots");
  let atual = 0;
  let timer = null;

  function carregar(img) {
    if (img.dataset.src) {
      img.srcset = img.dataset.srcset || "";
      img.src = img.dataset.src;
      delete img.dataset.src;
      delete img.dataset.srcset;
    }
  }

  function mostrar(i) {
    atual = (i + slides.length) % slides.length;
    carregar(slides[atual]);
    carregar(slides[(atual + 1) % slides.length]);
    slides.forEach((s, n) => s.classList.toggle("is-active", n === atual));
    $$(".hero__dot", dotsBox).forEach((d, n) => {
      d.classList.toggle("is-active", n === atual);
      d.setAttribute("aria-selected", String(n === atual));
    });
  }

  function iniciar() {
    clearInterval(timer);
    if (!reduzMovimento) timer = setInterval(() => mostrar(atual + 1), 6000);
  }

  if (slides.length > 1) {
    slides.forEach((_, n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero__dot";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Foto ${n + 1}`);
      b.addEventListener("click", () => {
        mostrar(n);
        iniciar();
      });
      dotsBox.appendChild(b);
    });
    // Carrega as outras fotos só depois que a página terminou de abrir.
    window.addEventListener("load", () => setTimeout(() => carregar(slides[1]), 800));
    mostrar(0);
    iniciar();
    document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(timer) : iniciar()));
  }

  /* ---------- Filtro do portfólio ---------- */
  const itens = $$(".gallery__item");
  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      $$(".filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      itens.forEach((it) => {
        const mostra = f === "todos" || it.dataset.cat.split(" ").includes(f);
        it.classList.toggle("is-hidden", !mostra);
      });
    })
  );

  /* ---------- Visualizador de fotos ---------- */
  const lb = $("#lightbox");
  const lbImg = $(".lightbox__img", lb);
  const lbCap = $(".lightbox__caption", lb);
  let lista = [];
  let pos = 0;
  let ultimoFoco = null;

  function abrirFoto(i) {
    pos = (i + lista.length) % lista.length;
    const btn = lista[pos];
    const img = $("img", btn);
    lbImg.classList.add("is-loading");
    lbImg.onload = () => lbImg.classList.remove("is-loading");
    lbImg.src = btn.dataset.full || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    const titulo = $("figcaption strong", btn)?.textContent || "";
    const sub = $("figcaption span", btn)?.textContent || "";
    lbCap.innerHTML = "";
    const t = document.createElement("strong");
    t.textContent = titulo;
    lbCap.append(t, document.createTextNode(`${sub}  •  ${pos + 1} de ${lista.length}`));
    // Pré-carrega a próxima
    const prox = lista[(pos + 1) % lista.length];
    if (prox) new Image().src = prox.dataset.full;
  }

  function abrirLightbox(btn) {
    lista = $$(".gallery__item:not(.is-hidden) .gallery__btn");
    ultimoFoco = btn;
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    abrirFoto(lista.indexOf(btn));
    $(".lightbox__close", lb).focus();
  }

  function fecharLightbox() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.classList.remove("no-scroll");
    ultimoFoco?.focus();
  }

  $$(".gallery__btn").forEach((b) => b.addEventListener("click", () => abrirLightbox(b)));
  $(".lightbox__close", lb).addEventListener("click", fecharLightbox);
  $(".lightbox__prev", lb).addEventListener("click", () => abrirFoto(pos - 1));
  $(".lightbox__next", lb).addEventListener("click", () => abrirFoto(pos + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox__figure")) fecharLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
      return;
    }
    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowLeft") abrirFoto(pos - 1);
    if (e.key === "ArrowRight") abrirFoto(pos + 1);
  });

  // Deslizar o dedo no celular
  let toqueX = null;
  lb.addEventListener("touchstart", (e) => (toqueX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) abrirFoto(pos + (dx < 0 ? 1 : -1));
    toqueX = null;
  });

  /* ---------- Animações ao rolar ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduzMovimento) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Mostra ao entrar na tela ou se a pessoa já rolou além (rolagem rápida / links do menu).
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("is-visible");
            ro.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = $("#form-contato");
  const erro = $(".form__error", form);

  // Botões "Quero este ensaio" já escolhem o serviço no formulário
  $$("[data-whats]").forEach((b) =>
    b.addEventListener("click", () => {
      const sel = form.servico;
      const opt = Array.from(sel.options).find((o) => o.text === b.dataset.whats);
      if (opt) sel.value = opt.value || opt.text;
      setTimeout(() => form.nome.focus({ preventScroll: true }), 700);
    })
  );

  const formatarData = (iso) => (iso ? iso.split("-").reverse().join("/") : "");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    erro.hidden = true;
    $$(".is-invalid", form).forEach((el) => el.classList.remove("is-invalid"));

    const nome = form.nome.value.trim();
    const servico = form.servico.value;
    if (!nome || !servico) {
      const campo = !nome ? form.nome : form.servico;
      campo.classList.add("is-invalid");
      campo.focus();
      erro.textContent = !nome ? "Informe o seu nome." : "Escolha o tipo de sessão.";
      erro.hidden = false;
      return;
    }

    const linhas = [
      `Olá! Meu nome é ${nome}.`,
      `Tenho interesse em: ${servico}.`,
      form.data.value ? `Data desejada: ${formatarData(form.data.value)}.` : "",
      form.mensagem.value.trim() ? `\n${form.mensagem.value.trim()}` : "",
    ].filter(Boolean);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  });
})();
