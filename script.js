const denoms = [
  20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 25, 10, 5, 1,
];
const STORAGE_KEY = 'trocoCaixa';

function calcularTroco(compra, entregue) {
  let troco = entregue - compra;
  const caixa = carregarCaixa();
  const breakdown = [];

  // Soma o total disponível apenas das notas/moedas <= troco
  const totalDisponivel = caixa
    .filter((d) => d.value <= troco)
    .reduce((acc, d) => acc + d.value * d.qty, 0);

  if (totalDisponivel < troco) {
    // Não é possível dar o troco com as notas/moedas disponíveis
    return {
      breakdown: [],
      trocoRestante: troco,
      caixaAtualizado: caixa,
    };
  }

  caixa
    .sort((a, b) => b.value - a.value)
    .forEach((d) => {
      const need = Math.floor(troco / d.value);
      const take = Math.min(need, d.qty);
      if (take > 0) {
        breakdown.push({ value: d.value, qty: take });
        troco -= take * d.value;
        d.qty -= take;
      }
    });

  return { breakdown, trocoRestante: troco, caixaAtualizado: caixa };
}

function exibirResultadoTroco(breakdown, trocoRestante) {
  const resDiv = document.getElementById('resultado');
  let html = '';
  if (trocoRestante > 0) {
    html += `<div class="alert alert-danger">Caixa não tem troco suficiente para devolver R$ ${(
      trocoRestante / 100
    ).toFixed(2)}</div>`;
  } else if (breakdown.length === 0) {
    html += '<p>Sem troco a devolver.</p>';
  } else {
    html += '<h5>Troco:</h5><div class="row g-3">';
    breakdown.forEach((d) => {
      const val = (d.value / 100).toFixed(2);
      html += `
              <div class='col-4 text-center'>
                <strong>R$${val}</strong><br>
                <img src="images/${d.value}.png" alt="R$${val}" width="200"><br>
                <strong>x ${d.qty}</strong>
              </div>`;
    });
    html += '</div>';
  }
  resDiv.innerHTML = html;
}

function carregarCaixa() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return denoms.map((d) => ({ value: d, qty: data[d] || 0 }));
}
function salvarCaixa(arr) {
  const obj = {};
  arr.forEach((o) => (obj[o.value] = o.qty));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function saveConfig(arr) {
  const obj = {};
  arr.forEach((o) => (obj[o.value] = o.qty));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function loadConfig() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return denoms.map((d) => ({ value: d, qty: data[d] || 0 }));
}

function renderConfig() {
  const cfg = loadConfig();
  const grid = document.getElementById('grid-config');
  grid.innerHTML = '';
  cfg
    .sort((a, b) => b.value - a.value)
    .forEach((d) => {
      const val = (d.value / 100).toFixed(2);
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4';
      col.innerHTML = `
            <div class="card p-2 text-center">
              <div class="d-flex justify-content-center">
                <img src="images/${d.value}.png" alt="R$${val}" width="200" class="mb-2">
              </div>
              <div>R$${val}</div>
              <input type="number" min="0" class="form-control mt-2" name="qty-${d.value}" value="${d.qty}">
            </div>`;
      grid.appendChild(col);
    });
}

function renderDrawer() {
  const caixa = carregarCaixa();
  const container = document.getElementById('lista-caixa');
  container.innerHTML = '';
  let total = 0;
  caixa
    .sort((a, b) => b.value - a.value)
    .forEach((d) => {
      const val = (d.value / 100).toFixed(2);
      total += d.qty * d.value;
      const col = document.createElement('div');
      col.className = 'col-6';
      col.innerHTML = `
            <div class="d-flex align-items-center">
              <img src="images/${d.value}.png" alt="R$${val}" width="40" class="me-2">
              <div>
                <div>R$${val}</div>
                <div>Qtd: ${d.qty}</div>
              </div>
            </div>`;
      container.appendChild(col);
    });
  document.getElementById('total-caixa').textContent = (total / 100).toFixed(2);
  document.getElementById('alert-config').classList.toggle('d-none', total > 0);
}

document.getElementById('form-config')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll('[name^="qty-"]');
  const arr = Array.from(inputs).map((inp) => ({
    value: parseInt(inp.name.split('-')[1], 10),
    qty: parseInt(inp.value, 10) || 0,
  }));
  saveConfig(arr);
  window.location.href = 'index.html';
});

document.getElementById('form-troco').addEventListener('submit', (e) => {
  e.preventDefault();
  const compra = Math.round(
    parseFloat(document.getElementById('compra').value) * 100,
  );
  const entregue = Math.round(
    parseFloat(document.getElementById('entregue').value) * 100,
  );
  if (entregue < compra)
    return alert('Valor entregue deve ser >= valor da compra');

  const { breakdown, trocoRestante, caixaAtualizado } = calcularTroco(
    compra,
    entregue,
  );
  exibirResultadoTroco(breakdown, trocoRestante);
  if (trocoRestante === 0) {
    salvarCaixa(caixaAtualizado);
    renderDrawer();
  }
});

document.addEventListener('DOMContentLoaded', renderDrawer);
// Corrige o bug do backdrop do drawer que não desaparece ao fechar clicando fora
document
  .getElementById('drawer')
  ?.addEventListener('hidden.bs.offcanvas', function () {
    document
      .querySelectorAll('.offcanvas-backdrop')
      .forEach((el) => el.remove());
    document.body.classList.remove('offcanvas-backdrop');
  });
