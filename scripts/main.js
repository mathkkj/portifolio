
const botaoMenu = document.getElementById("nav-toggle");
const menu = document.getElementById("main-nav");

if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
        const aberto = botaoMenu.getAttribute("aria-expanded") === "true";

        botaoMenu.setAttribute("aria-expanded", String(!aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Abrir menu" : "Fechar menu"
        );

        menu.classList.toggle("is-open", !aberto);
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("is-open");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
        });
    });
}

(async function () {
    let idioma = navigator.language.startsWith("pt") ? "pt" : "en";

    try {
        const resposta = await fetch("https://ipwho.is/");
        const dados = await resposta.json();

        if (dados.success && dados.country_code === "BR") {
            idioma = "pt";
        } else{
            idioma = "en";
        }
        console.log("origem:", location.origin);
        console.log("status:", resposta.status);
        console.log("dados:", dados);
        console.log("pais:", dados.country_code);

    } catch (erro) {
        console.log("Usando o idioma do navegador.");
    }

    document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";

    document.querySelectorAll("[data-pt][data-en]").forEach((elemento) => {
        elemento.textContent = elemento.dataset[idioma];
    });
})();