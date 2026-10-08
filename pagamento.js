const PRECO = 299.90;

const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const soDigitos = (s) => s.replace(/\D/g, "");

const form = document.getElementById("form-pagamento");
const etapas = [
    document.getElementById("etapa-1"),
    document.getElementById("etapa-2"),
    document.getElementById("etapa-3"),
];
const botao = document.getElementById("btn-finalizar");
const paineis = {
    pix: document.getElementById("painel-pix"),
    cartao: document.getElementById("painel-cartao"),
    boleto: document.getElementById("painel-boleto"),
};
const selectParcelas = document.getElementById("parcelas");
const mensagem = document.getElementById("mensagem");

/* ---------- Parcelas (até 6x sem juros) ---------- */
for (let i = 1; i <= 6; i++) {
    const op = document.createElement("option");
    op.value = i;
    op.textContent = `${i}x de ${moeda(PRECO / i)} sem juros`;
    selectParcelas.appendChild(op);
}

/* ---------- Método de pagamento + totais ---------- */
function atualizarMetodo() {
    const metodo = form.metodo.value; // "" enquanto nada for escolhido

    Object.entries(paineis).forEach(([nome, el]) => {
        el.hidden = nome !== metodo;
    });

    const desconto = metodo === "pix" ? PRECO * 0.05 : 0;
    document.getElementById("linha-desconto").hidden = desconto === 0;
    document.getElementById("desconto").textContent = "- " + moeda(desconto);
    document.getElementById("total").textContent = moeda(PRECO - desconto);
}

/* ---------- Validação de cada etapa ---------- */
function camposValidos(container) {
    return [...container.querySelectorAll("input[required], select[required]")]
        .every((campo) => campo.checkValidity());
}

function cartaoValido() {
    const numero = soDigitos(document.getElementById("cartao-numero").value);
    const nome = document.getElementById("cartao-nome").value.trim();
    const validade = document.getElementById("cartao-validade").value;
    const cvv = document.getElementById("cartao-cvv").value;
    const mesOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(validade);

    return numero.length >= 13 && nome.length >= 2 && mesOk && cvv.length >= 3;
}

function pagamentoCompleto() {
    const metodo = form.metodo.value;
    if (!metodo) return false;
    return metodo === "cartao" ? cartaoValido() : true;
}

const etapaCompleta = [
    () => camposValidos(etapas[0]),
    () => camposValidos(etapas[1]),
    pagamentoCompleto,
];

/* ---------- Revelar etapas em sequência ---------- */
function revelar(el) {
    if (!el.hidden) return; // já visível: não anima de novo
    el.hidden = false;
    el.classList.add("revelar");
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function atualizarEtapas() {
    const ok = etapaCompleta.map((fn) => fn());

    etapas.forEach((etapa, i) => etapa.classList.toggle("concluida", ok[i]));

    if (ok[0]) revelar(etapas[1]);
    if (ok[0] && ok[1]) revelar(etapas[2]);
    if (ok[0] && ok[1] && ok[2]) revelar(botao);
}

/* Digitando: espera uma pausa; escolhendo (radio/select): na hora */
let pausa;
form.addEventListener("input", () => {
    clearTimeout(pausa);
    pausa = setTimeout(atualizarEtapas, 600);
});
form.addEventListener("change", () => {
    clearTimeout(pausa);
    atualizarMetodo();
    atualizarEtapas();
});
atualizarMetodo();

/* ---------- Máscaras ---------- */
function aplicarMascara(input, fn) {
    input.addEventListener("input", () => (input.value = fn(soDigitos(input.value))));
}

aplicarMascara(form.cpf, (d) =>
    d.slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
);

aplicarMascara(form.cep, (d) => d.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"));

aplicarMascara(form.telefone, (d) =>
    d.slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
);

aplicarMascara(document.getElementById("cartao-numero"), (d) =>
    d.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")
);

aplicarMascara(document.getElementById("cartao-validade"), (d) =>
    d.slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2")
);

aplicarMascara(document.getElementById("cartao-cvv"), (d) => d.slice(0, 4));

/* ---------- Envio (simulação: nenhum dado é enviado) ---------- */
function mostrar(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
    mensagem.hidden = false;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!pagamentoCompleto()) {
        mostrar(
            form.metodo.value === "cartao"
                ? "Confira os dados do cartão."
                : "Escolha uma forma de pagamento.",
            "erro"
        );
        return;
    }

    // Aqui entraria a chamada ao back-end / gateway de pagamento.
    mostrar("Pedido recebido! Em breve você receberá a confirmação por e-mail.", "ok");
});