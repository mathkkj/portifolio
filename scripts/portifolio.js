
document.addEventListener("DOMContentLoaded", function () {

    const botoes = document.querySelectorAll("[data-project-open]");

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const duracaoAnimacao = movimentoReduzido ? 0 : 450;

    // abrir janela
    function abrirDialog(dialog) {

        if (dialog.open) {
            return;
        }

        dialog.classList.remove("is-closing");

        dialog.showModal();

        // espera o navegador renderizar o estado inicial
        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                dialog.classList.add("is-visible");

                // redimensiona o grafico depois da abertura
                requestAnimationFrame(function () {

                    if (window.graficoRogueNave) {
                        window.graficoRogueNave.resize();
                    }

                });

            });

        });

    }


    // fechar janela com animacao
    function fecharDialog(dialog) {

        if (!dialog.open || dialog.classList.contains("is-closing")) {
            return;
        }

        dialog.classList.remove("is-visible");
        dialog.classList.add("is-closing");

        // espera o fade out terminar
        setTimeout(function () {

            if (dialog.open) {
                dialog.close();
            }

            dialog.classList.remove("is-closing");

        }, duracaoAnimacao);

    }


    // configurar cada projeto
    botoes.forEach(function (botao) {

        const idDialog = botao.dataset.projectOpen;
        const dialog = document.getElementById(idDialog);

        const videoPreview = botao.querySelector(
            ".project-tile-video"
        );

        if (!dialog) {
            console.error("Dialog nao encontrado:", idDialog);
            return;
        }

        let previewCarregado = false;


        // clique no card
        botao.addEventListener("click", function () {

            if (videoPreview) {
                videoPreview.pause();
            }

            abrirDialog(dialog);

        });


        // botao fechar
        const botaoFechar = dialog.querySelector("[data-dialog-close]");

        if (botaoFechar) {

            botaoFechar.addEventListener("click", function () {
                fecharDialog(dialog);
            });

        }


        // tecla ESC
        dialog.addEventListener("cancel", function (evento) {

            evento.preventDefault();
            fecharDialog(dialog);

        });


        // clique fora da janela
        dialog.addEventListener("click", function (evento) {

            if (evento.target === dialog) {
                fecharDialog(dialog);
            }

        });


        // ao terminar de fechar
        dialog.addEventListener("close", function () {

            dialog.querySelectorAll("video").forEach(function (video) {

                video.pause();

                if (video.readyState > 0) {
                    video.currentTime = 0;
                }

            });

            if (videoPreview) {
                videoPreview.pause();
                videoPreview.currentTime = 0;
            }

            botao.focus();

        });


        // preview do card
        if (videoPreview) {

            videoPreview.addEventListener("error", function () {

                botao.closest(".project-tile")
                    ?.classList.add("no-preview-video");

            });


            botao.addEventListener("pointerenter", async function () {

                const temHover = window.matchMedia(
                    "(hover: hover) and (pointer: fine)"
                ).matches;

                if (!temHover || movimentoReduzido) {
                    return;
                }

                if (!previewCarregado) {

                    if (!videoPreview.dataset.src) {
                        return;
                    }

                    videoPreview.src = videoPreview.dataset.src;
                    videoPreview.load();

                    previewCarregado = true;

                }

                try {

                    await videoPreview.play();

                } catch (erro) {

                    botao.closest(".project-tile")
                        ?.classList.add("no-preview-video");

                }

            });


            botao.addEventListener("pointerleave", function () {

                videoPreview.pause();

                if (videoPreview.readyState > 0) {
                    videoPreview.currentTime = 0;
                }

            });

        }

    });

});
