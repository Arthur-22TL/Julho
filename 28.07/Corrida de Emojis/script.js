const emoji1 = document.getElementById("emoji1");
const emoji2 = document.getElementById("emoji2");
const resultado = document.getElementById("resultado");
const resultadoAposta = document.getElementById("resultado-aposta");
const apostaAtual = document.getElementById("aposta-atual");
const btnCorrida = document.getElementById("btn-corrida");
const btnApostarCachorro = document.getElementById("apostar-cachorro");
const btnApostarGato = document.getElementById("apostar-gato");

let pos1 = 0;
let pos2 = 0;
let corridaAtiva = false;
let apostaEscolhida = null;

function fazerAposta(emoji) {
    if (corridaAtiva) return;

    apostaEscolhida = emoji;

    btnApostarCachorro.classList.remove('selecionado');
    btnApostarGato.classList.remove('selecionado');

    if (emoji === 'emoji1') {
        btnApostarCachorro.classList.add('selecionado');
        apostaAtual.textContent = 'Você apostou no Cachorro! 🐕';
    } else {
        btnApostarGato.classList.add('selecionado');
        apostaAtual.textContent = 'Você apostou no Gato! 🐈';
    }

    btnCorrida.disabled = false;

    resultado.textContent = '';
    resultadoAposta.textContent = '';
}

function comecarCorrida() {
    if (corridaAtiva || !apostaEscolhida) return;

    corridaAtiva = true;
    pos1 = 0;
    pos2 = 0;
    emoji1.style.left = '0px';
    emoji2.style.left = '0px';
    resultado.textContent = '';
    resultadoAposta.textContent = '';
    btnCorrida.disabled = true;
    btnApostarCachorro.disabled = true;
    btnApostarGato.disabled = true;

    const intervalo = setInterval(() => {
        pos1 += Math.random() * 8 + 2;
        pos2 += Math.random() * 8 + 2;
        emoji1.style.left = `${pos1}px`;
        emoji2.style.left = `${pos2}px`;

        if (pos1 >= 700 || pos2 >= 700) {
            clearInterval(intervalo);
            corridaAtiva = false;

            let vencedorTexto;
            let apostouCerto = false;

            if (pos1 >= 700 && pos2 < 700) {
                resultado.textContent = "🐕 Cachorro venceu a corrida! 🏆";
                vencedorTexto = 'Cachorro';
                apostouCerto = apostaEscolhida === 'emoji1';
            } else if (pos2 >= 700 && pos1 < 700) {
                resultado.textContent = "🐈 Gato venceu a corrida! 🏆";
                vencedorTexto = 'Gato';
                apostouCerto = apostaEscolhida === 'emoji2';
            } else {
                if (pos1 >= pos2) {
                    resultado.textContent = "🐕 Cachorro venceu a corrida! 🏆";
                    vencedorTexto = 'Cachorro';
                    apostouCerto = apostaEscolhida === 'emoji1';
                } else {
                    resultado.textContent = "🐈 Gato venceu a corrida! 🏆";
                    vencedorTexto = 'Gato';
                    apostouCerto = apostaEscolhida === 'emoji2';
                }
            }

            setTimeout(() => {
                if (apostouCerto) {
                    resultadoAposta.textContent = '🎉 PARABÉNS!! Você ganhou a aposta! 🎉';
                    resultadoAposta.className = 'ganhou';
                } else {
                    resultadoAposta.textContent = ' 😔 Que pena! Você perdeu a aposta. Tente novamente!';
                    resultadoAposta.className = 'perdeu';
                }

                btnApostarCachorro.disabled = false;
                btnApostarGato.disabled = false;

                setTimeout(() => {
                    btnApostarCachorro.classList.remove('selecionado');
                    btnApostarGato.classList.remove('selecionado');
                    apostaEscolhida = null;
                    apostaAtual.textContent = '';
                    btnCorrida.disabled = true;
                }, 3000);
            }, 1000);
        }
    }, 100);
}