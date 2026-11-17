document.documentElement.classList.remove("site-loading");
document.documentElement.classList.add("site-ready");
(function () {

    const loader = document.getElementById("site-loader");

    if (!loader) {
        return;
    }

    function finalizarInicializacao() {

        // pequena pausa para a transicao visual
        setTimeout(function () {

            loader.classList.add("loader-hidden");

            // remove o elemento depois da animacao
            setTimeout(function () {
                loader.remove();
            }, 850);

        }, 300);

    }

    // pagina ja carregada
    if (document.readyState === "complete") {

        finalizarInicializacao();

    } else {

        // espera imagens, scripts e outros recursos
        window.addEventListener(
            "load",
            finalizarInicializacao,
            { once: true }
        );

    }

})();
