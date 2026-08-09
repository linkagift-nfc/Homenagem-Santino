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
   CONTROLE
=================================================== */

let homenagemAberta =
    false;


let musicaTocando =
    false;


let cartaJaExibida =
    false;



/* ===================================================
   WAKE LOCK
=================================================== */

let wakeLock =
    null;



async function manterTelaAcesa() {


    if (
        !("wakeLock" in navigator)
    ) {

        console.log(
            "Wake Lock não disponível."
        );

        return;

    }


    if (
        document.visibilityState !== "visible"
    ) {

        return;

    }


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
            "Tela mantida ativa."
        );


    }

    catch (
        erro
    ) {


        console.log(
            "Não foi possível manter a tela ligada.",
            erro
        );


    }


}



/* ===================================================
   REATIVAR WAKE LOCK
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
   WEB AUDIO
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
   PARTÍCULAS
=================================================== */

function criarParticulas() {


    if (
        !particulas
    ) {

        return;

    }


    const quantidade =
        34;


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


        particula.style.left =
            Math.random() * 100 + "%";


        particula.style.top =
            Math.random() * 100 + "%";


        const tamanho =
            2 +
            Math.random() * 4;


        particula.style.width =
            tamanho + "px";


        particula.style.height =
            tamanho + "px";


        particula.style.animationDuration =
            7 +
            Math.random() * 9 +
            "s";


        particula.style.animationDelay =
            "-" +
            Math.random() * 10 +
            "s";


        particula.style.opacity =
            0.15 +
            Math.random() * 0.42;


        particulas.appendChild(
            particula
        );


    }


}


criarParticulas();



/* ===================================================
   CONFIGURAR ÁUDIO
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

            return;

        }


        audioContext =
            new AudioContext();


        fonteAudio =
            audioContext
                .createMediaElementSource(
                    musica
                );


        analisador =
            audioContext
                .createAnalyser();


        /* MAIS DETALHE NO EQUALIZADOR */

        analisador.fftSize =
            512;


        analisador.smoothingTimeConstant =
            0.68;


        dadosFrequencia =
            new Uint8Array(
                analisador.frequencyBinCount
            );


        fonteAudio.connect(
            analisador
        );


        analisador.connect(
            audioContext.destination
        );


        audioConfigurado =
            true;


    }

    catch (
        erro
    ) {


        console.log(
            "Erro ao configurar analisador.",
            erro
        );


    }


}



/* ===================================================
   ATIVAR CONTEXTO
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
                erro
            );


        }


    }


}



/* ===================================================
   ANIMAR EQUALIZADOR
=================================================== */

function animarEqualizador() {


    if (
        !analisador ||
        !dadosFrequencia
    ) {

        return;

    }


    analisador.getByteFrequencyData(
        dadosFrequencia
    );


    const quantidadeBarras =
        barrasEqualizador.length;



    /*
       Graves e médios.
       Essa faixa cria movimentos mais fortes.
    */

    const inicio =
        2;


    const fim =
        Math.min(
            90,
            dadosFrequencia.length - 1
        );


    const faixa =
        fim - inicio;



    barrasEqualizador.forEach(

        function (
            barra,
            indice
        ) {


            let posicao =
                Math.floor(

                    inicio +

                    (
                        faixa /
                        quantidadeBarras
                    ) *

                    indice

                );


            let valor =
                dadosFrequencia[
                    posicao
                ];



            /* =====================================
               REFORÇAR GRAVES
            ====================================== */

            if (
                indice >= 3 &&
                indice <= 7
            ) {


                valor *=
                    1.22;


            }



            /* =====================================
               CENTRO MAIS FORTE
            ====================================== */

            if (
                indice === 5
            ) {


                valor *=
                    1.18;


            }



            /* =====================================
               CONVERTER EM ALTURA
            ====================================== */

            let altura =
                5 +
                (
                    valor /
                    255
                ) *
                58;



            /* =====================================
               LATERAIS UM POUCO MENORES
            ====================================== */

            if (
                indice === 0 ||
                indice === 10
            ) {


                altura *=
                    0.68;


            }


            else if (
                indice === 1 ||
                indice === 9
            ) {


                altura *=
                    0.82;


            }



            /* =====================================
               LIMITES
            ====================================== */

            altura =
                Math.max(
                    5,
                    Math.min(
                        64,
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


    equalizador
        .classList
        .remove(
            "tocando"
        );



    const alturas = [

        5,
        7,
        10,
        13,
        16,
        20,
        16,
        13,
        10,
        7,
        5

    ];



    barrasEqualizador.forEach(

        function (
            barra,
            indice
        ) {


            barra.style.height =
                alturas[
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


        await manterTelaAcesa();


        await ativarAudioContext();



        telaInicial
            .classList
            .add(
                "abrindo"
            );



        conteudoHomenagem
            .classList
            .add(
                "ativo"
            );



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



        iniciarMusica();



        /* =========================================
           ROLAR EXATAMENTE PARA SEGUNDA TELA
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

            650

        );


    }

);



/* ===================================================
   INICIAR MÚSICA
=================================================== */

async function iniciarMusica() {


    try {


        await manterTelaAcesa();


        await ativarAudioContext();


        musica.volume =
            0.65;



        if (
            musica.ended
        ) {


            musica.currentTime =
                0;


        }



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
            "Não foi possível iniciar o áudio.",
            erro
        );


        musicaTocando =
            false;


        atualizarBotaoMusica();


        pararEqualizador();


    }


}



/* ===================================================
   PAUSAR
=================================================== */

function pausarMusica() {


    musica.pause();


    musicaTocando =
        false;


    atualizarBotaoMusica();


    pararEqualizador();


}



/* ===================================================
   BOTÃO DA MÚSICA
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
   BOTÃO PLAY / PAUSE
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
   PLAY
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
   PAUSE
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
   FIM DA MÚSICA
=================================================== */

musica.addEventListener(

    "ended",

    function () {


        musicaTocando =
            false;


        atualizarBotaoMusica();


        pararEqualizador();



        musica.currentTime =
            0;



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
   MOSTRAR CARTA
=================================================== */

function mostrarCartaFinal() {


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
   CLICAR FORA
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
   ESC
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
