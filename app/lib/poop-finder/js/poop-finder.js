/*!
 * PoopFinder v1.0
 *
 * Autor: Kevin Gómez Codina
 * Date: 2021-12-15T12:37Z
 */
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
            flag: -2,
            questionMark: -3,
            genetaId: function (x, y) {
                return "x" + x + "y" + y;
            }
        },
        touch: {
            timeout: 500
        },
        timer: {
            interval: 100,
            increase: 0.1
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
            /** @type {HTMLElement} */
            that.gameMenu = undefined;
            /** @type {HTMLElement} */
            that.pauseMenu = undefined;
            /** @type {HTMLElement} */
            that.boardContainer = undefined;
            /** @type {HTMLElement} */
            that.poopCounter = undefined;
            /** @type {HTMLElement} */
            that.timer = undefined;
            /** @type {HTMLElement} */
            that.pauseButton = undefined;

            that.game = gameCtrl;
            that.board = {};

            /**
             * @description Inicializa la clase Interface.
             */
            function init() {
                initContainer();
                createMainMenu();
                createGameMenu();
                createPauseMenu();
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

            /**
             * @description Crea el elemento DOM del menú del juego.
             */
            function createGameMenu() {
                var topContainer = w.document.createElement("div"),
                    leftContainer = w.document.createElement("div"),
                    centerContainer = w.document.createElement("div"),
                    rightContainer = w.document.createElement("div"),
                    spanFlag = w.document.createElement("span"),
                    spanPoopCounter = w.document.createElement("span"),
                    spanMenu = w.document.createElement("span"),
                    spanTimer = w.document.createElement("span");

                // Asignamos las clases a los elementos.
                topContainer.className = "game-menu";
                spanFlag.className = "flag";
                spanMenu.className = "menu face";

                // Creamos el evento clic para abrir el menú de pausa.
                spanMenu.onclick = function () {
                    that.togglePauseMenu(true);
                };

                // Incluimos los "span" a sus respectivos contenedores.
                leftContainer.appendChild(spanFlag);
                leftContainer.appendChild(spanPoopCounter);
                centerContainer.appendChild(spanMenu);
                rightContainer.appendChild(spanTimer);

                // Incluimos todos los contenedores en el contenedor principal del menú de juego.
                topContainer.appendChild(leftContainer);
                topContainer.appendChild(centerContainer);
                topContainer.appendChild(rightContainer);

                // Guardamos las referencias del contador de "minas", del temporizador y del botón pausa.
                that.poopCounter = spanPoopCounter;
                that.timer = spanTimer;
                that.pauseButton = spanMenu;

                // Inicializamos el contador de "minas" y el temporizador
                spanPoopCounter.innerHTML = "0";
                spanTimer.innerHTML = "0";

                // Guardamos la referencia del contenedor del menú de juego y lo instanciamos en el contenedor del juego.
                that.gameMenu = topContainer;
                that.container.appendChild(that.gameMenu);

                // Ocultamos este menú por defecto.
                that.toggleGameMenu(false);
            };

            /**
             * @description Crea el elemento DOM del menú de pausa.
             */
            function createPauseMenu() {
                var container = w.document.createElement("div"),
                    pauseContainer = w.document.createElement("div"),
                    title = w.document.createElement("h2"),
                    ul = w.document.createElement("ul"),
                    liContinue = w.document.createElement("li"),
                    liReset = w.document.createElement("li"),
                    liChangeDifficulty = w.document.createElement("li");

                // Asignamos los textos en los menús.
                title.innerHTML = "JUEGO PAUSADO";
                liContinue.innerHTML = "Continuar";
                liReset.innerHTML = "Reiniciar";
                liChangeDifficulty.innerHTML = "Elegir dificultad";

                // Asignamos la clase al contenedor del menú de pausa.
                container.className = "pause-menu";

                // Evento clic para cerrar el menú de pausa.
                liContinue.onclick = function () {
                    that.togglePauseMenu(false);
                };

                // Evento clic para reiniciar la partida actual.
                liReset.onclick = function () {
                    that.game.stopTimer();
                    that.game.newGame(that.game.difficulty);
                    that.togglePauseMenu(false);
                };

                // Evento clic para ir al menú principal.
                liChangeDifficulty.onclick = function () {
                    // Ocultamos toda la escena actual.
                    that.toggleGameMenu(false);
                    that.togglePauseMenu(false);
                    that.toggleBoard(false);

                    // Paramos el temporizador.
                    that.game.stopTimer();

                    // Mostramos el menú principal.
                    that.toggleMainMenu(true);
                };

                // Incluimos los elementos en sus respectivos contenedores.
                ul.appendChild(liContinue);
                ul.appendChild(liReset);
                ul.appendChild(liChangeDifficulty);
                pauseContainer.appendChild(title);
                pauseContainer.appendChild(ul);
                container.appendChild(pauseContainer);

                // Guardamos la referencia del contenedor del menú de pausa y lo instanciamos en el contenedor del juego.
                that.pauseMenu = container;
                that.container.appendChild(that.pauseMenu);

                // Ocultamos este menú por defecto.
                that.togglePauseMenu(false);
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

        /**
         * @name toggleGameMenu
         * @description Muestra u oculta el menú de juego.
         * @param {boolean} toggle - Indicador para mostrar u ocultar el menú de juego.
         */
        Interface.prototype.toggleGameMenu = function (toggle) {
            if (toggle)
                this.gameMenu.style.display = "flex";
            else
                this.gameMenu.style.display = "none";
        };

        /**
         * @name togglePauseMenu
         * @description Muestra u oculta el menú de pausa.
         * @param {boolean} toggle - Indicador para mostrar u ocultar el menú de pausa.
         */
        Interface.prototype.togglePauseMenu = function (toggle) {
            if (toggle) {
                this.pauseMenu.style.display = "block";
                this.game.isGamePaused = true;
            }
            else {
                this.pauseMenu.style.display = "none";
                this.game.isGamePaused = false;
            }
        };

        /**
         * @name toggleBoard
         * @description Muestra u oculta el tablero de juego.
         * @param {boolean} toggle - Indicador para mostrar u ocultar el tablero de juego.
         */
        Interface.prototype.toggleBoard = function (toggle) {
            if (toggle)
                this.boardContainer.style.display = "block";
            else
                this.boardContainer.style.display = "none";
        };

        /**
         * @name createBoard
         * @description Crea una instancia DOM del tablero de juego.
         * @param {number} x - Cantidad de posiciones horizontales que tendrá el tablero.
         * @param {number} y - Cantidad de posiciones verticales que tendrá el tablero.
         */
        Interface.prototype.createBoard = function (x, y) {
            var that = this;

            // Creamos el contenedor y la tabla.
            var container = w.document.createElement("div"),
                table = w.document.createElement("table");

            // Asignamos las clases al contenedor y a la tabla.
            container.className = "poop-table-container";
            table.className = "poop-table";

            // Vaciamos el tablero que se guarda en memoria.
            that.board = {};

            // Construimos la tabla.
            for (var i = 0; i < x; i++) {
                var tr = w.document.createElement("tr");

                for (var j = 0; j < y; j++) {
                    var td = w.document.createElement("td");

                    // Añadimos los atributos necesarios a la columna.
                    td.setAttribute("value", "");
                    td.setAttribute("selected", "0");

                    // NOTE: Si el evento "ontouchstart" es "undefined" significa que no soporta el touch, pero si es "null"
                    //       significa que sí lo soporta.
                    if (td.ontouchstart !== undefined) {
                        // Evento al iniciar el touch.
                        td.ontouchstart = (function (xPos, yPos) {
                            return function () {
                                that.game.board.startTouch(xPos, yPos);
                            };
                        })(i, j);

                        // Evento al finalizar el touch.
                        td.ontouchend = (function (xPos, yPos) {
                            return function () {
                                that.game.board.endTouch(xPos, yPos);
                            };
                        })(i, j);

                        // Evento al mover el touch.
                        td.ontouchmove = function () {
                            that.game.board.cancelTouch();
                        };
                    }
                    else {
                        // Evento para marcar una casilla.
                        td.onclick = (function (xPos, yPos) {
                            return function () {
                                that.game.board.checkOff(xPos, yPos);
                            };
                        })(i, j);

                        // Evento para marcar una bandera o una interrogación.
                        td.oncontextmenu = (function (xPos, yPos) {
                            return function () {
                                that.game.board.setFlag(xPos, yPos);
                            };
                        })(i, j);
                    }

                    // Guardamos la referencia de la casilla en memoria.
                    that.board[_constants.cells.genetaId(i, j)] = td;

                    // Añadimos la columna a la fila.
                    tr.appendChild(td);
                }

                table.appendChild(tr);
            }

            // Desactivamos el menú del clic derecho para el tablero de juego.
            table.oncontextmenu = function (event) {
                event.preventDefault();
            };

            // Si ya existe un tablero actual entonces lo vaciamos.
            if (that.boardContainer) that.container.removeChild(that.boardContainer);

            // Añadimos la tabla al contenedor, guardamos el contenedor y lo instanciamos.
            container.appendChild(table);
            that.boardContainer = container;
            that.container.appendChild(that.boardContainer);
        };

        /**
         * @name updateCountPoops
         * @description Actualiza la cantidad de "minas" que quedan por detectar.
         * @param {number} totalPoops - Cantidad total de minas que queda por detectar.
         */
        Interface.prototype.updateCountPoops = function (totalPoops) {
            this.poopCounter.innerHTML = (typeof (totalPoops) === "number") ? totalPoops.toString() : "";
        };

        /**
         * @name updateTimer
         * @description Muestra el valor del temporizador en el menú de juego.
         * @param {number} time - Valor del temporizador a mostrar por pantalla.
         */
        Interface.prototype.updateTimer = function (time) {
            this.timer.innerHTML = (typeof (time) === "number") ? time.toString() : "";
        };

        /**
         * @name setDefaultFace
         * @description Muestra la cara por defecto en el menú de juego.
         */
        Interface.prototype.setDefaultFace = function () {
            this.pauseButton.className = "menu face";
        };

        /**
         * @name setVictoryFace
         * @description Muestra la cara de victoria en el menú de juego.
         */
        Interface.prototype.setVictoryFace = function () {
            this.pauseButton.className = "menu kiss";
        };

        /**
         * @name setDefeatFace
         * @description Muestra la cara de derrota en el menú de juego.
         */
        Interface.prototype.setDefeatFace = function () {
            this.pauseButton.className = "menu confounded";
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
            that.totalPoops = poops;
            that.touch = {
                type: -1,
                element: undefined,
                timeout: 0
            };

            // Calculamos el total de celdas que tenemos que seleccionar para ganar la partida.
            that.cellsToWin = (that.x * that.y) - that.poops;

            /**
             * @description Inicializa la clase Board.
             */
            function init() {
                validateAttributes();
                initBoard();
                instantiateBoard();

                // Mostramos las minas totales en el menú de juego y ponemos la cara por defecto en el menú de juego.
                that.game.interface.updateCountPoops(that.totalPoops);
                that.game.interface.setDefaultFace();
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
                that.game.interface.createBoard(that.x, that.y);
                that.game.interface.toggleMainMenu(false);
                that.game.interface.toggleGameMenu(true);
            };

            init();
        };

        /**
         * @name checkOff
         * @description Evento clic izquierdo para marcar una casilla.
         * @param {number} x - Posición horizontal de la casilla.
         * @param {number} y - Posición vertical de la casilla.
         */
        Board.prototype.checkOff = function (x, y) {
            if (!this.game.isGameOver) {
                // Inicializamos el temporizador.
                this.game.startTimer();

                // Marcamos la casilla seleccionada.
                this.markCell(x, y, false);

                // Comprobamos si el usuario ha finalizado o no la partida.
                if (this.cellsToWin <= 0) {
                    this.game.gameOver(true);
                }
            }
        };

        /**
         * @name markCell
         * @description Marca la casilla proporcionada por parámetros.
         * @param {number} xPos - Número de fila a comprobar.
         * @param {number} yPos - Número de columna a comprobar.
         * @param {boolean} ignoreFlag - Si este valor es "false" y se marca una casilla con una bandera
         *                               o interrogación no pasará nada. Si este valor está a "true" y se
         *                               marca una casilla con una bandera o interrogación entonces las
         *                               quitará para marcar la casilla.
         */
        Board.prototype.markCell = function (xPos, yPos, ignoreFlag) {
            // En caso de que la celda no sea válida salimos de la función.
            if (this.board[xPos] === undefined) return;
            if (this.board[xPos][yPos] === undefined) return;

            // Cogemos la celda.
            var cell = this.game.interface.board[_constants.cells.genetaId(xPos, yPos)];
            if (!cell) throw new Error("PoopFinder: No se ha encontrado el elemento x = '" + xPos + "' e y = '" + yPos + "'.");

            // Cogemos el valor que tiene la celda.
            var value = w.parseInt(cell.getAttribute("value")),
                selected = w.parseInt(cell.getAttribute("selected"));

            // Solo marcamos la celda si ésta no está seleccionada y si no tiene valor o si el flag "ignoreFlag" está activo.
            if (selected === 0 && (w.isNaN(value) || ignoreFlag)) {
                if (this.board[xPos][yPos] === _constants.cells.poop) {
                    // Esta casilla tiene una mina, por tanto, fin del juego.
                    this.game.gameOver(false);
                }
                else {
                    // NOTE: En caso de que la celda tenga un valor numérico tenemos que quitar la bandera o la interrogación, ya que si el código ha llegado
                    //       hasta aquí significa que el flag "ignoreFlag" está a "true", por tanto esta casilla se ha tenido que marcar de forma automática.
                    if (!w.isNaN(value)) {
                        if (value === _constants.cells.flag) {
                            // Como esta casilla no tiene una mina le quitamos la bandera y le sumamos uno al contador.
                            cell.className = "";
                            this.totalPoops++;
                            this.game.interface.updateCountPoops(this.totalPoops);
                        }
                        else if (value === _constants.cells.questionMark) {
                            // Como esta casilla no tiene una mina le quitamos la interrogación.
                            cell.className = "";
                        }
                    }

                    // Marcamos la casilla.
                    cell.setAttribute("value", this.board[xPos][yPos]);
                    cell.className = "selected cell-" + this.board[xPos][yPos];
                    cell.setAttribute("selected", "1");

                    // Restamos la celda seleccionada.
                    this.cellsToWin--;

                    if (this.board[xPos][yPos] === 0) {
                        // En caso de que no haya ninguna mina alrededor de esta casilla marcaremos todas las casillas de alrededor.
                        for (var x = xPos - 1; x <= xPos + 1; x++) {
                            for (var y = yPos - 1; y <= yPos + 1; y++) {
                                if (this.board[x] !== undefined) {
                                    if (this.board[x][y] !== undefined) {
                                        this.markCell(x, y, true);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // Comprobamos si alrededor hay alguna casilla la cual no tenga minas alrededor para poder marcarla automáticamente.
                        for (var x = xPos - 1; x <= xPos + 1; x++) {
                            for (var y = yPos - 1; y <= yPos + 1; y++) {
                                if (this.board[x] !== undefined) {
                                    if (this.board[x][y] === 0) {
                                        this.markCell(x, y, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        /**
         * @name showPoops
         * @description Muestra todas las "minas" del tablero de juego.
         */
        Board.prototype.showPoops = function () {
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    if (this.board[x][y] === _constants.cells.poop) {
                        var cell = this.game.interface.board[_constants.cells.genetaId(x, y)];
                        cell.className = "explosion mine";
                    }
                }
            }
        };

        /**
         * @name showFlags
         * @description Muestra todas las banderas del tablero de juego.
         */
        Board.prototype.showFlags = function () {
            // Recorremos el tablero de juego para mostrar las banderas y restar el total de "minas".
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    if (this.board[x][y] === _constants.cells.poop) {
                        var cell = this.game.interface.board[_constants.cells.genetaId(x, y)];

                        if (cell.className.indexOf("flag") === -1) {
                            cell.className = "flag";
                            this.totalPoops--;
                        }
                    }
                }
            }

            // Actualizamos el total de "minas" en el menú de juego.
            this.game.interface.updateCountPoops(this.totalPoops);
        };

        /**
         * @name setFlag
         * @description Evento clic derecho para marcar una casilla con una bandera, con una posible bandera o le quita las banderas.
         * @param {number} x - Posición horizontal de la casilla.
         * @param {number} y - Posición vertical de la casilla.
         */
        Board.prototype.setFlag = function (x, y) {
            if (!this.game.isGameOver) {
                // Inicializamos el temporizador.
                this.game.startTimer();

                // Cogemos la celda y su valor.
                var cell = this.game.interface.board[_constants.cells.genetaId(x, y)];
                var value = w.parseInt(cell.getAttribute("value"));

                if (w.isNaN(value)) {
                    // Si no hay valor entonces marcamos la casilla con una bandera.
                    cell.setAttribute("value", _constants.cells.flag);
                    cell.className = "flag";
                    this.totalPoops--;
                    this.game.interface.updateCountPoops(this.totalPoops);
                }
                else if (value === _constants.cells.flag) {
                    // Si hay una bandera en la casilla entonces la volvemos a marcar con un interrogante (quitando la bandera).
                    cell.setAttribute("value", _constants.cells.questionMark);
                    cell.className = "question-flag";
                    this.totalPoops++;
                    this.game.interface.updateCountPoops(this.totalPoops);
                }
                else if (value === _constants.cells.questionMark) {
                    // Si hay un interrogante en la casilla entonces la dejamos vacía.
                    cell.setAttribute("value", "");
                    cell.className = "";
                }
            }
        };

        /**
         * @name startTouch
         * @description Inicio del evento touch. Si el usuario mantiene medio segundo el botón presionado el tipo de touch cambia.
         * @param {number} x - Posición horizontal de la casilla.
         * @param {number} y - Posición vertical de la casilla.
         */
        Board.prototype.startTouch = function (x, y) {
            var that = this;

            that.touch.type = 0;
            that.touch.element = that.game.interface.board[_constants.cells.genetaId(x, y)];

            that.touch.timeout = w.setTimeout(function () {
                that.touch.type = 1;
            }, _constants.touch.timeout);
        };

        /**
         * @name endTouch
         * @description Fin del evento touch. Dependiendo del tipo de touch pone una bandera o marca la casilla seleccionada.
         * @param {number} x - Posición horizontal de la casilla.
         * @param {number} y - Posición vertical de la casilla.
         */
        Board.prototype.endTouch = function (x, y) {
            // Cancelamos el timeout del evento touch.
            w.clearTimeout(this.touch.timeout);
            this.touch.timeout = 0;

            if (this.touch.type === 0) {
                this.checkOff(x, y);
            }
            else if (this.touch.type === 1) {
                this.setFlag(x, y);
            }
        };

        /**
         * @name cancelTouch
         * @description Esta función se ejecuta cuando se ha iniciado el evento touch sobre una celda y el usuario mueve el dedo. Si mueve el dedo
         *              significa que lo que quiere es hacer scroll en la tabla, por tanto, cancelamos el evento touch.
         */
        Board.prototype.cancelTouch = function () {
            // Cancelamos el timeout del evento touch.
            clearTimeout(this.touch.timeout);
            this.touch.timeout = 0;

            this.touch.type = -1;
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
            this.isGameOver = false;
            this.isGamePaused = false;
            this.difficulty = "";
            this.timer = 0;
            this.timerInterval = 0;
        };

        /**
         * @name newGame
         * @description Comienza una nueva partida en la dificultad proporcionada por parámetros.
         * @param {string} difficulty - Dificultad de la nueva partida.
         */
        PoopFinder.prototype.newGame = function (difficulty) {
            this.difficulty = difficulty;
            this.isGameOver = false;
            this.isGamePaused = false;
            this.timer = 0;
            this.interface.updateTimer(this.timer);

            switch (difficulty) {
                case _constants.difficulty.easy:
                    this.board = new BoardCtrl(9, 9, 10, this);
                    break;
                case _constants.difficulty.normal:
                    this.board = new BoardCtrl(16, 16, 40, this);
                    break;
                case _constants.difficulty.hard:
                    this.board = new BoardCtrl(16, 30, 99, this);
                    break;
                default:
                    this.difficulty = "";
                    throw new Error("PoopFinder: La dificultad '" + difficulty + "' no es válida.");
            }
        };

        /**
         * @name gameOver
         * @description Indica el fin de la partida.
         * @param {boolean} hasWon - Indica si el usuario ha ganado o no.
         */
        PoopFinder.prototype.gameOver = function (hasWon) {
            this.isGameOver = true;
            this.stopTimer();

            if (!hasWon) {
                this.interface.setDefeatFace();
                this.board.showPoops();
            }
            else {
                this.interface.setVictoryFace();
                this.board.showFlags();
            }
        };

        /**
         * @name startTimer
         * @description Inicializa el temporizador.
         */
        PoopFinder.prototype.startTimer = function () {
            var that = this;

            if (that.timerInterval === 0) {
                that.timer = 0;

                that.timerInterval = w.setInterval(function () {
                    if (!that.isGamePaused) {
                        // Incrementamos el temporizador y lo redondeamos a un decimal.
                        that.timer = w.Math.round( (that.timer + _constants.timer.increase) * 10 ) / 10;

                        // Si el temporizador no tiene decimales lo actualizamos en el menú de juego.
                        if (that.timer % 1 === 0) {
                            that.interface.updateTimer(that.timer);
                        }
                    }
                }, _constants.timer.interval);
            }
        };

        /**
         * @name stopTimer
         * @description Para el temporizador.
         */
        PoopFinder.prototype.stopTimer = function () {
            if (this.timerInterval !== 0) {
                w.clearInterval(this.timerInterval);
                this.timerInterval = 0;
            }
        };

        return PoopFinder;
    })();

    return GameCtrl;
})(window);
