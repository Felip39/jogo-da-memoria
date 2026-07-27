// ================= CAPTURA DOS COMPONENTES DE TELA ================= 
const inputPhone = document.getElementById('phone-signup');  
const formSignup = document.getElementById('form-signup'); 
const formSignin = document.getElementById('form-signin'); 

// ================= COMPORTAMENTO DAS MÁSCARAS DE INPUT ================= 
inputPhone.addEventListener('input', (e) => { 
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 0) value = "(" + value; 
    if (value.length > 3) value = value.slice(0, 3) + ") " + value.slice(3); 
    if (value.length > 10) value = value.slice(0, 10) + "-" + value.slice(10, 14); 
    e.target.value = value; 
});  

// ================= GESTÃO DE TRANSIÇÃO E ACESSO ================= 
function transicionarParaOJogo(nomeDoJogador) { 
    console.log(`Bem-vindo, Guardião! Acessando como: ${nomeDoJogador}`); 
    // Esconde a div do Login e mostra a div do Jogo 
    document.getElementById('container-autenticacao').style.display = 'none'; 
    document.getElementById('container-jogo').style.display = 'block'; 
    // Inicia e gera o tabuleiro 
    criarTabuleiro(); 
} 

// Evento de envio do cadastro (Simulação livre) 
formSignup.addEventListener('submit', (e) => { 
    e.preventDefault(); 
    if (e.target.checkValidity()) { 
        const nome = document.getElementById('name-signup').value; 
        console.log(`Sucesso! Cadastro efetuado para: ${nome}. Clique na aba LOGAR para entrar.`); 
        formSignup.reset(); 
    } 
}); 

// Evento de envio do login (Aceita qualquer e-mail/senha digitados) 
formSignin.addEventListener('submit', (e) => { 
    e.preventDefault(); 
    if (e.target.checkValidity()) { 
        const email = document.getElementById('email-signin').value; 
        const apelido = email.split('@')[0]; // Pega a primeira parte antes do arroba (@) 
        transicionarParaOJogo(apelido); 
        formSignin.reset(); 
    } 
}); 

// Evento do Botão Entrar como Convidado (Pula totalmente a verificação) 
document.getElementById('btn-guest').addEventListener('click', () => { 
    transicionarParaOJogo('Convidado'); 
}); 


// ================= REGRAS DO JOGO DA MEMÓRIA ================= 
// CORRIGIDO: O coração agora é apenas o emoji puro '❤️' sem códigos de internet
const icones = ['❤️', '⭐', '🔥', '💻', '🎮', '🧙']; 
let cartas = []; 
let primeiraCarta = null; 
let podeJogar = true; 

// VARIÁVEIS PARA CONTROLO DO BOTÃO DE REINICIAR
let paresEncontrados = 0;
let modoAtual = 'icone'; 
let fotosGuardadas = []; 

function embaralhar(array) { 
    return array.sort(() => Math.random() - 0.5); 
} 

function ocultarBotaoReiniciar() {
    const btn = document.getElementById('btn-reiniciar');
    if (btn) btn.style.display = 'none';
}

function mostrarBotaoReiniciar() {
    const btn = document.getElementById('btn-reiniciar');
    if (btn) btn.style.display = 'inline-block';
}

function criarTabuleiro() { 
    modoAtual = 'icone';
    ocultarBotaoReiniciar();
    paresEncontrados = 0; 

    const tabuleiro = document.getElementById('tabuleiro'); 
    tabuleiro.innerHTML = ''; 
    primeiraCarta = null; 
    podeJogar = true; 
    cartas = [...icones, ...icones]; 
    
    embaralhar(cartas).forEach(icone => { 
        const carta = document.createElement('div'); 
        carta.classList.add('carta'); 
        carta.dataset.tipo = 'icone'; 
        carta.dataset.valor = icone; // CORRIGIDO: Atribui o emoji puro direto
        carta.innerHTML = '?'; 
        carta.onclick = () => virarCarta(carta); 
        tabuleiro.appendChild(carta); 
    }); 
} 

function criarTabuleiroComFotos(urlsFotos) { 
    modoAtual = 'foto';
    fotosGuardadas = urlsFotos; 
    ocultarBotaoReiniciar();
    paresEncontrados = 0; 

    const tabuleiro = document.getElementById('tabuleiro'); 
    tabuleiro.innerHTML = ''; 
    primeiraCarta = null; 
    podeJogar = true; 
    cartas = [...urlsFotos, ...urlsFotos]; 
    
    embaralhar(cartas).forEach(url => { 
        const carta = document.createElement('div'); 
        carta.classList.add('carta'); 
        carta.dataset.tipo = 'foto'; 
        carta.dataset.valor = url; 
        carta.innerHTML = '?'; 
        carta.onclick = () => virarCarta(carta); 
        tabuleiro.appendChild(carta); 
    }); 
} 

function virarCarta(carta) { 
    if (!podeJogar || carta.classList.contains('virada')) return; 
    carta.classList.add('virada'); 
    
    if (carta.dataset.tipo === 'foto') { 
        carta.innerHTML = `<img src="${carta.dataset.valor}" style="width:100%; height:100%; border-radius:8px; object-fit:cover;">`; 
    } else { 
        carta.innerHTML = carta.dataset.valor; 
    } 
    
    if (!primeiraCarta) { 
        primeiraCarta = carta; 
    } else { 
        podeJogar = false; 
        
        if (primeiraCarta.dataset.valor === carta.dataset.valor) { 
            primeiraCarta = null; 
            podeJogar = true; 
            paresEncontrados++;

            if (paresEncontrados === 6) {
                setTimeout(() => {
                    console.log("Parabéns, Guardião! Encontrou todos os pares! 🎉");
                    mostrarBotaoReiniciar(); 
                }, 500);
            }
        } else { 
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

document.getElementById('btn-icones').onclick = criarTabuleiro; 

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
            if (fotosCarregadas === 6) { 
                criarTabuleiroComFotos(urlsFotos); 
            } 
        } 
        leitor.readAsDataURL(arquivo); 
    }); 
}

// EXECUÇÃO DO CLIQUE NO BOTÃO DE REINICIAR
const btnReiniciarElemento = document.getElementById('btn-reiniciar');
if (btnReiniciarElemento) {
    btnReiniciarElemento.onclick = () => {
        if (modoAtual === 'icone') {
            criarTabuleiro(); 
        } else if (modoAtual === 'foto') {
            criarTabuleiroComFotos(fotosGuardadas); 
        }
    };
}
