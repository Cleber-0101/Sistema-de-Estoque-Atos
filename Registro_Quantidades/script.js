// script.js

// Lista para armazenar os registros de itens (em memória)
let itens = JSON.parse(localStorage.getItem('itens')) || [];

// Carregar registros do localStorage (caso haja) e atualizar a tabela
document.addEventListener('DOMContentLoaded', function() {
    atualizarTabela();
});

// Função para lidar com o envio do formulário
document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)
    
    const tipo = document.getElementById('tipo').value;
    const quantidade = document.getElementById('quantidade').value;

    // Validação de campos
    if (!tipo || !quantidade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verifica se está em modo de edição
    const botao = document.getElementById('submit-btn');
    if (botao.textContent === 'Atualizar Item') {
        const index = botao.getAttribute('data-index');
        editarRegistro(index, tipo, quantidade);
    } else {
        registrarItem(tipo, quantidade);
    }
});

// Função para registrar novo item
function registrarItem(tipo, quantidade) {
    const tabela = document.getElementById('itens-tabela').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).textContent = tipo;
    novaLinha.insertCell(1).textContent = quantidade;

    const acaoCell = novaLinha.insertCell(2);
    acaoCell.innerHTML = ` 
        <button class="editar" onclick="editarRegistroModal(${itens.length})">Editar</button>
        <button class="excluir" onclick="excluirRegistro(${itens.length})">Excluir</button>
    `;

    itens.push({ tipo, quantidade });
    localStorage.setItem('itens', JSON.stringify(itens));

    document.getElementById('registro-form').reset();
}

// Função para editar o registro
function editarRegistroModal(index) {
    const item = itens[index];
    document.getElementById('tipo').value = item.tipo;
    document.getElementById('quantidade').value = item.quantidade;

    const botao = document.getElementById('submit-btn');
    botao.textContent = 'Atualizar Item';
    botao.setAttribute('data-index', index);
}

// Função para editar o registro após o envio do formulário
function editarRegistro(index, tipo, quantidade) {
    itens[index] = { tipo, quantidade };
    localStorage.setItem('itens', JSON.stringify(itens));

    atualizarTabela();
    document.getElementById('registro-form').reset();
    const botao = document.getElementById('submit-btn');
    botao.textContent = 'Registrar Item';
}

// Função para excluir o registro
function excluirRegistro(index) {
    itens.splice(index, 1);
    localStorage.setItem('itens', JSON.stringify(itens));

    atualizarTabela();
}

// Função para atualizar a tabela com os registros
function atualizarTabela() {
    const tabela = document.getElementById('itens-tabela').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de repopulá-la

    itens.forEach((item, index) => {
        const novaLinha = tabela.insertRow();
        novaLinha.insertCell(0).textContent = item.tipo;
        novaLinha.insertCell(1).textContent = item.quantidade;

        const acaoCell = novaLinha.insertCell(2);
        acaoCell.innerHTML = `
            <button class="editar" onclick="editarRegistroModal(${index})">Editar</button>
            <button class="excluir" onclick="excluirRegistro(${index})">Excluir</button>
        `;
    });
}

// Função para exportar para Excel
document.getElementById('exportar-btn').addEventListener('click', function() {
    const dadosTabela = itens.map(item => [
        item.tipo,
        item.quantidade
    ]);

    const cabecalho = ["Tipo", "Quantidade"];
    dadosTabela.unshift(cabecalho);

    const ws = XLSX.utils.aoa_to_sheet(dadosTabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Itens");

    XLSX.writeFile(wb, "itens_registrados.xlsx");
});
