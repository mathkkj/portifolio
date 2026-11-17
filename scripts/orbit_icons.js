
(function () {

    const icones = [
    { nome: "GitHub", icone: "simple-icons:github", cor: "181717", fundo: true },
    { nome: "Git", icone: "simple-icons:git", cor: "F05032" },
    { nome: "HTML", icone: "simple-icons:html5", cor: "E34F26" },
    { nome: "CSS", icone: "simple-icons:css", cor: "663399" },
    { nome: "JavaScript", icone: "simple-icons:javascript", cor: "F7DF1E" },
    { nome: "Node.js", icone: "simple-icons:nodedotjs", cor: "5FA04E" },
    { nome: "Express", icone: "simple-icons:express", cor: "000000", fundo: true },
    { nome: "PostgreSQL", icone: "simple-icons:postgresql", cor: "4169E1" },
    { nome: "Supabase", icone: "simple-icons:supabase", cor: "3FCF8E" },
    { nome: "JSON", icone: "simple-icons:json", cor: "000000", fundo: true },
    { nome: "Godot", icone: "simple-icons:godotengine", cor: "478CBF" },
    { nome: "itch.io", icone: "simple-icons:itchdotio", cor: "FA5C5C" },
    { nome: "Expo Snack", icone: "simple-icons:expo", cor: "000020", fundo: true },
    { nome: "Construct 2", icone: "mdi:gamepad-variant", cor: "FFFFFF" }
];

    function embaralhar(lista) {
        const resultado = [...lista];

        for (let i = resultado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
        }

        return resultado;
    }

    function criarOrbita(id, lista) {
        const container = document.getElementById(id);

        if (!container) return;

        const icones = embaralhar(lista);
        const total = icones.length;

        icones.forEach(function (item, index) {
            const anguloBase = (360 / total) * index;
            const variacao = (Math.random() - 0.5) * 15;
            const angulo = (anguloBase + variacao) * Math.PI / 180;

            const distancia = 39 + Math.random() * 8;

            const icone = document.createElement("span");
            const imagem = document.createElement("img");

            icone.classList.add("orbit-icon");
            icone.title = item.nome;

            icone.style.left =
                `${50 + Math.cos(angulo) * distancia}%`;

            icone.style.top =
                `${50 + Math.sin(angulo) * distancia}%`;

           if (item.fundo) {
            icone.classList.add("orbit-icon-com-fundo");
        }

        imagem.src = `https://api.iconify.design/${item.icone.replace(":", "/")}.svg?color=%23${item.cor}`;
            imagem.alt = "";
            imagem.draggable = false;

            imagem.onerror = function () {
                icone.remove();
            };

            icone.appendChild(imagem);
            container.appendChild(icone);
        });
    }

    const iconesMisturados = embaralhar(icones);

    const metade = Math.ceil(iconesMisturados.length / 2);

    criarOrbita("orbit-web", iconesMisturados.slice(0, metade));
    criarOrbita("orbit-games", iconesMisturados.slice(metade));
})();
