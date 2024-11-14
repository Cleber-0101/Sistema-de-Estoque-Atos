// Função para formatar a data no formato dd/mm/yyyy
function formatarData(data) {
    const partesData = data.split('-'); // A data vem no formato yyyy-mm-dd
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`; // Retorna no formato dd/mm/yyyy
}

// Carregar registros do localStorage e atualizar a tabela
document.addEventListener('DOMContentLoaded', function() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tabela = document.getElementById('historico-trocas').getElementsByTagName('tbody')[0];

    registros.forEach(function(registro, index) {
        const novaLinha = tabela.insertRow();
        const celulaNome = novaLinha.insertCell(0);
        const celulaPeriferico = novaLinha.insertCell(1);
        const celulaData = novaLinha.insertCell(2);
        const celulaSetor = novaLinha.insertCell(3);
        const celulaAcoes = novaLinha.insertCell(4); // Nova célula para os botões de ações

        celulaNome.textContent = registro.nome;
        celulaPeriferico.textContent = registro.periferico;
        celulaData.textContent = formatarData(registro.data); // Exibe a data formatada
        celulaSetor.textContent = registro.setor;

        // Adicionar apenas o botão de excluir
        celulaAcoes.innerHTML = `
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
    });
});

// Função para exportar os dados para Excel
function exportarParaExcel() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const dados = registros.map(function(registro) {
        return [registro.nome, registro.periferico, formatarData(registro.data), registro.setor];
    });

    const ws = XLSX.utils.aoa_to_sheet([['Nome', 'Periférico', 'Data', 'Setor'], ...dados]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros de Retiradas');

    // Exportar o arquivo
    XLSX.writeFile(wb, 'registros_retidas.xlsx');
}

// Função para remover um registro
function excluirRegistro(index) {
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.splice(index, 1); // Remove o registro na posição index
    localStorage.setItem('registros', JSON.stringify(registros));

    // Atualiza a tabela
    atualizarTabela();
}

// Função para atualizar a tabela após exclusão
function atualizarTabela() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tabela = document.getElementById('historico-trocas').getElementsByTagName('tbody')[0];

    // Limpar a tabela atual
    tabela.innerHTML = '';

    // Recriar as linhas da tabela
    registros.forEach(function(registro, index) {
        const novaLinha = tabela.insertRow();
        const celulaNome = novaLinha.insertCell(0);
        const celulaPeriferico = novaLinha.insertCell(1);
        const celulaData = novaLinha.insertCell(2);
        const celulaSetor = novaLinha.insertCell(3);
        const celulaAcoes = novaLinha.insertCell(4); // Nova célula para os botões de ações

        celulaNome.textContent = registro.nome;
        celulaPeriferico.textContent = registro.periferico;
        celulaData.textContent = formatarData(registro.data); // Exibe a data formatada
        celulaSetor.textContent = registro.setor;

        // Adicionar apenas o botão de excluir
        celulaAcoes.innerHTML = `
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
    });
}

// Evento para o formulário de submissão (adição ou atualização)
document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-colaborador').value;
    const periferico = document.getElementById('periferico').value;
    const data = document.getElementById('data').value;
    const setor = document.getElementById('setor').value;

    // Verificar se todos os campos foram preenchidos
    if (nome && periferico && data && setor) {
        const novoRegistro = {
            nome: nome,
            periferico: periferico,
            data: data,
            setor: setor
        };

        const registros = JSON.parse(localStorage.getItem('registros')) || [];
        registros.push(novoRegistro);

        // Salvar no localStorage
        localStorage.setItem('registros', JSON.stringify(registros));

        // Limpar o formulário
        document.getElementById('registro-form').reset();

        // Atualizar a tabela
        atualizarTabela();
    }
});

// Evento para o botão de exportação
document.getElementById('exportar-excel').addEventListener('click', exportarParaExcel);

// Eventos para os botões de excluir
document.getElementById('historico-trocas').addEventListener('click', function(event) {
    if (event.target.classList.contains('excluir')) {
        const index = event.target.getAttribute('data-index');
        excluirRegistro(index);
    }
});
