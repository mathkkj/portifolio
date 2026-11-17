
(function () {

    // CADASTRO DOS PROJETOS
    const projetos = [

        {
            id: "meu-projeto",
            nome: "Meu Projeto",

            resumoPt: "Uma breve descrição para o card.",
            resumoEn: "A brief description for the project card.",

            descricaoPt: "Uma descrição mais completa sobre o projeto, explicando sua proposta, desenvolvimento e minha participação.",
            descricaoEn: "A more complete description of the project, explaining its concept, development and my contribution.",

            capa: "assets/projetos/meu-projeto/preview.png",

            links: [
                {
                    url: "https://github.com/",
                    pt: "Ver no GitHub",
                    en: "View on GitHub"
                },
                {
                    url: "https://itch.io/",
                    pt: "Jogar no itch.io",
                    en: "Play on itch.io"
                }
            ],

            tecnologias: [
                "Godot",
                "GDScript",
                "Game Dev"
            ],

            midia: [
                {
                    tipo: "imagem",
                    src: "assets/projetos/meu-projeto/foto-01.png",
                    alt: "Imagem do projeto",
                    pt: "Descrição da imagem.",
                    en: "Image description."
                },

                {
                    tipo: "video",
                    src: "assets/projetos/meu-projeto/video-01.mp4",
                    pt: "Demonstração do projeto.",
                    en: "Project demonstration."
                }
            ]
        }

    ];


    // ESCAPA CARACTERES PARA O HTML
    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (caractere) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[caractere];
        });
    }


    // CRIA O CARD DO PROJETO
    function criarCard(projeto, indice) {

        const numero = projeto.numero || String(indice + 2).padStart(2, "0");
        const dialogId = projeto.id + "-details";

        const artigo = document.createElement("article");

        artigo.className = "project-tile";

        artigo.innerHTML = `
            <button
                class="project-tile-button"
                type="button"
                aria-haspopup="dialog"
                aria-controls="${escapar(dialogId)}"
                aria-label="Ver detalhes do ${escapar(projeto.nome)}"
            >

                <span class="project-tile-media">

                    <img
                        class="project-tile-image"
                        src="${escapar(projeto.capa)}"
                        alt=""
                        loading="lazy"
                    >

                    <span class="project-tile-shade"></span>

                    <span class="project-tile-number">
                        ${escapar(numero)}
                    </span>

                    <span class="project-tile-hint" aria-hidden="true">↗</span>

                    <span class="project-tile-copy">

                        <span class="project-tile-title">
                            ${escapar(projeto.nome)}
                        </span>

                        <span
                            class="project-tile-summary"
                            data-pt="${escapar(projeto.resumoPt)}"
                            data-en="${escapar(projeto.resumoEn)}"
                        >
                            ${escapar(projeto.resumoPt)}
                        </span>

                    </span>

                </span>

            </button>
        `;

        return artigo;
    }


    // CRIA OS LINKS DO PROJETO
    function criarLinks(links) {

        if (!links || links.length === 0) {
            return "";
        }

        return `
            <div class="project-actions">

                ${links.map(function (link) {

                    return `
                        <a
                            class="project-link"
                            href="${escapar(link.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <span
                                data-pt="${escapar(link.pt)}"
                                data-en="${escapar(link.en)}"
                            >
                                ${escapar(link.pt)}
                            </span>

                            <span class="project-arrow">↗</span>

                        </a>
                    `;

                }).join("")}

            </div>
        `;
    }


    // CRIA A GALERIA DE MIDIA
    function criarMidia(midia) {

        if (!midia || midia.length === 0) {
            return "";
        }

        return `
            <section class="project-media-section">

                <div class="project-media-heading">

                    <div>
                        <span class="projects-label">MEDIA</span>

                        <h3
                            data-pt="Imagens e vídeos"
                            data-en="Screenshots and videos"
                        >
                            Imagens e vídeos
                        </h3>
                    </div>

                </div>

                <div class="project-media-grid">

                    ${midia.map(function (item) {

                        let conteudo = "";

                        if (item.tipo === "video") {

                            conteudo = `
                                <video controls playsinline preload="metadata">
                                    <source
                                        src="${escapar(item.src)}"
                                        type="video/mp4"
                                    >
                                    Seu navegador não suporta vídeos.
                                </video>
                            `;

                        } else {

                            conteudo = `
                                <img
                                    src="${escapar(item.src)}"
                                    alt="${escapar(item.alt)}"
                                    loading="lazy"
                                >
                            `;

                        }

                        return `
                            <figure class="project-media-item">

                                ${conteudo}

                                <figcaption
                                    data-pt="${escapar(item.pt)}"
                                    data-en="${escapar(item.en)}"
                                >
                                    ${escapar(item.pt)}
                                </figcaption>

                            </figure>
                        `;

                    }).join("")}

                </div>

            </section>
        `;
    }


    // CRIA A JANELA DE DETALHES
    function criarDialog(projeto, indice) {

        const numero = projeto.numero || String(indice + 2).padStart(2, "0");
        const dialogId = projeto.id + "-details";
        const tituloId = projeto.id + "-title";

        const dialog = document.createElement("dialog");

        dialog.id = dialogId;
        dialog.className = "project-dialog";
        dialog.setAttribute("aria-labelledby", tituloId);

        const tecnologias = projeto.tecnologias || [];

        dialog.innerHTML = `
            <div class="project-dialog-content">

                <button
                    class="project-dialog-close"
                    type="button"
                    aria-label="Fechar detalhes"
                >
                    ×
                </button>

                <div class="project-dialog-heading">

                    <span class="projects-label">
                        PROJETO / ${escapar(numero)}
                    </span>

                    <h2 id="${escapar(tituloId)}">
                        ${escapar(projeto.nome)}
                    </h2>

                    <p
                        data-pt="${escapar(projeto.descricaoPt)}"
                        data-en="${escapar(projeto.descricaoEn)}"
                    >
                        ${escapar(projeto.descricaoPt)}
                    </p>

                    ${criarLinks(projeto.links)}

                </div>

                ${criarMidia(projeto.midia)}

                ${tecnologias.length > 0 ? `
                    <div class="project-tags">

                        ${tecnologias.map(function (tecnologia) {
                            return `<span>${escapar(tecnologia)}</span>`;
                        }).join("")}

                    </div>
                ` : ""}

            </div>
        `;

        return dialog;
    }


    // INICIALIZA O CATÁLOGO
    function iniciarCatalogo() {

        const grade = document.getElementById("projects-grid");

        if (!grade) {
            console.error("Não foi encontrada a grade de projetos.");
            return;
        }

        projetos.forEach(function (projeto, indice) {

            const card = criarCard(projeto, indice);
            const dialog = criarDialog(projeto, indice);

            const botao = card.querySelector(".project-tile-button");
            const fechar = dialog.querySelector(".project-dialog-close");

            // Abre a janela
            botao.addEventListener("click", function () {
                dialog.showModal();
            });

            // Fecha pelo botao
            fechar.addEventListener("click", function () {
                dialog.close();
            });

            // Fecha ao clicar fora do conteudo
            dialog.addEventListener("click", function (evento) {

                if (evento.target === dialog) {
                    dialog.close();
                }

            });

            grade.appendChild(card);
            document.body.appendChild(dialog);

        });

    }


    // Garante que o HTML esteja carregado
    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", iniciarCatalogo);

    } else {

        iniciarCatalogo();

    }

    
})();
