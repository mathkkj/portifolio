
document.querySelectorAll(".custom-video-player").forEach(function (player) {
    const video = player.querySelector("video");

    const botaoPlay = player.querySelector(".video-play");
    const botaoMute = player.querySelector(".video-mute");
    const botaoFullscreen = player.querySelector(".video-fullscreen");

    const barraProgresso = player.querySelector(".video-progress");

    const tempoAtual = player.querySelector(".video-current-time");
    const duracao = player.querySelector(".video-duration");

    // formatar tempo
    function formatarTempo(tempo) {
        if (!Number.isFinite(tempo)) return "0:00";

        const minutos = Math.floor(tempo / 60);
        const segundos = Math.floor(tempo % 60);

        return minutos + ":" + String(segundos).padStart(2, "0");
    }

    // atualizar botao de play
    function atualizarPlay() {
        if (video.paused) {
            botaoPlay.textContent = "▶";
            botaoPlay.setAttribute("aria-label", "Reproduzir vídeo");
        } else {
            botaoPlay.textContent = "Ⅱ";
            botaoPlay.setAttribute("aria-label", "Pausar vídeo");
        }
    }

    // reproduzir e pausar
    async function alternarPlay() {
        if (video.paused) {
            try {
                await video.play();
            } catch (erro) {
                console.error("Não foi possível reproduzir o vídeo:", erro);
            }
        } else {
            video.pause();
        }
    }

    botaoPlay.addEventListener("click", alternarPlay);

    video.addEventListener("click", alternarPlay);

    video.addEventListener("play", atualizarPlay);
    video.addEventListener("pause", atualizarPlay);
    video.addEventListener("ended", atualizarPlay);

    // atualizar barra de progresso e tempo
    function atualizarProgresso() {
        tempoAtual.textContent = formatarTempo(video.currentTime);

        if (Number.isFinite(video.duration) && video.duration > 0) {
            barraProgresso.value =
                (video.currentTime / video.duration) * 1000;
        }

        if (video.duration) {
            duracao.textContent = formatarTempo(video.duration);
        }
    }

    video.addEventListener("timeupdate", atualizarProgresso);
    video.addEventListener("loadedmetadata", atualizarProgresso);
    video.addEventListener("durationchange", atualizarProgresso);

    // avancar ou voltar no video
    barraProgresso.addEventListener("input", function () {
        if (!Number.isFinite(video.duration)) return;

        video.currentTime =
            (Number(barraProgresso.value) / 1000) * video.duration;
    });

    // controlar volume
    function atualizarMute() {
        if (video.muted) {
            botaoMute.textContent = "◖×";
            botaoMute.setAttribute("aria-label", "Ativar som");
        } else {
            botaoMute.textContent = "◖))";
            botaoMute.setAttribute("aria-label", "Silenciar vídeo");
        }
    }

    botaoMute.addEventListener("click", function () {
        video.muted = !video.muted;
        atualizarMute();
    });

    video.addEventListener("volumechange", atualizarMute);

    // tela cheia
    botaoFullscreen.addEventListener("click", async function () {
        try {
            if (document.fullscreenElement === player) {
                await document.exitFullscreen();
            } else if (player.requestFullscreen) {
                await player.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        } catch (erro) {
            console.error("Não foi possível abrir a tela cheia:", erro);
        }
    });

    // impedir barra de progresso sem metadados
    video.addEventListener("emptied", function () {
        barraProgresso.value = 0;
        tempoAtual.textContent = "0:00";
        duracao.textContent = "0:00";
    });

    atualizarPlay();
    atualizarMute();
});
