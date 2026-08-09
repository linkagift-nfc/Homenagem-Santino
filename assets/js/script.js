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


const fraseFundo =
document.getElementById(
    "fraseFundo"
);



/* ===================================================
   CONTROLE
=================================================== */

let homenagemAberta =
    false;


let musicaTocando =
    false;



/* ===================================================
   CRIAR POEIRA DOURADA
=================================================== */

function criarParticulas() {


    if (
        !particulas
    ) {

        return;

    }


    const quantidade =
        24;


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



        /* TEMPO DE ANIMAÇÃO */

        const duracao =
            5 +
            Math.random() * 7;



        /* ATRASO */

        const atraso =
            Math.random() * 6;



        /* OPACIDADE */

        const opacidade =
            0.18 +
            Math.random() * 0.50;



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
   EXECUTAR PARTÍCULAS
=================================================== */

criarParticulas();



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
           EFEITO DE DESPEDIDA DA PRIMEIRA TELA
        ========================================== */

        telaInicial.classList.add(
            "abrindo"
        );



        if (
            fraseFundo
        ) {

            fraseFundo.classList.add(
                "sumir"
            );

        }



        if (
            particulas
        ) {

            particulas.classList.add(
                "finalizar"
            );

        }



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
           ROLAR PARA HOMENAGEM
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

            750

        );



        /* =========================================
           REMOVER PARTÍCULAS APÓS EFEITO
        ========================================== */

        setTimeout(

            function () {


                if (
                    particulas
                ) {

                    particulas.innerHTML =
                        "";

                }


            },

            2400

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
           SE JÁ TERMINOU,
           RECOMEÇA SOMENTE SE USUÁRIO APERTAR PLAY
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


        musicaTocando =
            false;



        musica.pause();



        /* =========================================
           VOLTA PARA O INÍCIO,
           MAS NÃO TOCA NOVAMENTE
        ========================================== */

        musica.currentTime =
            0;



        atualizarBotaoMusica();


    }

);



/* ===================================================
   ESTADO INICIAL
=================================================== */

atualizarBotaoMusica();
