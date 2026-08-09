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


    }

    catch (
        erro
    ) {


        console.log(
            "Wake Lock não disponível.",
            erro
        );


    }


}



/* ===================================================
   REATIVAR TELA ACESA
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
   CONFIGURAR ANALISADOR
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


        analisador.fftSize =
            512;


        analisador.smoothingTimeConstant =
            0.60;


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
   EQUALIZADOR REAL
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


    const totalBarras =
        barrasEqualizador.length;


    /*
       Utiliza principalmente graves
       e médios da música.
    */

    const inicio =
        2;


    const fim =
        Math.min(
            110,
            dadosFrequencia.length - 1
        );


    const faixa =
        fim - inicio;



    barrasEqualizador.forEach(

        function (
            barra,
            indice
        ) {


            const porcentagem =
                indice /
                (
                    totalBarras - 1
                );


            const posicao =
                Math.floor(

                    inicio +

                    porcentagem *
                    faixa

                );


            let valor =
                dadosFrequencia[
                    posicao
                ];



            /* =====================================
               REFORÇO MUSICAL
            ====================================== */

            if (
                indice >= 4 &&
                indice <= 11
            ) {


                valor *=
                    1.15;


            }



            /* =====================================
               MOVIMENTO VISUAL
            ====================================== */

            let altura =
                4 +
                (
                    valor /
                    255
                ) *
                34;



            /* =====================================
               LATERAIS MAIS CURTAS
            ====================================== */

            const distanciaCentro =
                Math.abs(
                    indice -
                    (
                        totalBarras - 1
                    ) / 2
                );


            const fator =
                1 -
                (
                    distanciaCentro /
                    totalBarras
                ) *
                0.35;


            altura *=
                fator;



            altura =
                Math.max(
                    4,
                    Math.min(
                        38,
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



    const alturas = [

        4,
        5,
        7,
        9,

        12,
        9,
        6,
        4,

        4,
        6,
        9,
        12,

        9,
        7,
        5,
        4

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
           IR PARA SEGUNDA TELA
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
   ATUALIZAR BOTÃO
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
   BOTÃO FECHAR
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
