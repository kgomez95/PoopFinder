// @ts-check
"use strict";

var PoopFinderGame = (function (w) {
    var InterfaceCtrl = (function () {
        /**
         * @name Interface
         * @description Clase para gestionar la parte gráfica del juego.
         * @param {string} containerId - Identificador del elemento DOM que contendrá el juego.
         * @param {Function} newGameCallback - Función que se ejecutará para crear una nueva partida.
         */
        function Interface(containerId, newGameCallback) {
            var that = this;

            /** @type {HTMLElement} */
            that.container = undefined;
            /** @type {HTMLElement} */
            that.mainMenu = undefined;

            function init() {
                initContainer();
                createMainMenu();
            };

            /**
             * @description Coge la referencia al elemento DOM contenedor del juego o devuelve un error
             * en el caso de que no encuentre el elemento.
             */
            function initContainer() {
                that.container = w.document.getElementById(containerId);
                if (!that.container)
                    throw new Error("PoopFinder: No se ha podido localizar el contenedor DOM con identificador '" + containerId + "'.");
                that.container.className = "poop-finder";
            };

            /**
             * @description Crea el elemento DOM del menú principal del juego.
             */
            function createMainMenu() {
                var container = w.document.createElement("div"),
                    title = w.document.createElement("h1"),
                    buttonsContainer = w.document.createElement("ul"),
                    easyButton = w.document.createElement("li"),
                    normalButton = w.document.createElement("li"),
                    hardButton = w.document.createElement("li");

                // Añadimos los textos a los botones y al título.
                title.appendChild(w.document.createTextNode("💩Poop~Finder💩"));
                easyButton.appendChild(w.document.createTextNode("Fácil"));
                normalButton.appendChild(w.document.createTextNode("Normal"));
                hardButton.appendChild(w.document.createTextNode("Difícil"));

                // Añadimos los eventos a los botones.
                easyButton.onclick = function () { newGameCallback("easy"); };
                normalButton.onclick = function () { newGameCallback("normal"); };
                hardButton.onclick = function () { newGameCallback("hard"); };

                // Añadimos los botones a su contenedor.
                buttonsContainer.appendChild(easyButton);
                buttonsContainer.appendChild(normalButton);
                buttonsContainer.appendChild(hardButton);

                // Añadimos la clase del menú principal al contenedor.
                container.className = "main-menu";

                // Añadimos el título y el contenedor de botones al contenedor del menú principal.
                container.appendChild(title);
                container.appendChild(buttonsContainer);

                // Guardamos la referencia del contenedor del menú principal y lo instanciamos en el contenedor del juego.
                that.mainMenu = container;
                that.container.appendChild(that.mainMenu);
            };

            init();
        };

        /**
         * @name toggleMainMenu
         * @description Muestra u oculta el menú principal.
         * @param {boolean} toggle - Indicador para mostrar u ocultar el menú principal.
         */
        Interface.prototype.toggleMainMenu = function (toggle) {
            if (toggle)
                this.mainMenu.style.display = "block";
            else
                this.mainMenu.style.display = "none";
        };

        return Interface;
    })();

    var GameCtrl = (function () {
        /**
         * @name PoopFinder
         * @description Clase principal para gestionar el juego.
         * @param {string} containerId - Identificador del elemento DOM que contendrá el juego.  
         */
        function PoopFinder(containerId) {
            this.interface = new InterfaceCtrl(containerId, this.newGame);
        };

        /**
         * @name newGame
         * @description Comienza una nueva partida en la dificultad proporcionada por parámetros.
         * @param {string} difficulty - Dificultad de la nueva partida.
         */
        PoopFinder.prototype.newGame = function (difficulty) {
            console.log("Dificultad seleccionada: ", difficulty);

            // TODO: Iniciar una nueva partida en la dificultad recibida por parámetros.
        };

        return PoopFinder;
    })();

    return GameCtrl;
})(window);
