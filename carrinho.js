/* Carrinho: lê e altera os itens que o index.js salvou em localStorage ("carrinho") */
const CHAVE = "carrinho";
const PAGINA_LOJA = "/pagina index/index.html";

const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const escapar = (t) =>
    String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function lerCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE));
        return Array.isArray(dados) ? dados.filter((i) => i && i.id && i.preco >= 0 && i.quantidade > 0) : [];
    } catch {
        return [];
    }
}

function salvarCarrinho(itens) {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
}

const listaEl = document.getElementById("itens");
const btnContinuar = document.getElementById("btn-continuar");
const btnLimpar = document.getElementById("btn-limpar");

function render() {
    const itens = lerCarrinho();
    const vazio = itens.length === 0;
    const qtd = itens.reduce((s, i) => s + i.quantidade, 0);
    const total = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);

    btnContinuar.classList.toggle("desativado", vazio);
    btnLimpar.hidden = vazio;

    document.getElementById("rotulo-produtos").textContent =
        `Produtos (${qtd} ${qtd === 1 ? "item" : "itens"})`;
    document.getElementById("subtotal").textContent = moeda(total);
    document.getElementById("total").textContent = moeda(total);

    if (vazio) {
        listaEl.innerHTML = `
            <div class="vazio">
                <div class="emoji">🛒</div>
                <p>Seu carrinho está vazio.</p>
                <a href="${PAGINA_LOJA}">Ver produtos</a>
            </div>`;
        return;
    }

    listaEl.innerHTML = itens.map((i) => `
        <div class="item" data-id="${escapar(i.id)}">
            <div class="item-img">${i.imagem ? `<img src="${escapar(i.imagem)}" alt="">` : "📦"}</div>
            <div>
                <div class="item-nome">${escapar(i.nome)}</div>
                <div class="item-preco">${moeda(i.preco)} cada</div>
                <div class="item-acoes">
                    <div class="qtd">
                        <button type="button" data-acao="menos" aria-label="Diminuir">−</button>
                        <span>${i.quantidade}</span>
                        <button type="button" data-acao="mais" aria-label="Aumentar">+</button>
                    </div>
                    <button type="button" class="btn-texto" data-acao="remover">Remover</button>
                </div>
            </div>
            <div class="item-total">${moeda(i.preco * i.quantidade)}</div>
        </div>`).join("");
}

listaEl.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-acao]");
    if (!botao) return;

    const id = botao.closest(".item").dataset.id;
    let itens = lerCarrinho();
    const item = itens.find((i) => i.id === id);
    if (!item) return;

    const maximo = item.estoque || 99; // o index.js guarda o estoque de cada produto

    if (botao.dataset.acao === "mais") item.quantidade = Math.min(item.quantidade + 1, maximo);
    if (botao.dataset.acao === "menos") item.quantidade = Math.max(item.quantidade - 1, 1);
    if (botao.dataset.acao === "remover") itens = itens.filter((i) => i.id !== id);

    salvarCarrinho(itens);
    render();
});

btnLimpar.addEventListener("click", () => {
    if (confirm("Remover todos os itens do carrinho?")) {
        salvarCarrinho([]);
        render();
    }
});

// Atualiza se o carrinho mudar em outra aba
window.addEventListener("storage", render);

render();
