(async function () {
    await loadSlim(tsParticles);

    await tsParticles.load({
        id: "tsparticles",
        options: {
            fullScreen: {
                enable: true,
                zIndex: -1
            },

            background: {
                color: "#0c1110"
            },

            particles: {
                number: {
                    value: 65
                },

                color: {
                    value: ["#b9a5ff", "#8b5cf6", "#e9d5ff"]
                },

                links: {
                    enable: true,
                    distance: 140,
                    color: "#a78bfa",
                    opacity: 0.25,
                    width: 1
                },

                move: {
                    enable: true,
                    speed: 0.8
                },

                opacity: {
                    value: 0.55
                },

                size: {
                    value: {
                        min: 1,
                        max: 3
                    }
                }
            },

            interactivity: {
                detectsOn: "window",

                events: {
                    onHover: {
                        enable: true,
                        mode: "grab"
                    },

                    onClick: {
                        enable: true,
                        mode: "repulse"
                    }
                },

                modes: {
                    grab: {
                        distance: 150,
                        links: {
                            opacity: 0.5
                        }
                    },

                    repulse: {
                        distance: 140,
                        duration: 0.4
                    }
                }
            },

            detectRetina: true
        }
    });
})();