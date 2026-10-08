/* ---------- Dados dos produtos ---------- */
/* A chave (ex.: "b550") é a mesma usada em onclick="abrirModal('b550')" no HTML */
const produtos = {
    b550: {
        nome: "Placa mãe AORUS B550",
        preco: 399.90,
        estoque: 12,
        imagens: ["imagens/b550 1.webp", "/imagens/b550 2.webp", "/imagens/b550 3.webp"],
        descricao: "Placa-mãe B550 para processadores AMD, com suporte a memória DDR4 e PCIe 4.0."
    },
    corsair: {
        nome: "Fonte Corsair RM1000e",
        preco: 549.90,
        estoque: 8,
        imagens: ["imagens/Fonte CORSAIR RMe Series RM1000e 1.webp"],
        descricao: "Fonte modular de 1000W com certificação 80 Plus Gold e operação silenciosa."
    },
    msi650: {
        nome: "Fonte MSI MAG A650BN",
        preco: 399.00,
        estoque: 15,
        imagens: ["imagens/Fonte MSI MAG A650BN 0.webp"],
        descricao: "Fonte de 650W com certificação 80 Plus Bronze, ideal para PCs de uso geral e games."
    },
    ram16: {
        nome: "Memória RAM Rise Mode Z, 16GB",
        preco: 359.90,
        estoque: 20,
        imagens: ["imagens/Memória RAM Rise Mode Z, 16GB 1.webp"],
        descricao: "Memória RAM de 16GB para desktop, com ótimo desempenho em jogos e multitarefa."
    },
    rtx5070: {
        nome: "Placa de Vídeo Gigabyte RTX 5070",
        preco: 5700.99,
        estoque: 4,
        imagens: ["imagens/Placa de Vídeo Gigabyte RTX 5070 1.webp"],
        descricao: "Placa de vídeo NVIDIA RTX 5070 para jogos em alta resolução e ray tracing."
    },
    ryzen7: {
        nome: "Processador Ryzen 7",
        preco: 2000.00,
        estoque: 10,
        imagens: ["imagens/ryzen 7 1.webp"],
        descricao: "Processador AMD Ryzen 7 de 8 núcleos, excelente para jogos e produtividade."
    },
    rx7600: {
        nome: "Placa de vídeo RX 7600",
        preco: 1980.99,
        estoque: 7,
        imagens: ["imagens/rx7600 1.webp"],
        descricao: "Placa de vídeo AMD Radeon RX 7600, ótima para jogos em Full HD."
    },
    rtx5080: {
        nome: "Placa de Vídeo RTX 5080",
        preco: 7900.99,
        estoque: 3,
        imagens: ["imagens/rtx 5080 1.webp"],
        descricao: "Placa de vídeo NVIDIA RTX 5080 de alto desempenho para 4K."
    },
    watercooler: {
        nome: "Water Cooler MSI MAG Coreliquid A12",
        preco: 1500.00,
        estoque: 6,
        imagens: ["imagens/Water Cooler MSI MAG Coreliquid A12 1.webp"],
        descricao: "Water cooler com radiador e ventoinhas de alto fluxo para manter o processador frio."
    }
};


/* ---------- Estado e elementos ---------- */
let produtoAtual = null;
let quantidadeAtual = 1;

const modal = document.getElementById("modalProduto");
const imagemProduto = document.getElementById("imagemProduto");
const miniaturas = document.getElementById("miniaturas");
const spanQuantidade = document.getElementById("quantidade");

const formatarPreco = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


/* ---------- Modal ---------- */
function abrirModal(id) {
    const dados = produtos[id];
    if (!dados) {
        console.error("Produto não encontrado:", id);
        return;
    }

    produtoAtual = id;
    quantidadeAtual = 1;

    document.getElementById("nomeProduto").textContent = dados.nome;
    document.getElementById("descricaoProduto").textContent = dados.descricao;
    document.getElementById("precoProduto").textContent = formatarPreco(dados.preco);
    document.getElementById("estoqueProduto").textContent = dados.estoque;
    spanQuantidade.textContent = quantidadeAtual;

    mostrarImagem(dados.imagens[0], dados.nome);
    montarMiniaturas(dados);

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function fecharModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function mostrarImagem(src, nome) {
    imagemProduto.src = src;
    imagemProduto.alt = nome;
}

function montarMiniaturas(dados) {
    miniaturas.innerHTML = "";

    // só mostra miniaturas se houver mais de uma foto
    if (dados.imagens.length < 2) return;

    dados.imagens.forEach((src) => {
        const mini = document.createElement("img");
        mini.src = src;
        mini.alt = dados.nome;
        mini.addEventListener("click", () => mostrarImagem(src, dados.nome));
        miniaturas.appendChild(mini);
    });
}


/* ---------- Quantidade ---------- */
function aumentarQuantidade() {
    const estoque = produtos[produtoAtual].estoque;
    if (quantidadeAtual < estoque) {
        quantidadeAtual++;
        spanQuantidade.textContent = quantidadeAtual;
    }
}

function diminuirQuantidade() {
    if (quantidadeAtual > 1) {
        quantidadeAtual--;
        spanQuantidade.textContent = quantidadeAtual;
    }
}


/* ---------- Carrinho ---------- */
function adicionarAoCarrinho() {
    const dados = produtos[produtoAtual];
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const item = carrinho.find((i) => i.id === produtoAtual);
    if (item) {
        item.quantidade = Math.min(item.quantidade + quantidadeAtual, dados.estoque);
    } else {
        carrinho.push({
            id: produtoAtual,
            nome: dados.nome,
            preco: dados.preco,
            imagem: dados.imagens[0],
            quantidade: quantidadeAtual
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert(`${quantidadeAtual} x ${dados.nome} adicionado(s) ao carrinho!`);
    fecharModal();
}


/* ---------- Fechar com clique fora ou tecla Esc ---------- */
modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
});
