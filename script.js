const icones = ['❤️', '⭐', '🔥', '💻', '🎮', '🧙'];
let cartas = [];
let primeiraCarta = null;
let podeJogar = true;

// Embaralha o array
function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Cria o tabuleiro no MODO ÍCONES
function criarTabuleiro() {
  const tabuleiro = document.getElementById('tabuleiro');
  tabuleiro.innerHTML = '';
  primeiraCarta = null;
  podeJogar = true;
  
  cartas = [...icones, ...icones]; // reseta pros ícones e duplica
  embaralhar(cartas).forEach(icone => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.tipo = 'icone'; // marca que é ícone
    carta.dataset.valor = icone;
    carta.innerHTML = '?';
    carta.onclick = () => virarCarta(carta);
    tabuleiro.appendChild(carta);
  });
}

// Cria o tabuleiro no MODO FOTO
function criarTabuleiroComFotos(urlsFotos) {
  const tabuleiro = document.getElementById('tabuleiro');
  tabuleiro.innerHTML = '';
  primeiraCarta = null;
  podeJogar = true;

  cartas = [...urlsFotos, ...urlsFotos]; // duplica pra ter par
  embaralhar(cartas).forEach(url => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.tipo = 'foto'; // marca que é foto
    carta.dataset.valor = url;
    carta.innerHTML = '?';
    carta.onclick = () => virarCarta(carta);
    tabuleiro.appendChild(carta);
  });
}

// ÚNICA função pra virar carta. Serve pros 2 modos
function virarCarta(carta) {
  if (!podeJogar || carta.classList.contains('virada')) return;
  
  carta.classList.add('virada');

  // Se for foto, mostra img. Se for icone, mostra o emoji
  if (carta.dataset.tipo === 'foto') {
    carta.innerHTML = `<img src="${carta.dataset.valor}" style="width:100%; height:100%; border-radius:8px; object-fit:cover;">`;
  } else {
    carta.innerHTML = carta.dataset.valor;
  }

  if (!primeiraCarta) {
    primeiraCarta = carta;
  } else {
    podeJogar = false;
    // Compara o valor das 2 cartas
    if (primeiraCarta.dataset.valor === carta.dataset.valor) {
      // Acertou
      primeiraCarta = null;
      podeJogar = true;
    } else {
      // Errou - vira de volta
      setTimeout(() => {
        primeiraCarta.innerHTML = '?';
        carta.innerHTML = '?';
        primeiraCarta.classList.remove('virada');
        carta.classList.remove('virada');
        primeiraCarta = null;
        podeJogar = true;
      }, 1000);
    }
  }
}

// Evento do botão Modo Ícones
document.getElementById('btn-icones').onclick = criarTabuleiro;

// Evento do Upload de Fotos
document.getElementById('upload-fotos').onchange = (e) => {
  const arquivos = Array.from(e.target.files);
  
  if (arquivos.length !== 6) {
    alert("Selecione exatamente 6 fotos, Guardião!");
    return;
  }

  let urlsFotos = [];
  let fotosCarregadas = 0;

  arquivos.forEach(arquivo => {
    const leitor = new FileReader();
    leitor.onload = (event) => {
      urlsFotos.push(event.target.result);
      fotosCarregadas++;
      
      // Quando as 6 fotos carregarem
      if (fotosCarregadas === 6) {
        criarTabuleiroComFotos(urlsFotos);
      }
    }
    leitor.readAsDataURL(arquivo);
  });
}

// Já inicia no modo ícones
criarTabuleiro();