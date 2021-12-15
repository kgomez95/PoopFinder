# PoopFinder
Buscaminas en HTML, CSS y JavaScript.
<br/>

# ¿Cómo importarlo?
<p>Para importar PoopFinder en tu página web tienes que descargar los dos siguientes ficheros (los cuales puedes encontrar en la carpeta "app/lib" de este repositorio):</p>
<ul>
    <li>poop-finder/js/poop-finder.min.js</li>
    <li>poop-finder/css/poop-finder.min.css</li>
</ul>
<p>Una vez descargados simplemente tienes que importarlos en tu fichero "index.html" (o en el fichero donde cargues tus recursos).</p>
<br/>

# ¿Cómo instanciar el juego?
<p>1.- Lo primer es tener un contenedor donde se instanciará el juego. Este contenedor debe tener un identificador único (tag "id").</p>
<p>2.- Una vez tengas el contenedor con su identificador tienes que instanciar en JavaScript un objeto de tipo "PoopFinderGame" indicándole como argumento el identificador de tu contenedor.</p>
<p><i>var game = new PoopFinderGame("container");</i></p>
<br/>
<p>En el fichero "app/js/test.js" de este repositorio tienes un ejemplo donde se crea una instancia del juego.</p>
<br/>

# Anexos
<p>Fuente de la imagen Favicon:</p>
<ul>
    <li>https://yourpng.com/photo/21298/poop-sad-emoji-icon-png-transparent-images-free</li>
</ul>
<br/>

<p>Carácteres HTML para los emojis:</p>
<ul>
    <li>https://html-css-js.com/html/character-codes/</li>
</ul>
<br/>

<p>Paquetes utilizados para minimizar los ficheros ".js" y ".css":</p>
<ul>
    <li>https://www.npmjs.com/package/grunt</li>
    <li>https://www.npmjs.com/package/grunt-cli</li>
    <li>https://www.npmjs.com/package/grunt-contrib-uglify</li>
    <li>https://www.npmjs.com/package/grunt-contrib-cssmin</li>
</ul>
<br/>
