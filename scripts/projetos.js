
const usuarioGithub = "mathkkj";
const repositorioGithub = "ROGUENAVE";

const baseGithub =
    `https://api.github.com/repos/${usuarioGithub}/${repositorioGithub}`;

const tempoCache = 60 * 60 * 1000;

function lerCacheGithub() {
    try {
        const cache = JSON.parse(
            localStorage.getItem("rogue-nave-estatisticas")
        );

        if (cache && Date.now() - cache.tempo < tempoCache) {
            return cache.dados;
        }
    } catch (erro) {
        // continua sem cache
    }

    return null;
}

function salvarCacheGithub(dados) {
    try {
        localStorage.setItem(
            "rogue-nave-estatisticas",
            JSON.stringify({
                tempo: Date.now(),
                dados: dados
            })
        );
    } catch (erro) {
        // o site continua funcionando sem cache
    }
}

function mostrarGrafico(dados) {
    const canvas = document.getElementById("rogue-nave-chart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    if (window.graficoRogueNave) {
        window.graficoRogueNave.destroy();
    }

    window.graficoRogueNave = new Chart(canvas, {
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

function agruparCommits(commits) {
    const contagem = {};

    commits.forEach((item) => {
        const dataCommit =
            item.commit.author?.date ||
            item.commit.committer?.date;

        if (!dataCommit) {
            return;
        }

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

function mostrarCommits(dados) {
    const elemento = document.getElementById("rogue-nave-commits");

    if (elemento) {
        elemento.textContent = String(dados.total);
    }

    mostrarGrafico(dados.grafico);
}

async function carregarCommits() {
    const elemento = document.getElementById("rogue-nave-commits");

    if (!elemento) {
        return;
    }

    const cache = lerCacheGithub();

    if (cache) {
        mostrarCommits(cache);
        return;
    }

    try {
        const resposta = await fetch(
            `${baseGithub}/commits?per_page=100`,
            {
                headers: {
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!resposta.ok) {
            throw new Error("Nao foi possivel consultar o GitHub.");
        }

        const commits = await resposta.json();
        const link = resposta.headers.get("Link") || "";
        const ultimoLink = link.match(/<([^>]+)>;\s*rel="?last"?/);

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
                    throw new Error("Nao foi possivel contar os commits.");
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

        salvarCacheGithub(dados);
        mostrarCommits(dados);

    } catch (erro) {
        elemento.textContent = "—";
        console.error("Erro nas estatisticas do GitHub:", erro);
    }
}

async function carregarDownloadsItch() {
    const elemento = document.getElementById("rogue-nave-downloads");

    if (!elemento) {
        return;
    }

    try {
        const resposta = await fetch("./dados/estatisticas.json", {
            cache: "no-store"
        });

        if (!resposta.ok) {
            throw new Error("Estatisticas do itch.io indisponiveis.");
        }

        const dados = await resposta.json();

        if (
            typeof dados.itch_downloads !== "number" ||
            !Number.isFinite(dados.itch_downloads)
        ) {
            throw new Error("Numero de downloads invalido.");
        }

        const idioma = document.documentElement.lang.startsWith("en")
            ? "en-US"
            : "pt-BR";

        elemento.textContent = new Intl.NumberFormat(idioma)
            .format(dados.itch_downloads);

    } catch (erro) {
        elemento.textContent = "—";
        console.error("Erro nos downloads do itch.io:", erro);
    }
}

carregarCommits();
carregarDownloadsItch();
