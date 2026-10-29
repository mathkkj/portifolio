const botaoItch = document.getElementById("rogue-nave-itch");

if (botaoItch && window.Itch) {
    Itch.attachBuyButton(botaoItch, {
        user: "mathkkj",
        game: "roguenave"
    });
}