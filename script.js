document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gasto-form');
    const tabelaGastos = document.querySelector('#tabela-gastos tbody');
    const filtroCartao = document.getElementById('filtro-cartao');
    const totalDisplay = document.getElementById('total');
    const totalCartao1 = document.getElementById('total-cartao1');
    const totalCartao2 = document.getElementById('total-cartao2');
    const totalCartao3 = document.getElementById('total-cartao3');
    const gerarTxtButton = document.getElementById('gerar-txt');
    
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    // Atualiza a tabela de gastos e os totais
    function atualizarTabela() {
        tabelaGastos.innerHTML = '';
        let total = 0;
        let totalC1 = 0, totalC2 = 0, totalC3 = 0;

        const cartaoFiltro = filtroCartao.value;
        const gastosFiltrados = cartaoFiltro ? gastos.filter(g => g.cartao === cartaoFiltro) : gastos;

        gastosFiltrados.forEach((gasto, index) => {
            const row = document.createElement('tr');

            const valorCell = document.createElement('td');
            valorCell.textContent = `R$ ${gasto.valor.toFixed(2)}`;
            row.appendChild(valorCell);

            const nomeCell = document.createElement('td');
            nomeCell.textContent = gasto.nome;
            row.appendChild(nomeCell);

            const pessoaCell = document.createElement('td');
            pessoaCell.textContent = gasto.pessoa;
            row.appendChild(pessoaCell);

            const cartaoCell = document.createElement('td');
            cartaoCell.textContent = gasto.cartao;
            row.appendChild(cartaoCell);

            const pagoCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = gasto.pago;
            checkbox.addEventListener('change', () => {
                gasto.pago = checkbox.checked;
                salvarGastos();
            });
            pagoCell.appendChild(checkbox);
            row.appendChild(pagoCell);

            const removerCell = document.createElement('td');
            const removerButton = document.createElement('button');
            removerButton.textContent = 'Remover';
            removerButton.className = 'remover';
            removerButton.addEventListener('click', () => {
                gastos.splice(index, 1);
                salvarGastos();
                atualizarTabela();
            });
            removerCell.appendChild(removerButton);
            row.appendChild(removerCell);

            tabelaGastos.appendChild(row);

            total += gasto.valor;

            if (gasto.cartao === 'cartao1') totalC1 += gasto.valor;
            if (gasto.cartao === 'cartao2') totalC2 += gasto.valor;
            if (gasto.cartao === 'cartao3') totalC3 += gasto.valor;
        });

        totalDisplay.textContent = `Total Geral: R$ ${total.toFixed(2)}`;
        totalCartao1.textContent = totalC1.toFixed(2);
        totalCartao2.textContent = totalC2.toFixed(2);
        totalCartao3.textContent = totalC3.toFixed(2);
    }

    // Função para salvar no LocalStorage
    function salvarGastos() {
        localStorage.setItem('gastos', JSON.stringify(gastos));
    }

    // Função para gerar o arquivo .txt
    gerarTxtButton.addEventListener('click', () => {
        let conteudo = 'Gastos:\n\n';
        gastos.forEach(gasto => {
            conteudo += `Valor: R$ ${gasto.valor.toFixed(2)}, Nome: ${gasto.nome}, Pessoa: ${gasto.pessoa}, Cartão: ${gasto.cartao}, Pago: ${gasto.pago ? 'Sim' : 'Não'}\n`;
        });

        const blob = new Blob([conteudo], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'gastos.txt';
        link.click();
    });

    // Evento de envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valor = parseFloat(document.getElementById('valor').value);
        const nome = document.getElementById('nome').value;
        const pessoa = document.getElementById('pessoa').value;
        const cartao = document.getElementById('cartao').value;

        const novoGasto = {
            valor, nome, pessoa, cartao, pago: false
        };

        gastos.push(novoGasto);
        salvarGastos();
        atualizarTabela();
        form.reset();
    });

    // Evento de filtragem por cartão
    filtroCartao.addEventListener('change', atualizarTabela);

    // Inicializar a tabela na página carregada
    atualizarTabela();
});
