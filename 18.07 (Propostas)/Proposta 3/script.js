 const perguntas = [
            {
                pergunta: "Qual seleção venceu a Copa do Mundo de 2014?",
                alternativas: ["Brasil", "Alemanha", "Argentina"],
                correta: 1
            },
            {
                pergunta: "Quem é o maior artilheiro da história do futebol, segundo a FIFA?",
                alternativas: ["Pelé", "Lionel Messi", "Cristiano Ronaldo"],
                correta: 2
            },
            {
                pergunta: "Qual clube venceu a UEFA Champions League em 2016?",
                alternativas: ["Manchester City", "Real Madrid", "Bayern de Munique"],
                correta: 1
            },
            {
                pergunta: "Em que ano o Brasil conquistou seu primeiro título mundial?",
                alternativas: ["1950", "1958", "1962"],
                correta: 1
            },
            {
                pergunta: "Qual jogador é conhecido como 'O Rei do Futebol'?",
                alternativas: ["Maradona", "Pelé", "Zidane"],
                correta: 1
            }
        ];

        let perguntaAtual = 0;
        let pontuacao = 0;

        const perguntaContainer = document.getElementById('pergunta');
        const alternativasContainer = document.getElementById('alternativas');
        const feedbackContainer = document.getElementById('feedback');
        const pontuacaoContainer = document.getElementById('pontuacao');
        const proximaButton = document.getElementById('proxima');
        const recomecarButton = document.getElementById('recomecar');

        function carregarPergunta() {
            const pergunta = perguntas[perguntaAtual];
            perguntaContainer.textContent = pergunta.pergunta;
            alternativasContainer.innerHTML = '';
            feedbackContainer.textContent = '';
            pontuacaoContainer.textContent = '';
            proximaButton.style.display = 'none';
            recomecarButton.style.display = 'none';

            pergunta.alternativas.forEach((alternativa, index) => {
                const button = document.createElement('button');
                button.textContent = alternativa;
                button.classList.add('alternativa');
                button.addEventListener('click', () => verificarResposta(index));
                alternativasContainer.appendChild(button);
            });
        }

        function verificarResposta(selecionada) {
            const correta = perguntas[perguntaAtual].correta;
            const botoes = document.querySelectorAll('.alternativa');
            botoes.forEach(button => button.disabled = true);

            if (selecionada === correta) {
                feedbackContainer.textContent = 'Correto!';
                feedbackContainer.classList.add('correto');
                feedbackContainer.classList.remove('errado');
                pontuacao += 20;
            } else {
                feedbackContainer.textContent = `Errado! A resposta correta é: ${perguntas[perguntaAtual].alternativas[correta]}`;
                feedbackContainer.classList.add('errado');
                feedbackContainer.classList.remove('correto');
            }

            if (perguntaAtual < perguntas.length - 1) {
                proximaButton.style.display = 'block';
            } else {
                proximaButton.style.display = 'none';
                recomecarButton.style.display = 'block';
                pontuacaoContainer.textContent = `Pontuação Final: ${pontuacao}/100`;
            }
        }

        function recomecarJogo() {
            perguntaAtual = 0;
            pontuacao = 0;
            carregarPergunta();
        }

        proximaButton.addEventListener('click', () => {
            perguntaAtual++;
            carregarPergunta();
        });

        recomecarButton.addEventListener('click', recomecarJogo);

        carregarPergunta();