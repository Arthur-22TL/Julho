 document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;

            if (nome && email && mensagem) {
                alert('Formulário enviado com sucesso! Nome: ' + nome + ', Email: ' + email + ', Mensagem: ' + mensagem);
                this.reset();
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });