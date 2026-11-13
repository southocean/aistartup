const STATUS = {
  leading:   { label: "Leading",   cls: "s-lead" },
  promising: { label: "Promising", cls: "s-prom" },
  enabler:   { label: "Enabler",   cls: "s-enab" },
  weak:      { label: "Weak",      cls: "s-weak" },
  dead:      { label: "Dead",      cls: "s-dead" },
  survived:  { label: "Survived",  cls: "s-surv" }
};

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const total = i => Object.values(i.scores || {}).reduce((a, b) => a + b, 0);

function list(items) {
  return items && items.length ? `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="muted">Not researched yet.</p>`;
}

function render(data) {
  document.getElementById("updated").textContent = "updated " + data.updated;
  const max = data.rubric.length * 5, nStages = data.stages.length;
  const stageName = n => (data.stages.find(s => s.id === n) || {}).name || "";

  // Board
  const sorted = [...data.ideas].sort((a, b) => total(b) - total(a));
  document.getElementById("boardTable").innerHTML =
    `<thead><tr><th>Idea</th><th>Status</th><th>Stage</th>${data.rubric.map(r => `<th title="${esc(r.help)}">${esc(r.label)}</th>`).join("")}<th>Total</th></tr></thead><tbody>` +
    sorted.map(i => {
      const st = STATUS[i.status] || { label: i.status, cls: "" };
      return `<tr><td><a href="#${esc(i.id)}">${esc(i.name)}</a></td>
        <td><span class="pill ${st.cls}">${st.label}</span></td>
        <td><div class="stagebar" title="${esc(stageName(i.stage))}"><span style="width:${(i.stage / nStages) * 100}%"></span></div><small>${i.stage}/${nStages} ${esc(stageName(i.stage))}</small></td>
        ${data.rubric.map(r => `<td class="num sc${i.scores[r.key] ?? 0}">${i.scores[r.key] ?? "–"}</td>`).join("")}
        <td class="num"><b>${total(i)}</b><small>/${max}</small></td></tr>`;
    }).join("") + "</tbody>";

  // Gauntlet
  document.getElementById("stages").innerHTML = data.stages.map(s => `<li><b>${esc(s.name)}</b><span>${esc(s.test)}</span></li>`).join("");
  document.getElementById("rubric").innerHTML = data.rubric.map(r => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.help)}</dd></div>`).join("");

  // Idea cards
  document.getElementById("ideaList").innerHTML = sorted.map(i => {
    const st = STATUS[i.status] || { label: i.status, cls: "" };
    const comps = i.competitors && i.competitors.length
      ? `<div class="comps">${i.competitors.map(c => `<div class="comp"><b>${esc(c.tier)}</b><span class="who">${esc(c.who)}</span><p>${esc(c.note)}</p></div>`).join("")}</div>`
      : `<p class="muted">Not researched yet.</p>`;
    const srcs = i.sources && i.sources.length
      ? `<details><summary>Sources (${i.sources.length})</summary><ul class="src">${i.sources.map(s => `<li><a href="${esc(s.url)}" rel="noopener nofollow" target="_blank">${esc(s.label)}</a></li>`).join("")}</ul></details>` : "";
    return `<article class="idea" id="${esc(i.id)}">
      <header><h3>${esc(i.name)}</h3><span class="pill ${st.cls}">${st.label}</span><span class="score">${total(i)}/${max}</span></header>
      <p class="pitch">${esc(i.pitch)}</p>
      <div class="verdict"><b>Verdict so far</b><p>${esc(i.verdict)}</p></div>
      ${i.market && i.market.length ? `<h4>Market signals</h4><ul class="market">${i.market.map(m => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
      <div class="cols">
        <div><h4>Your edge</h4>${list(i.edge)}</div>
        <div><h4>Risks</h4>${list(i.risks)}</div>
      </div>
      <h4>Competitors</h4>${comps}
      ${i.pricing ? `<h4>Pricing signals</h4><p>${esc(i.pricing)}</p>` : ""}
      <div class="next"><b>Next test</b><p>${esc(i.next)}</p></div>
      ${srcs}
    </article>`;
  }).join("");
}

fetch("ideas.json", { cache: "no-store" })
  .then(r => r.json())
  .then(render)
  .catch(e => { document.getElementById("ideaList").innerHTML = `<p class="muted">Couldn't load ideas.json (${esc(e.message)}). Open the site through a local server, not as a file.</p>`; });
