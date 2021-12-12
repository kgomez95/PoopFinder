// @ts-check
"use strict";

var PoopFinderGame = (function (w) {
    var _constants = {
        difficulty: {
            easy: "easy",
            normal: "normal",
            hard: "hard"
        },
        cells: {
            poop: -1,
            flag: -2, // 🚩
            questionMark: -3 // ❔
        }
    };

    var InterfaceCtrl = (function () {
        /**
         * @name Interface
         * @description Clase para gestionar la parte gráfica del juego.
         * @param {string} containerId - Identificador del elemento DOM que contendrá el juego.
         * @param {object} gameCtrl - Instancia del controlador del juego.
         */
        function Interface(containerId, gameCtrl) {
            var that = this;

            /** @type {HTMLElement} */
            that.container = undefined;
            /** @type {HTMLElement} */
            that.mainMenu = undefined;
            that.game = gameCtrl;

            /**
             * @description Inicializa la clase Interface.
             */
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
                easyButton.onclick = function () { that.game.newGame(_constants.difficulty.easy); };
                normalButton.onclick = function () { that.game.newGame(_constants.difficulty.normal); };
                hardButton.onclick = function () { that.game.newGame(_constants.difficulty.hard); };

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

            // TODO: Crear el menú de juego (tiene que contener la cantidad de minas restantes, un temporizador y un botón para abrir el menú de pausa).

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

        /**
         * @name createBoard
         * @description Crea una instancia DOM del tablero de juego.
         * @param {number} x - Cantidad de posiciones horizontales que tendrá el tablero.
         * @param {number} y - Cantidad de posiciones verticales que tendrá el tablero.
         */
        Interface.prototype.createBoard = function (x, y) {
            // TODO: Crear la instancia DOM con todos sus eventos para el tablero de juego.
        };

        return Interface;
    })();

    var BoardCtrl = (function () {
        /**
         * @name Board
         * @description Clase para gestionar el tablero del juego.
         * @param {number} x - Cantidad de posiciones horizontales que tendrá el tablero.
         * @param {number} y - Cantidad de posiciones verticales que tendrá el tablero.
         * @param {number} poops - Cantidad de "minas" que tendrá el tablero.
         * @param {object} gameCtrl - Instancia del controlador del juego.
         */
        function Board(x, y, poops, gameCtrl) {
            var that = this;

            that.x = x;
            that.y = y;
            that.poops = poops;
            that.board = [];
            that.game = gameCtrl;

            // Calculamos el total de celdas que tenemos que seleccionar para ganar la partida.
            that.cellsToWin = (that.x * that.y) - that.poops;

            /**
             * @description Inicializa la clase Board.
             */
            function init() {
                validateAttributes();
                initBoard();
                instantiateBoard();
            };

            /**
             * @description Comprueba si los valores recibidos por argumentos son válidos o no.
             */
            function validateAttributes() {
                if (!that.x || !that.y)
                    throw new Error("PoopFinder: Es necesario especificar una anchura y una altura para inicializar el tablero de juego.");
                else if (!w.parseInt(that.x.toString()) || that.x <= 0 || !w.parseInt(that.y.toString()) || that.y <= 0)
                    throw new Error("PoopFinder: Es necesario especificar una anchura y una altura correcta para el tablero de juego.");

                if (!that.poops || !w.parseInt(that.poops.toString()) || that.poops <= 0)
                    throw new Error("PoopFinder: Es necesario especificar al menos una \"mina\" en el tablero de juego.");

                if ((that.x * that.y) <= that.poops)
                    throw new Error("PoopFinder: Tiene que haber al menos una posición libre de \"minas\" en el tablero de juego.");
            };

            /**
             * @description Construye el tablero con los valores proporcionados por parámetros en la clase.
             */
            function initBoard() {
                /**
                 * @name countPoopsAround
                 * @description Cuenta la cantidad de "minas" que hay alrededor de la casilla proporcionada.
                 * @param {number} xPos - Número de fila a comprobar.
                 * @param {number} yPos - Número de columna a comprobar.
                 * @returns {number} Retorna la cantidad total de "minas" que hay alrededor de la casilla proporcionada.
                 */
                function countPoopsAround(xPos, yPos) {
                    var poops = 0;

                    for (var x = xPos - 1; x <= xPos + 1; x++) {
                        for (var y = yPos - 1; y <= yPos + 1; y++) {
                            if (that.board[x] !== undefined) {
                                if (that.board[x][y] === _constants.cells.poop) {
                                    poops++;
                                }
                            }
                        }
                    }

                    return poops;
                }

                // Inicializa el tablero de juego.
                that.board = new Array(that.x);
                for (var x = 0; x < that.x; x++) {
                    that.board[x] = new Array(that.y);

                    for (var y = 0; y < that.y; y++) {
                        that.board[x][y] = 0;
                    }
                }

                // Inicializamos las "minas" en el tablero de juego.
                var poops = that.poops;
                while (poops > 0) {
                    // Generamos una posición aleatoria dentro del tablero para añadir la "mina".
                    var x = Math.floor(Math.random() * that.x);
                    var y = Math.floor(Math.random() * that.y);

                    // Añadimos la "mina" solamente si esa posición está libre, sino buscamos otra posición.
                    if (that.board[x][y] !== _constants.cells.poop) {
                        that.board[x][y] = _constants.cells.poop;
                        poops--;
                    }
                }

                // Terminamos de rellenar las casillas del tablero de juego.
                for (var x = 0; x < that.x; x++) {
                    for (var y = 0; y < that.y; y++) {
                        // En caso de que la casilla esté vacía contamos las minas que hay a su alrededor y le asignamos ese total de minas.
                        if (that.board[x][y] === 0) {
                            that.board[x][y] = countPoopsAround(x, y);
                        }
                    }
                }
            };

            /**
             * @description Invoca al InterfaceCtrl para instanciar el tablero de juego en pantalla.
             */
            function instantiateBoard() {
                // TODO: Llamar al InterfaceCtrl desde "that.game" para crear la instancia del tablero en pantalla.
            };

            init();
        };

        return Board;
    })();

    var GameCtrl = (function () {
        /**
         * @name PoopFinder
         * @description Clase principal para gestionar el juego.
         * @param {string} containerId - Identificador del elemento DOM que contendrá el juego.  
         */
        function PoopFinder(containerId) {
            this.interface = new InterfaceCtrl(containerId, this);
            this.board = undefined;
        };

        /**
         * @name newGame
         * @description Comienza una nueva partida en la dificultad proporcionada por parámetros.
         * @param {string} difficulty - Dificultad de la nueva partida.
         */
        PoopFinder.prototype.newGame = function (difficulty) {
            switch (difficulty) {
                case _constants.difficulty.easy:
                    this.board = new BoardCtrl(9, 9, 10, this);
                    break;
                case _constants.difficulty.normal:
                    this.board = new BoardCtrl(16, 16, 40, this);
                    break;
                case _constants.difficulty.hard:
                    this.board = new BoardCtrl(30, 16, 99, this);
                    break;
                default:
                    throw new Error("PoopFinder: La dificultad '" + difficulty + "' no es válida.");
            }

            // TODO: Después de crear el tablero hay que ocultar el menú principal, mostrar el tablero y mostrar el menú de juego.
        };

        return PoopFinder;
    })();

    return GameCtrl;
})(window);
