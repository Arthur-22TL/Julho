 document.getElementById('budgetForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const quantidade = parseInt(document.getElementById('quantidade').value);
            const preco = parseFloat(document.getElementById('preco').value);
            const resultadoDiv = document.getElementById('resultado');

            if (isNaN(quantidade) || isNaN(preco) || quantidade < 0 || preco < 0) {
                alert('Por favor, preencha todos os campos com valores válidos (números não negativos).');
                resultadoDiv.textContent = '';
                return;
            }

            const total = quantidade * preco;
            resultadoDiv.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        });