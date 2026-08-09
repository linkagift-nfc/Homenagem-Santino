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



        const esquerda =
            Math.random() * 100;


        const topo =
            Math.random() * 100;


        const tamanho =
            2 +
            Math.random() * 4;


        const duracao =
            7 +
            Math.random() * 9;


        const atraso =
            Math.random() * 10;


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
   INICIAR PARTÍCULAS
=================================================== */

criarParticulas();



/* ===================================================
   ABRIR HOMENAGEM
=================================================== */

btnAbrir.addEventListener(

    "click",

    function () {


        if (
            homenagemAberta
        ) {

            return;

        }


        homenagemAberta =
            true;



        /* =========================================
           MARCAR PRIMEIRA TELA COMO ABERTA
        ========================================== */

        telaInicial
            .classList
            .add(
                "abrindo"
            );



        /* =========================================
           MOSTRAR CONTEÚDO
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
           ROLAR SUAVEMENTE
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
   INICIAR MÚSICA
=================================================== */

async function iniciarMusica() {


    try {


        musica.volume =
            0.65;



        /* =========================================
           SE CHEGOU AO FINAL
           E O USUÁRIO APERTA PLAY,
           COMEÇA NOVAMENTE
        ========================================== */

        if (
            musica.ended ||
            musica.currentTime >= musica.duration
        ) {


            musica.currentTime =
                0;


        }



        await musica.play();



        musicaTocando =
            true;



        atualizarBotaoMusica();


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


}



/* ===================================================
   BOTÃO DA MÚSICA
=================================================== */

btnMusica.addEventListener(

    "click",

    function () {


        if (
            musicaTocando
        ) {


            pausarMusica();


        }

        else {


            iniciarMusica();


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
   QUANDO O ÁUDIO COMEÇAR
=================================================== */

musica.addEventListener(

    "play",

    function () {


        musicaTocando =
            true;


        atualizarBotaoMusica();


    }

);



/* ===================================================
   QUANDO O ÁUDIO FOR PAUSADO
=================================================== */

musica.addEventListener(

    "pause",

    function () {


        musicaTocando =
            false;


        atualizarBotaoMusica();


    }

);



/* ===================================================
   QUANDO A MÚSICA TERMINAR NATURALMENTE
=================================================== */

musica.addEventListener(

    "ended",

    function () {


        /* =========================================
           MÚSICA TERMINOU
        ========================================== */

        musicaTocando =
            false;



        atualizarBotaoMusica();



        /* =========================================
           VOLTAR PARA O INÍCIO
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

                800

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
       FOCO NO BOTÃO PARA ACESSIBILIDADE
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
   FECHAR CLICANDO FORA DA CARTA
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
   FECHAR COM ESC
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
