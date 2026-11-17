
const botaoFoto = document.getElementById("about-photo-toggle");

if (botaoFoto) {

    const desenho = botaoFoto.querySelector(
        ".about-photo-image:first-child"
    );

    const fotoReal = botaoFoto.querySelector(
        ".about-photo-image:last-child"
    );

    botaoFoto.addEventListener("click", () => {

        const mostrandoDesenho = desenho.classList.contains("is-active");

        desenho.classList.toggle("is-active", !mostrandoDesenho);
        fotoReal.classList.toggle("is-active", mostrandoDesenho);

        botaoFoto.setAttribute("aria-pressed", mostrandoDesenho);

        botaoFoto.setAttribute(
            "aria-label",
            mostrandoDesenho
                ? "Mostrar meu desenho"
                : "Mostrar minha foto real"
        );

    });

}

// animacao de entrada da secao sobre mim

const secaoSobre = document.querySelector(".about-section");

if (secaoSobre) {

    const elementosSobre = secaoSobre.querySelectorAll(
        ".about-profile, .about-skills"
    );

    if ("IntersectionObserver" in window) {

        secaoSobre.classList.add("about-reveal-ready");

        const observadorSobre = new IntersectionObserver((entradas, observador) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("is-visible");

                    observador.unobserve(entrada.target);

                }

            });

        }, {
            threshold: 0.15
        });

        elementosSobre.forEach((elemento) => {
            observadorSobre.observe(elemento);
        });

    }

}