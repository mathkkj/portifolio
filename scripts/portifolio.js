
        document.addEventListener("DOMContentLoaded", function () {

            const botoes = document.querySelectorAll("[data-project-open]");

            botoes.forEach(function (botao) {

                const idDialog = botao.dataset.projectOpen;
                const dialog = document.getElementById(idDialog);
                const videoPreview = botao.querySelector(".project-tile-video");

                if (!dialog) {
                    console.error(
                        "Janela do projeto nao encontrada:",
                        idDialog
                    );

                    return;
                }

                let previewCarregado = false;

                // abre os detalhes
                botao.addEventListener("click", function () {

                    if (videoPreview) {
                        videoPreview.pause();
                    }

                    if (!dialog.open) {
                        dialog.showModal();

                        requestAnimationFrame(function () {

                            if (window.graficoRogueNave) {
                                window.graficoRogueNave.resize();
                            }

                        });
                    }

                });

                // botao de fechar
                const botaoFechar = dialog.querySelector("[data-dialog-close]");

                if (botaoFechar) {
                    botaoFechar.addEventListener("click", function () {
                        dialog.close();
                    });
                }

                // fechar clicando no fundo da janela
                dialog.addEventListener("click", function (evento) {

                    if (evento.target === dialog) {
                        dialog.close();
                    }

                });

                // parar todos os videos ao fechar
                dialog.addEventListener("close", function () {

                    dialog.querySelectorAll("video").forEach(function (video) {
                        video.pause();

                        if (video.readyState > 0) {
                            video.currentTime = 0;
                        }
                    });

                    if (videoPreview) {
                        videoPreview.pause();

                        if (videoPreview.readyState > 0) {
                            videoPreview.currentTime = 0;
                        }
                    }

                    botao.focus();

                });

                // carregar preview apenas quando necessario
                if (videoPreview) {

                    videoPreview.addEventListener("error", function () {
                        botao.closest(".project-tile")
                            ?.classList.add("no-preview-video");
                    });

                    botao.addEventListener("pointerenter", async function () {

                        const temHover = window.matchMedia(
                            "(hover: hover) and (pointer: fine)"
                        ).matches;

                        const movimentoReduzido = window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
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
