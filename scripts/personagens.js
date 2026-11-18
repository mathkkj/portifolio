
(function () {

    function iniciarPersonagens() {

        const personagens = document.querySelectorAll(
            ".floating-character"
        );

        if (personagens.length === 0) {
            return;
        }

        // animacao ao clicar nos personagens
        personagens.forEach(function (personagem) {

            const imagem = personagem.querySelector(":scope > img");

            if (!imagem) {
                return;
            }

            personagem.addEventListener("click", function () {

                imagem.classList.remove("click-tween");

                // reinicia a animacao para permitir cliques seguidos
                void imagem.offsetWidth;

                imagem.classList.add("click-tween");

            });

            imagem.addEventListener("animationend", function (evento) {

                if (evento.animationName === "character-click") {
                    imagem.classList.remove("click-tween");
                }

            });

        });

        // verifica se o usuario prefere movimento reduzido
        const movimentoReduzido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (movimentoReduzido) {
            return;
        }

        // movimento dos personagens seguindo o mouse
        let animacaoPendente = false;

        window.addEventListener("pointermove", function (evento) {

            // reage apenas ao mouse
            if (evento.pointerType !== "mouse") {
                return;
            }

            if (animacaoPendente) {
                return;
            }

            animacaoPendente = true;

            window.requestAnimationFrame(function () {

                const centroX = window.innerWidth / 2;
                const centroY = window.innerHeight / 2;

                // posicao relativa do mouse
                const mouseX = (evento.clientX - centroX) / centroX;
                const mouseY = (evento.clientY - centroY) / centroY;

                personagens.forEach(function (personagem) {

                    const profundidade = Number(
                        personagem.dataset.depth
                    ) || 0.5;

                    const deslocamentoX = mouseX * 16 * profundidade;
                    const deslocamentoY = mouseY * 16 * profundidade;

                    personagem.style.setProperty(
                        "--mouse-x",
                        deslocamentoX + "px"
                    );

                    personagem.style.setProperty(
                        "--mouse-y",
                        deslocamentoY + "px"
                    );

                });

                animacaoPendente = false;

            });

        });

        // retorna os personagens ao centro quando o mouse sai da janela
        document.addEventListener("mouseleave", function () {

            personagens.forEach(function (personagem) {

                personagem.style.setProperty("--mouse-x", "0px");
                personagem.style.setProperty("--mouse-y", "0px");

            });

        });

    }

    // garante que os elementos existam antes de iniciar
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarPersonagens
        );

    } else {

        iniciarPersonagens();

    }

    // destaque dos personagens ao tocar ou clicar

    document.querySelectorAll(".floating-character").forEach((personagem) => {

        let temporizador;

        personagem.addEventListener("pointerdown", () => {

            clearTimeout(temporizador);

            personagem.classList.add("is-highlighted");

        });

        function iniciarRetorno() {

            clearTimeout(temporizador);

            temporizador = setTimeout(() => {

                personagem.classList.remove("is-highlighted");

            }, 900);

        }

        personagem.addEventListener("pointerup", iniciarRetorno);
        personagem.addEventListener("pointercancel", iniciarRetorno);

    });

})();

VanillaTilt.init(
    document.querySelectorAll("[data-tilt]"),
    {
        max: 8,
        perspective: 1000,
        scale: 1.03,
        speed: 500,
        transition: true,
        glare: true,
        "max-glare": 0.15,
        gyroscope: false
    }
);
