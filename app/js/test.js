// @ts-check
"use strict";

var game = undefined;

window.onload = function () {
    console.info("¡Bienvenido a PoopFinder!");
    
    game = new PoopFinderGame("container");
    console.log(game);
};
