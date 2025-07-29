const ratingPanel = document.getElementById("ratingPanel");
const thankYouPanel = document.getElementById("thankYouPanel");
const emojis = document.querySelectorAll(".emoji");
const mensagemEl = document.getElementById("mensagem");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");
let selectedRating = null;

emojis.forEach(emoji => {
    emoji.addEventListener('click', () => {
        emojis.forEach(e => e.classList.remove("selected"));
        emoji.classList.add("selected");
        selectedRating = emoji.getAttribute("data-rating");
        mensagemEl.textContent = '';
    });
});
sendBtn.addEventListener('click', () => {
   if(!selectedRating) {
    mensagemEl.textContent = "Por favor, selecione uma avaliação.";
    return;
   } 
   ratingPanel.classList.add('fade-out');

   setTimeout(() => {
    ratingPanel.classList.add('hidden');
    thankYouPanel.classList.remove('hidden');
    thankYouPanel.classList.add('fade-in');
   }, 500);
});

resetBtn.addEventListener('click', () => {
    thankYouPanel.classList.remove('fade-in');
    thankYouPanel.classList.add('fade-out');
    setTimeout(() => {
     thankYouPanel.classList.add('hidden');
     ratingPanel.classList.remove('hidden', 'fade-out');
     ratingPanel.classList.add('fade-in');

     selectedRating = null;
     emojis.forEach(e => e.classList.remove('selected'));
     mensagemEl.textContent = '';
    }, 500); 
});