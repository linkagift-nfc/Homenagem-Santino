/* ===================================================
   HOMENAGEM SANTINO
   SCRIPT.JS
=================================================== */


/* ===================================================
   ELEMENTOS
=================================================== */

const btnAbrir =
document.getElementById(
    "btnAbrir"
);


const conteudoHomenagem =
document.getElementById(
    "conteudoHomenagem"
);


const musica =
document.getElementById(
    "musica"
);


const btnMusica =
document.getElementById(
    "btnMusica"
);


const telaInicial =
document.getElementById(
    "telaInicial"
);


const particulas =
document.getElementById(
    "particulas"
);


const cartaFinal =
document.getElementById(
    "cartaFinal"
);


const btnFecharCarta =
document.getElementById(
    "btnFecharCarta"
);


const equalizador =
document.getElementById(
    "equalizador"
);


const barrasEqualizador =
document.querySelectorAll(
    ".equalizador .barra"
);



/* ===================================================
   CONTROLE GERAL
=================================================== */

let homenagemAberta =
    false;


let musicaTocando =
    false;


let cartaJaExibida =
    false;



/* ===================================================
   CONTROLE DO WAKE LOCK
   MANTER A TELA DO CELULAR ACESA
=================================================== */

let wakeLock =
    null;



/* ===================================================
   SOLICITAR WAKE LOCK
=================================================== */

async function manterTelaAcesa() {


    /* =========================================
       VERIFICAR SE O NAVEGADOR SUPORTA
    ========================================== */

    if (
        !("wakeLock" in navigator)
    ) {


        console.log(
            "Wake Lock não disponível neste navegador."
        );


        return;

    }



    /* =========================================
       SÓ SOLICITAR SE A PÁGINA ESTIVER VISÍVEL
    ========================================== */

    if (
        document.visibilityState !== "visible"
    ) {


        return;

    }



    /* =========================================
       EVITAR CRIAR OUTRO WAKE LOCK
       SE JÁ EXISTIR UM ATIVO
    ========================================== */

    if (
        wakeLock &&
        !wakeLock.released
    ) {


        return;

    }



    try {


        wakeLock =
            await navigator.wakeLock.request(
                "screen"
            );



        console.log(
            "Tela mantida ativa durante a homenagem."
        );



        /* =========================================
           SE O SISTEMA LIBERAR O WAKE LOCK
        ========================================== */

        wakeLock.addEventListener(

            "release",

            function () {


                console.log(
                    "Wake Lock liberado pelo sistema."
                );


            }

        );


    }

    catch (
        erro
    ) {


        console.log(
            "Não foi possível manter a tela ativa.",
            erro
        );


    }


}



/* ===================================================
   QUANDO O USUÁRIO VOLTAR PARA A PÁGINA
=================================================== */

document.addEventListener(

    "visibilitychange",

    async function () {


        if (
            document.visibilityState === "visible" &&
            homenagemAberta
        ) {


            await manterTelaAcesa();


        }


    }

);



/* ===================================================
   CONTROLE DO ANALISADOR DE ÁUDIO
=================================================== */

let audioContext =
    null;


let analisador =
    null;


let fonteAudio =
    null;


let dadosFrequencia =
    null;


let animacaoEqualizador =
    null;


let audioConfigurado =
    false;



/* ===================================================
   CRIAR PARTÍCULAS DOURADAS
=================================================== */

function criarParticulas() {


    if (
        !particulas
    ) {


        return;


    }



    const quantidade =
        30;



    for (
        let i = 0;
        i < quantidade;
        i++
    ) {


        const particula =
            document.createElement(
                "span"
            );



        particula.classList.add(
            "particula"
        );



        /* POSIÇÃO HORIZONTAL */

        const esquerda =
            Math.random() * 100;



        /* POSIÇÃO VERTICAL */

        const topo =
            Math.random() * 100;



        /* TAMANHO */

        const tamanho =
            2 +
            Math.random() * 4;



        /* VELOCIDADE */

        const duracao =
            7 +
            Math.random() * 9;



        /* ATRASO */

        const atraso =
            Math.random() * 10;



        /* OPACIDADE */

        const opacidade =
            0.15 +
            Math.random() * 0.42;



        particula.style.left =
            esquerda + "%";


        particula.style.top =
            topo + "%";


        particula.style.width =
            tamanho + "px";


        particula.style.height =
            tamanho + "px";


        particula.style.animationDuration =
            duracao + "s";


        particula.style.animationDelay =
            "-" + atraso + "s";


        particula.style.opacity =
            opacidade;



        particulas.appendChild(
            particula
        );


    }


}



/* ===================================================
   CRIAR PARTÍCULAS AO CARREGAR
=================================================== */

criarParticulas();



/* ===================================================
   CONFIGURAR WEB AUDIO API
=================================================== */

function configurarAudioContext() {


    if (
        audioConfigurado
    ) {


        return;


    }



    try {


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;



        if (
            !AudioContext
        ) {


            console.log(
                "Web Audio API não disponível neste navegador."
            );


            return;


        }



        /* =========================================
           CRIAR CONTEXTO
        ========================================== */

        audioContext =
            new AudioContext();



        /* =========================================
           USAR O MP3 COMO FONTE
        ========================================== */

        fonteAudio =
            audioContext
                .createMediaElementSource(
                    musica
                );



        /* =========================================
           CRIAR ANALISADOR
        ========================================== */

        analisador =
            audioContext
                .createAnalyser();



        analisador.fftSize =
            256;


        analisador.smoothingTimeConstant =
            0.82;



        dadosFrequencia =
            new Uint8Array(
                analisador.frequencyBinCount
            );



        /* =========================================
           ÁUDIO
             ↓
           ANALISADOR
             ↓
           ALTO-FALANTE
        ========================================== */

        fonteAudio
            .connect(
                analisador
            );


        analisador
            .connect(
                audioContext.destination
            );



        audioConfigurado =
            true;


    }

    catch (
        erro
    ) {


        console.log(
            "Não foi possível configurar o analisador.",
            erro
        );


    }


}



/* ===================================================
   ATIVAR CONTEXTO DE ÁUDIO
=================================================== */

async function ativarAudioContext() {


    configurarAudioContext();



    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {


        try {


            await audioContext.resume();


        }

        catch (
            erro
        ) {


            console.log(
                "Não foi possível ativar o contexto de áudio.",
                erro
            );


        }


    }


}



/* ===================================================
   ANIMAR EQUALIZADOR REAL
=================================================== */

function animarEqualizador() {


    if (
        !analisador ||
        !dadosFrequencia
    ) {


        return;


    }



    /* =========================================
       LER FREQUÊNCIAS DO MP3
    ========================================== */

    analisador.getByteFrequencyData(
        dadosFrequencia
    );



    const quantidadeBarras =
        barrasEqualizador.length;



    /*
       Usamos principalmente graves e médios
       para o movimento ficar mais musical.
    */

    const inicio =
        2;


    const fim =
        Math.min(
            55,
            dadosFrequencia.length - 1
        );


    const faixa =
        fim - inicio;



    barrasEqualizador.forEach(

        function (
            barra,
            indice
        ) {


            const posicao =
                Math.floor(

                    inicio +

                    (
                        faixa /
                        quantidadeBarras
                    ) *

                    indice

                );



            const valor =
                dadosFrequencia[
                    posicao
                ];



            /* =====================================
               TRANSFORMAR FREQUÊNCIA EM ALTURA
            ====================================== */

            let altura =
                5 +
                (
                    valor /
                    255
                ) *
                34;



            /* =====================================
               BARRA CENTRAL MAIS DESTACADA
            ====================================== */

            if (
                indice === 3
            ) {


                altura *=
                    1.10;


            }



            /* =====================================
               LATERAIS MAIS SUAVES
            ====================================== */

            if (
                indice === 0 ||
                indice === 6
            ) {


                altura *=
                    0.86;


            }



            /* =====================================
               LIMITES
            ====================================== */

            altura =
                Math.max(

                    5,

                    Math.min(
                        42,
                        altura
                    )

                );



            barra.style.height =
                altura + "px";


        }

    );



    animacaoEqualizador =
        requestAnimationFrame(
            animarEqualizador
        );


}



/* ===================================================
   INICIAR EQUALIZADOR
=================================================== */

function iniciarEqualizador() {


    if (
        !equalizador
    ) {


        return;


    }



    equalizador
        .classList
        .add(
            "tocando"
        );



    if (
        animacaoEqualizador
    ) {


        cancelAnimationFrame(
            animacaoEqualizador
        );


    }



    animarEqualizador();


}



/* ===================================================
   PARAR EQUALIZADOR
=================================================== */

function pararEqualizador() {


    if (
        animacaoEqualizador
    ) {


        cancelAnimationFrame(
            animacaoEqualizador
        );


        animacaoEqualizador =
            null;


    }



    if (
        equalizador
    ) {


        equalizador
            .classList
            .remove(
                "tocando"
            );


    }



    /* =========================================
       POSIÇÃO DE REPOUSO DAS 7 BARRAS
    ========================================== */

    const alturasParadas = [

        5,
        8,
        11,
        14,
        11,
        8,
        5

    ];



    barrasEqualizador.forEach(

        function (
            barra,
            indice
        ) {


            barra.style.height =
                alturasParadas[
                    indice
                ] + "px";


        }

    );


}



/* ===================================================
   ABRIR HOMENAGEM
=================================================== */

btnAbrir.addEventListener(

    "click",

    async function () {


        if (
            homenagemAberta
        ) {


            return;


        }



        homenagemAberta =
            true;



        /* =========================================
           MANTER TELA DO CELULAR ACESA
        ========================================== */

        await manterTelaAcesa();



        /* =========================================
           ATIVAR ANALISADOR DE ÁUDIO
        ========================================== */

        await ativarAudioContext();



        /* =========================================
           EFEITO NA FOTO
        ========================================== */

        telaInicial
            .classList
            .add(
                "abrindo"
            );



        /* =========================================
           MOSTRAR SEGUNDA PARTE
        ========================================== */

        conteudoHomenagem
            .classList
            .add(
                "ativo"
            );



        /* =========================================
           ALTERAR BOTÃO
        ========================================== */

        btnAbrir.innerHTML = `

            <span>
                ♥
            </span>

            <span>
                HOMENAGEM ABERTA
            </span>

        `;



        btnAbrir.disabled =
            true;



        /* =========================================
           INICIAR MÚSICA
        ========================================== */

        iniciarMusica();



        /* =========================================
           ROLAR SUAVEMENTE PARA A HOMENAGEM
        ========================================== */

        setTimeout(

            function () {


                conteudoHomenagem
                    .scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });


            },

            700

        );


    }

);



/* ===================================================
   INICIAR / CONTINUAR MÚSICA
=================================================== */

async function iniciarMusica() {


    try {


        /* =========================================
           GARANTIR TELA ACESA
        ========================================== */

        await manterTelaAcesa();



        /* =========================================
           GARANTIR WEB AUDIO ATIVO
        ========================================== */

        await ativarAudioContext();



        /* =========================================
           VOLUME
        ========================================== */

        musica.volume =
            0.65;



        /* =========================================
           SE A MÚSICA JÁ TERMINOU
           VOLTAR AO INÍCIO
        ========================================== */

        if (
            musica.ended
        ) {


            musica.currentTime =
                0;


        }



        /* =========================================
           TOCAR
        ========================================== */

        await musica.play();



        musicaTocando =
            true;



        atualizarBotaoMusica();



        iniciarEqualizador();


    }

    catch (
        erro
    ) {


        console.log(

            "O navegador não iniciou o áudio automaticamente.",

            erro

        );



        musicaTocando =
            false;



        atualizarBotaoMusica();



        pararEqualizador();


    }


}



/* ===================================================
   PAUSAR MÚSICA
=================================================== */

function pausarMusica() {


    musica.pause();



    musicaTocando =
        false;



    atualizarBotaoMusica();



    pararEqualizador();


}



/* ===================================================
   BOTÃO PLAY / PAUSE
=================================================== */

btnMusica.addEventListener(

    "click",

    async function () {


        if (
            musicaTocando
        ) {


            pausarMusica();


        }

        else {


            await iniciarMusica();


        }


    }

);



/* ===================================================
   ATUALIZAR BOTÃO DA MÚSICA
=================================================== */

function atualizarBotaoMusica() {


    if (
        musicaTocando
    ) {


        btnMusica.innerHTML =
            "❚❚";


        btnMusica.setAttribute(

            "aria-label",

            "Pausar música"

        );


    }

    else {


        btnMusica.innerHTML =
            "▶";


        btnMusica.setAttribute(

            "aria-label",

            "Reproduzir música"

        );


    }


}



/* ===================================================
   EVENTO PLAY
=================================================== */

musica.addEventListener(

    "play",

    function () {


        musicaTocando =
            true;



        atualizarBotaoMusica();



        iniciarEqualizador();


    }

);



/* ===================================================
   EVENTO PAUSE
=================================================== */

musica.addEventListener(

    "pause",

    function () {


        musicaTocando =
            false;



        atualizarBotaoMusica();



        pararEqualizador();


    }

);



/* ===================================================
   QUANDO A MÚSICA TERMINAR NATURALMENTE
=================================================== */

musica.addEventListener(

    "ended",

    function () {


        /* =========================================
           MARCAR COMO PARADA
        ========================================== */

        musicaTocando =
            false;



        /* =========================================
           ATUALIZAR BOTÃO
        ========================================== */

        atualizarBotaoMusica();



        /* =========================================
           PARAR EQUALIZADOR
        ========================================== */

        pararEqualizador();



        /* =========================================
           VOLTAR MP3 AO INÍCIO
           SEM TOCAR NOVAMENTE
        ========================================== */

        musica.currentTime =
            0;



        /* =========================================
           MOSTRAR CARTA FINAL
           APENAS UMA VEZ AUTOMATICAMENTE
        ========================================== */

        if (
            !cartaJaExibida
        ) {


            cartaJaExibida =
                true;



            setTimeout(

                function () {


                    mostrarCartaFinal();


                },

                900

            );


        }


    }

);



/* ===================================================
   MOSTRAR CARTA FINAL
=================================================== */

function mostrarCartaFinal() {


    if (
        !cartaFinal
    ) {


        return;


    }



    /* =========================================
       GARANTIR QUE A TELA CONTINUE ACESA
       ENQUANTO A CARTA ESTIVER ABERTA
    ========================================== */

    manterTelaAcesa();



    cartaFinal
        .classList
        .add(
            "ativa"
        );



    cartaFinal.setAttribute(
        "aria-hidden",
        "false"
    );



    document.body
        .classList
        .add(
            "carta-aberta"
        );



    /* =========================================
       FOCO NO BOTÃO DA CARTA
    ========================================== */

    setTimeout(

        function () {


            btnFecharCarta.focus();


        },

        650

    );


}



/* ===================================================
   FECHAR CARTA
=================================================== */

function fecharCartaFinal() {


    cartaFinal
        .classList
        .remove(
            "ativa"
        );



    cartaFinal.setAttribute(
        "aria-hidden",
        "true"
    );



    document.body
        .classList
        .remove(
            "carta-aberta"
        );


}



/* ===================================================
   BOTÃO FECHAR CARTA
=================================================== */

btnFecharCarta.addEventListener(

    "click",

    function () {


        fecharCartaFinal();


    }

);



/* ===================================================
   FECHAR CARTA CLICANDO FORA
=================================================== */

cartaFinal.addEventListener(

    "click",

    function (
        evento
    ) {


        if (
            evento.target === cartaFinal
        ) {


            fecharCartaFinal();


        }


    }

);



/* ===================================================
   FECHAR CARTA COM ESC
=================================================== */

document.addEventListener(

    "keydown",

    function (
        evento
    ) {


        if (
            evento.key === "Escape" &&
            cartaFinal.classList.contains(
                "ativa"
            )
        ) {


            fecharCartaFinal();


        }


    }

);



/* ===================================================
   ESTADO INICIAL
=================================================== */

atualizarBotaoMusica();


pararEqualizador();
