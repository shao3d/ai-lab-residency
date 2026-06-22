#!/usr/bin/env node
/* Build index.html from content.json using the design system in styles.css.
   Zero dependencies. Run: node build.js
   Content is the market-researched Russian copy for the AI-lab residency. */
'use strict';
const fs = require('fs');
const path = require('path');

const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));

// --- helpers ---
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const APPLY = '#application';                 // in-page anchor to application section
const TG = 'https://t.me/glebkudr';           // external apply channel
const SITE = 'https://glebkudr.com';

const OBL_ICON = { build: '⬡', mic: '▲', calendar: '▤', hands: '◇' };

// ---------------------------------------------------------------- NAV
function nav() {
  const links = C.nav.links.map(l => {
    const ext = /^https?:/.test(l.href);
    return `<a href="${l.href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`;
  }).join('\n      ');
  return `<header class="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="${SITE}" target="_blank" rel="noopener" aria-label="ИИ-лаборатория Глеба Кудрявцева">
      <span class="mark">GK</span>
      <span>
        <span class="b-title">${esc(C.nav.logoTitle)}</span><br>
        <span class="b-sub">${esc(C.meta.programName)}</span>
      </span>
    </a>
    <nav class="nav-links">
      ${links}
    </nav>
    <div class="nav-cta">
      <a class="btn btn-primary" href="${APPLY}">Подать заявку <span class="arr">→</span></a>
      <button class="nav-burger" aria-label="Меню">≡</button>
    </div>
  </div>
  <div class="mobile-menu">
    ${C.nav.links.map(l => `<a href="${l.href}">${esc(l.label)}</a>`).join('\n    ')}
    <a href="${APPLY}">Подать заявку →</a>
  </div>
</header>`;
}

// ---------------------------------------------------------------- HERO
function hero() {
  const chips = C.statusChips.map(c =>
    `<span class="chip"><b>${esc(c.label)}:</b> ${esc(c.value)}</span>`).join('\n        ');
  return `<section class="s-dark hero">
  <span class="glow"></span>
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${esc(C.hero.eyebrow.replace(/^\/\/\s*/, ''))}</span>
      <h1>${esc(C.hero.h1)}</h1>
      <p class="lead">${esc(C.hero.sub)}</p>
      <div class="hero-cta">
        <a class="btn btn-primary btn-lg" href="${APPLY}">${esc(C.hero.ctaPrimary.label)} <span class="arr">→</span></a>
        <a class="btn btn-ghost-dark btn-lg" href="#principle">${esc(C.hero.ctaSecondary.label)}</a>
      </div>
      <div class="chips hero-chips">
        <span class="chip"><span class="dot"></span> <b>статус:</b> приём открыт</span>
        ${chips}
      </div>
    </div>
    <div class="terminal reveal">
      <div class="terminal-bar">
        <span class="tdot r"></span><span class="tdot y"></span><span class="tdot g"></span>
        <span class="tname">lab://residency/status</span>
      </div>
      <div class="terminal-body">
<div class="row"><span class="cm">› cohort</span> <span class="mut">— первый набор открыт</span></div>
<div class="row"><span class="k">members</span>: <span class="v">отобранные практики ИИ</span></div>
<div class="row"><span class="k">vetting</span>: <span class="v">личное собеседование с Глебом</span></div>
<div class="row"><span class="k">cadence</span>: <span class="v">1 живой формат / неделю</span></div>
<div class="row"><span class="k">tracks</span>: <span class="v">агенты · evals · RAG · MCP · локальные модели</span></div>
<div class="row"><span class="k">diploma</span>: <span class="v">реальная система, IP остаётся за вами</span></div>
<div class="row"><span class="ok">✓ на выходе — проект, а не папка конспектов</span></div>
      </div>
      <div class="terminal-foot">
        <span class="accuracy"><span class="pulse"></span> уровень: senior+ / билдеры</span>
        <span class="label">берём не всех</span>
      </div>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- generic section head
function head(o, theme) {
  return `<div class="section-head reveal">
      <span class="eyebrow">${esc((o.label || '').replace(/^\/\/\s*/, ''))}</span>
      <h2>${esc(o.heading)}</h2>
      ${o.intro ? `<p>${esc(o.intro)}</p>` : ''}
    </div>`;
}

// ---------------------------------------------------------------- PRINCIPLE
function principle() {
  const cards = C.principle.points.map((p, i) => `<div class="card reveal">
        <div class="num">0${i + 1}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </div>`).join('\n      ');
  return `<section class="s-cream" id="principle">
  <div class="wrap">
    ${head(C.principle)}
    <div class="grid grid-2">
      ${cards}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- FOR WHOM
function forWhom() {
  const icons = ['&lt;/&gt;', '⌘', '▲'];
  const cards = C.forWhom.personas.map((p, i) => `<div class="card reveal">
        <div class="ic">${icons[i] || '◆'}</div>
        <span class="lab-meta">${esc(p.n)}</span>
        <h3 style="margin-top:6px">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </div>`).join('\n      ');
  const notitems = C.notForWhom.items.map(t =>
    `<li><span class="ck no">×</span> ${esc(t)}</li>`).join('\n        ');
  return `<section class="s-dark" id="for-whom">
  <div class="wrap">
    ${head(C.forWhom)}
    <div class="grid grid-3">
      ${cards}
    </div>
    <div class="card reveal not-card">
      <span class="eyebrow" style="margin-bottom:18px;display:inline-flex">${esc((C.notForWhom.label||'').replace(/^\/\/\s*/, ''))}</span>
      <h3 style="margin-bottom:18px">${esc(C.notForWhom.heading)}</h3>
      <ul class="checklist">
        ${notitems}
      </ul>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- WEEKLY
function weekly() {
  const formats = C.weeklyProgram.formats.map((f, i) => `<div class="card reveal">
        <span class="tag">${esc(f.tag)}</span>
        <h3 style="margin-top:16px">${esc(f.title)}</h3>
        <p>${esc(f.text)}</p>
      </div>`).join('\n      ');
  const topics = C.weeklyProgram.exampleTopics.map(t => `<li>${esc(t)}</li>`).join('\n        ');
  return `<section class="s-cream" id="weekly">
  <div class="wrap">
    ${head(C.weeklyProgram)}
    <div class="grid grid-3">
      ${formats}
    </div>
    <div style="margin-top:40px" class="reveal">
      <p class="lab-meta" style="color:var(--text-light-faint);margin-bottom:14px">// примеры тем повестки — выбирают сами резиденты</p>
      <ul class="topics">
        ${topics}
      </ul>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- DIPLOMA
function diploma() {
  const steps = C.diplomaProject.milestones.map(m => `<div class="step">
        <div class="st-n">этап ${esc(m.phase)}</div>
        <div class="st-body">
          <h3>${esc(m.title)}</h3>
          <p>${esc(m.text)}</p>
        </div>
      </div>`).join('\n      ');
  return `<section class="s-navy" id="diploma">
  <div class="wrap">
    ${head(C.diplomaProject)}
    <div class="steps reveal">
      ${steps}
    </div>
    ${C.diplomaProject.showcase ? `<p class="price-note reveal" style="margin-top:32px">${esc(C.diplomaProject.showcase)}</p>` : ''}
  </div>
</section>`;
}

// ---------------------------------------------------------------- OBLIGATIONS
function obligations() {
  const cards = C.residentObligations.obligations.map(o => `<div class="card reveal">
        <div class="ic">${OBL_ICON[o['icon-hint']] || '◆'}</div>
        <h3>${esc(o.title)}</h3>
        <p>${esc(o.text)}</p>
      </div>`).join('\n      ');
  return `<section class="s-cream" id="resident">
  <div class="wrap">
    ${head(C.residentObligations)}
    <div class="grid grid-4">
      ${cards}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- PRICING
function pricing() {
  const tiers = C.pricing.tiers.map(t => {
    const inc = t.includes.map(x => `<li>${esc(x)}</li>`).join('\n          ');
    const obl = (t.obligations || []).map(x => `<li>${esc(x)}</li>`).join('\n          ');
    return `<div class="price-card${t.highlighted ? ' featured' : ''} reveal">
        ${t.highlighted ? '<span class="pc-badge">основной формат</span>' : ''}
        <div class="pc-name">${esc(t.name)}</div>
        <div class="pc-tagline">${esc(t.tagline)}</div>
        <div class="pc-price">${esc(t.price)} <span>${esc(t.period)}</span></div>
        <div class="pc-for">${esc(t.forWhom)}</div>
        <ul class="pc-list">
          ${inc}
        </ul>
        ${obl ? `<div class="pc-obl-label">обязательства</div><ul class="pc-list obl">\n          ${obl}\n        </ul>` : ''}
        <a class="btn ${t.highlighted ? 'btn-primary' : 'btn-ghost-dark'}" href="${APPLY}">${esc(t.ctaLabel)} <span class="arr">→</span></a>
      </div>`;
  }).join('\n      ');
  return `<section class="s-navy" id="pricing">
  <div class="wrap">
    ${head(C.pricing)}
    ${C.pricing.anchor ? `<div class="price-anchor reveal"><span class="lab-meta">// для ориентира</span><p>${esc(C.pricing.anchor)}</p></div>` : ''}
    <div class="pricing-grid">
      ${tiers}
    </div>
    ${C.pricing.ctaShared ? `<p class="pc-shared reveal">${esc(C.pricing.ctaShared.subline)}</p>` : ''}
    ${C.pricing.note ? `<p class="price-note reveal">${esc(C.pricing.note)}</p>` : ''}
    ${C.pricing.guarantee ? `<p class="price-guarantee reveal"><span class="ck">✓</span> ${esc(C.pricing.guarantee)}</p>` : ''}
  </div>
</section>`;
}

// ---------------------------------------------------------------- APPLICATION
function application() {
  const steps = C.application.steps.map(s => `<div class="step">
        <div class="st-n">шаг ${esc(s.n)}</div>
        <div class="st-body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
      </div>`).join('\n      ');
  const crit = C.application.interviewCriteria.map(c =>
    `<li><span class="ck">✓</span> ${esc(c)}</li>`).join('\n        ');
  return `<section class="s-cream" id="application">
  <div class="wrap">
    ${head(C.application)}
    <div class="app-grid">
      <div class="steps reveal">
        ${steps}
      </div>
      <div class="app-side reveal">
        <span class="lab-meta">// на собеседовании смотрим</span>
        <ul class="checklist" style="margin-top:16px">
          ${crit}
        </ul>
        ${C.application.logistics ? `<p class="app-logistics">${esc(C.application.logistics)}</p>` : ''}
      </div>
    </div>
    <div class="app-cta reveal">
      <a class="btn btn-primary btn-lg" href="${TG}" target="_blank" rel="noopener">${esc(C.application.ctaLabel)} <span class="arr">→</span></a>
      <a class="btn btn-ghost-light btn-lg" href="${SITE}" target="_blank" rel="noopener">Сайт лаборатории</a>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- FOUNDER
function founder() {
  return `<section class="s-dark" id="founder">
  <div class="wrap founder">
    <div class="founder-card reveal">
      <div class="f-mark">GK</div>
      <div class="f-name">${esc(C.founder.name)}</div>
      <div class="f-role">${esc(C.founder.role)}</div>
      <p style="margin-top:18px;font-size:.96rem;color:var(--text-dark-soft)">${esc(C.founder.bio)}</p>
    </div>
    <div class="reveal">
      <span class="eyebrow" style="margin-bottom:22px;display:inline-flex">руководитель лаборатории</span>
      <blockquote><span class="quote-mark">«</span>${esc(C.founder.quote)}<span class="quote-mark">»</span></blockquote>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- FAQ
function faq() {
  const items = C.faq.map(f => `<div class="faq-item">
        <button class="faq-q">${esc(f.q)} <span class="fic"></span></button>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </div>`).join('\n      ');
  return `<section class="s-cream" id="faq">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">вопросы</span>
      <h2>Коротко о важном</h2>
    </div>
    <div class="faq reveal">
      ${items}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- FINAL CTA
function finalCta() {
  const f = C.finalCta;
  return `<section class="s-dark">
  <div class="wrap">
    <div class="cta-band reveal">
      <span class="eyebrow" style="justify-content:center;display:inline-flex">первый набор · приём открыт</span>
      <h2 style="margin-top:18px">${esc(f.heading)}</h2>
      <p>${esc(f.sub)}</p>
      <a class="btn btn-primary btn-lg" href="${TG}" target="_blank" rel="noopener">${esc(f.ctaLabel)} <span class="arr">→</span></a>
      ${f.waitlist ? `<p class="micro">${esc(f.waitlist)}</p>` : ''}
      ${f.microcopy ? `<p class="cta-tag">${esc(f.microcopy)}</p>` : ''}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- FOOTER
function footer() {
  const links = C.footer.links.map(l => {
    const ext = /^https?:/.test(l.href);
    return `<a href="${l.href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`;
  }).join('\n          ');
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <a class="brand" href="${SITE}" target="_blank" rel="noopener">
          <span class="mark">GK</span>
          <span>
            <span class="b-title">${esc(C.nav.logoTitle)}</span><br>
            <span class="b-sub">${esc(C.nav.logoSub)}</span>
          </span>
        </a>
        <p class="f-tag">${esc(C.footer.tagline)}</p>
      </div>
      <div class="footer-links">
        <div class="col">
          <h4>Навигация</h4>
          ${links}
        </div>
        <div class="col">
          <h4>Связь</h4>
          <a href="${TG}" target="_blank" rel="noopener">Telegram · @glebkudr</a>
          <a href="${APPLY}">Подать заявку</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ИИ-лаборатория Глеба Кудрявцева</span>
      <span>AI — инструмент, результат — система</span>
    </div>
  </div>
</footer>`;
}

// ---------------------------------------------------------------- ASSEMBLE
const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(C.meta.title)}</title>
<meta name="description" content="${esc(C.meta.description)}" />
<meta name="author" content="Глеб Кудрявцев" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(C.meta.title)}" />
<meta property="og:description" content="${esc(C.meta.description)}" />
<meta name="theme-color" content="#0a0a0c" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700&family=Commissioner:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23fe6e00'/%3E%3Ctext x='16' y='22' font-family='Arial' font-weight='700' font-size='15' fill='white' text-anchor='middle'%3EGK%3C/text%3E%3C/svg%3E" />
</head>
<body>
${nav()}
${hero()}
${principle()}
${forWhom()}
${weekly()}
${diploma()}
${obligations()}
${pricing()}
${application()}
${founder()}
${faq()}
${finalCta()}
${footer()}
<script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('✓ index.html built —', html.length, 'bytes, sections:',
  ['hero','principle','forWhom','weekly','diploma','obligations','pricing','application','founder','faq'].length + 4);
