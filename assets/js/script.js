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



/* ===================================================
   CONTROLE
=================================================== */

let homenagemAberta =
    false;


let musicaTocando =
    false;



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
           PARA O INÍCIO DA HOMENAGEM
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
           SE A MÚSICA JÁ TERMINOU
           VOLTA PARA O INÍCIO
        ========================================== */

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
   EVENTO PLAY
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
   EVENTO PAUSE
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
   QUANDO A MÚSICA TERMINAR
=================================================== */

musica.addEventListener(

    "ended",

    function () {


        /* =========================================
           GARANTE QUE FIQUE PARADA
        ========================================== */

        musica.pause();



        /* =========================================
           VOLTA O ÁUDIO PARA O INÍCIO
           SEM REPRODUZIR NOVAMENTE
        ========================================== */

        musica.currentTime =
            0;



        /* =========================================
           ATUALIZA CONTROLE
        ========================================== */

        musicaTocando =
            false;


        atualizarBotaoMusica();


    }

);



/* ===================================================
   ESTADO INICIAL
=================================================== */

atualizarBotaoMusica();
