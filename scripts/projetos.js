// CONFIGURACAO DOS PROJETOS

const projetosEstatisticas = {

    "rogue-nave": {
        github: {
            usuario: "mathkkj",
            repositorio: "ROGUENAVE"
        }
    },

    "pesque-e-pegue": {
        github: null
    },

    "thirty-seconds": {
        github: {
            usuario: "mathkkj",
            repositorio: "GMTK-Jam"
        }
    },

    "distortia": {
        github: null
    },

    "the-arcanum-corsaires": {
        github: {
            usuario: "Night-22",
            repositorio: "projeto_gg"
        }
    }

};


// CACHE DO GITHUB

const tempoCacheGithub = 60 * 60 * 1000;

function lerCacheGithub(projeto) {

    try {

        const cache = JSON.parse(
            localStorage.getItem(`github-${projeto}`)
        );

        if (cache && Date.now() - cache.tempo < tempoCacheGithub) {
            return cache.dados;
        }

    } catch (erro) {
        // continua sem cache
    }

    return null;

}


function salvarCacheGithub(projeto, dados) {

    try {

        localStorage.setItem(
            `github-${projeto}`,
            JSON.stringify({
                tempo: Date.now(),
                dados: dados
            })
        );

    } catch (erro) {
        // continua sem cache
    }

}


// AGRUPAMENTO DOS COMMITS

function agruparCommits(commits) {

    const contagem = {};

    commits.forEach((item) => {

        const dataCommit =
            item.commit.author?.date ||
            item.commit.committer?.date;

        if (!dataCommit) return;

        const data = new Date(dataCommit);

        const chave =
            `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

        contagem[chave] = (contagem[chave] || 0) + 1;

    });

    const meses = Object.keys(contagem).sort();

    const idioma = document.documentElement.lang.startsWith("en")
        ? "en-US"
        : "pt-BR";

    return {

        meses: meses.map((mes) => {

            const partes = mes.split("-").map(Number);

            return new Intl.DateTimeFormat(idioma, {
                month: "short",
                year: "2-digit"
            }).format(new Date(partes[0], partes[1] - 1, 1));

        }),

        quantidades: meses.map((mes) => contagem[mes])

    };

}


// GRAFICOS

function mostrarGrafico(projeto, dados) {

    const container = document.querySelector(
        `[data-project-chart="${projeto}"]`
    );

    const canvas = container?.querySelector("canvas");

    if (!canvas || typeof Chart === "undefined") return;

    if (!window.graficosProjetos) {
        window.graficosProjetos = {};
    }

    if (window.graficosProjetos[projeto]) {
        window.graficosProjetos[projeto].destroy();
    }

    window.graficosProjetos[projeto] = new Chart(canvas, {

        type: "bar",

        data: {

            labels: dados.meses,

            datasets: [{
                label: "Commits",
                data: dados.quantidades,
                backgroundColor: "#a6e8ba",
                hoverBackgroundColor: "#b9a5ff",
                borderRadius: 5,
                borderSkipped: false
            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#a6b5aa"
                    },
                    border: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: "#a6b5aa"
                    },
                    grid: {
                        color: "rgba(166, 181, 170, 0.12)"
                    },
                    border: {
                        display: false
                    }
                }

            }

        }

    });

}


// CARREGAR COMMITS DE CADA PROJETO

async function carregarCommitsProjeto(projeto, config) {

    const bloco = Array.from(
        document.querySelectorAll("[data-project-stats]")
    ).find((item) => item.dataset.projectStats === projeto);

    const elemento = bloco?.querySelector("[data-commits]");

    if (!elemento) return;

    if (!config.github) {
        elemento.textContent = "—";
        return;
    }

    const cache = lerCacheGithub(projeto);

    if (cache) {

        elemento.textContent = String(cache.total);
        mostrarGrafico(projeto, cache.grafico);

        return;

    }

    try {

        const usuario = config.github.usuario;
        const repositorio = config.github.repositorio;

        const baseGithub =
            `https://api.github.com/repos/${usuario}/${repositorio}`;

        const resposta = await fetch(
            `${baseGithub}/commits?per_page=100`,
            {
                headers: {
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!resposta.ok) {
            throw new Error("Nao foi possivel consultar o repositorio.");
        }

        const commits = await resposta.json();

        const link = resposta.headers.get("Link") || "";

        const ultimoLink = link.match(
            /<([^>]+)>;\s*rel="?last"?/
        );

        let total;

        if (commits.length === 0) {

            total = 0;

        } else if (ultimoLink) {

            const ultimaPagina = Number(
                new URL(ultimoLink[1]).searchParams.get("page") || 1
            );

            if (ultimaPagina > 1) {

                const respostaFinal = await fetch(
                    `${baseGithub}/commits?per_page=100&page=${ultimaPagina}`,
                    {
                        headers: {
                            Accept: "application/vnd.github+json"
                        }
                    }
                );

                if (!respostaFinal.ok) {
                    throw new Error("Erro ao contar os commits.");
                }

                const commitsFinais = await respostaFinal.json();

                total = (ultimaPagina - 1) * 100 + commitsFinais.length;

            } else {

                total = commits.length;

            }

        } else {

            total = commits.length === 100
                ? "100+"
                : commits.length;

        }

        const dados = {
            total: total,
            grafico: agruparCommits(commits)
        };

        salvarCacheGithub(projeto, dados);

        elemento.textContent = String(dados.total);

        mostrarGrafico(projeto, dados.grafico);

    } catch (erro) {

        elemento.textContent = "—";

        console.error(
            `Erro nos commits de ${projeto}:`,
            erro
        );

    }

}


// CARREGAR DOWNLOADS DO ITCH.IO


async function carregarDownloadsItch() {

    try {

        const resposta = await fetch(
            `./dados/estatisticas.json?t=${Date.now()}`,
            { cache: "no-store" }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao carregar estatisticas.");
        }

        const dados = await resposta.json();
        const downloads = dados.downloads || {};

        const idioma = document.documentElement.lang.startsWith("en")
            ? "en-US"
            : "pt-BR";

        document.querySelectorAll("[data-project-stats]").forEach((bloco) => {

            const projeto = bloco.dataset.projectStats;
            const elemento = bloco.querySelector("[data-downloads]");

            if (!elemento) return;

            const total = downloads[projeto];

            if (typeof total !== "number") {
                elemento.textContent = "—";
                return;
            }

            elemento.textContent = new Intl.NumberFormat(idioma)
                .format(total);

        });

    } catch (erro) {

        document.querySelectorAll("[data-downloads]").forEach((elemento) => {
            elemento.textContent = "—";
        });

        console.error("Erro nos downloads:", erro);

    }

}



// INICIALIZAR ESTATISTICAS

async function carregarEstatisticasProjetos() {

    const tarefasGithub = Object.entries(projetosEstatisticas).map(
        ([projeto, config]) => carregarCommitsProjeto(projeto, config)
    );

    await Promise.all([
        ...tarefasGithub,
        carregarDownloadsItch()
    ]);

}

carregarEstatisticasProjetos();