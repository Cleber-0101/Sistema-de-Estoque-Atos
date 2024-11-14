// Função para formatar a data no formato dd/mm/yyyy
function formatarData(data) {
    const partesData = data.split('-'); // A data vem no formato yyyy-mm-dd
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`; // Retorna no formato dd/mm/yyyy
}

// Função para converter a data de dd/mm/yyyy para yyyy-mm-dd (formato necessário para o campo de data)
function converterDataParaFormatoInput(data) {
    const partesData = data.split('/');
    return `${partesData[2]}-${partesData[1]}-${partesData[0]}`; // Retorna no formato yyyy-mm-dd
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

        // Adicionar botões de editar e excluir
        celulaAcoes.innerHTML = `
            <button class="editar" data-index="${index}">Editar</button>
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
    });
});

// Salvar novo registro no localStorage e atualizar a tabela
document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário
    
    const nomeColaborador = document.getElementById('nome-colaborador').value;
    const periferico = document.getElementById('periferico').value;
    const data = document.getElementById('data').value; // Recebe a data no formato yyyy-mm-dd
    const setor = document.getElementById('setor').value;

    if (!nomeColaborador || !periferico || !data || !setor) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Formatar a data para o formato dd/mm/yyyy
    const dataFormatada = formatarData(data);

    // Verificar se está no modo de edição
    const indexEditando = document.getElementById('registro-form').getAttribute('data-editing');

    // Se estiver editando, substitui o registro
    if (indexEditando !== null) {
        const registros = JSON.parse(localStorage.getItem('registros')) || [];
        registros[indexEditando] = { nome: nomeColaborador, periferico: periferico, data: dataFormatada, setor: setor };
        localStorage.setItem('registros', JSON.stringify(registros));

        // Atualizar a tabela
        atualizarTabela();

        // Limpar o formulário
        document.getElementById('registro-form').reset();
        document.getElementById('registro-form').removeAttribute('data-editing'); // Limpar marcação de edição
        document.getElementById('submit-btn').textContent = 'Registrar Troca'; // Mudar de volta o botão
    } else {
        // Caso não esteja editando, adicionar novo registro
        const novoRegistro = { nome: nomeColaborador, periferico: periferico, data: dataFormatada, setor: setor };

        // Atualizar o localStorage
        const registros = JSON.parse(localStorage.getItem('registros')) || [];
        registros.push(novoRegistro);
        localStorage.setItem('registros', JSON.stringify(registros));

        // Atualizar a tabela
        adicionarRegistroTabela(novoRegistro, registros.length - 1);

        // Limpar o formulário
        document.getElementById('registro-form').reset();
    }
});

// Função para adicionar um registro na tabela
function adicionarRegistroTabela(registro, index) {
    const tabela = document.getElementById('historico-trocas').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();
    const celulaNome = novaLinha.insertCell(0);
    const celulaPeriferico = novaLinha.insertCell(1);
    const celulaData = novaLinha.insertCell(2);
    const celulaSetor = novaLinha.insertCell(3);
    const celulaAcoes = novaLinha.insertCell(4); // Nova célula para os botões de ações

    celulaNome.textContent = registro.nome;
    celulaPeriferico.textContent = registro.periferico;
    celulaData.textContent = registro.data; // A data já está formatada
    celulaSetor.textContent = registro.setor;

    // Adicionar botões de editar e excluir
    celulaAcoes.innerHTML = `
        <button class="editar" data-index="${index}">Editar</button>
        <button class="excluir" data-index="${index}">Excluir</button>
    `;
}

// Função para editar um registro
document.getElementById('historico-trocas').addEventListener('click', function(event) {
    if (event.target.classList.contains('editar')) {
        const index = event.target.getAttribute('data-index');
        const registros = JSON.parse(localStorage.getItem('registros'));
        const registro = registros[index];

        // Preenche o formulário com os dados do registro selecionado
        document.getElementById('nome-colaborador').value = registro.nome;
        document.getElementById('periferico').value = registro.periferico;
        document.getElementById('data').value = converterDataParaFormatoInput(registro.data); // Converter para yyyy-mm-dd
        document.getElementById('setor').value = registro.setor;

        // Atualizar o botão para concluir edição
        document.getElementById('registro-form').setAttribute('data-editing', index); // Marcar o formulário como edição
        document.getElementById('submit-btn').textContent = 'Concluir Edição'; // Alterar texto do botão
    }

    // Excluir registro
    if (event.target.classList.contains('excluir')) {
        const index = event.target.getAttribute('data-index');
        excluirRegistro(index);
    }
});

// Função para excluir um registro
function excluirRegistro(index) {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.splice(index, 1); // Remove o registro pelo índice
    localStorage.setItem('registros', JSON.stringify(registros));

    // Atualiza a tabela após exclusão
    atualizarTabela();
}

// Função para atualizar a tabela após exclusão ou edição
function atualizarTabela() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tabela = document.getElementById('historico-trocas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela

    // Recriar as linhas da tabela com os registros atualizados
    registros.forEach(function(registro, index) {
        const novaLinha = tabela.insertRow();
        const celulaNome = novaLinha.insertCell(0);
        const celulaPeriferico = novaLinha.insertCell(1);
        const celulaData = novaLinha.insertCell(2);
        const celulaSetor = novaLinha.insertCell(3);
        const celulaAcoes = novaLinha.insertCell(4);

        celulaNome.textContent = registro.nome;
        celulaPeriferico.textContent = registro.periferico;
        celulaData.textContent = formatarData(registro.data);
        celulaSetor.textContent = registro.setor;

        // Adicionar botões de editar e excluir
        celulaAcoes.innerHTML = `
            <button class="editar" data-index="${index}">Editar</button>
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
    });
}
