(function () {
    const visualizador = document.getElementById("image-viewer");
    const imagemAmpliada = visualizador.querySelector(".image-viewer-image");
    const botaoFechar = visualizador.querySelector(".image-viewer-close");

    if (!visualizador || !imagemAmpliada || !botaoFechar) return;

    // abrir imagem
    document.querySelectorAll("[data-image-view]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const imagem = link.querySelector("img");

            imagemAmpliada.src = link.href;
            imagemAmpliada.alt = imagem ? imagem.alt : "";

            visualizador.showModal();
        });
    });

    // fechar pelo botao
    botaoFechar.addEventListener("click", function () {
        visualizador.close();
    });

    // fechar clicando fora da imagem
    visualizador.addEventListener("click", function (event) {
        if (event.target === visualizador) {
            visualizador.close();
        }
    });

})();