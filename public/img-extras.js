

// Obtener el objeto codificado de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const objetoStr = params.get('objeto');

// Decodificar y convertir a un objeto JavaScript
const objeto = JSON.parse(decodeURIComponent(objetoStr));

// Mostrar el título del objeto
const titulo = document.getElementById('title');
titulo.classList = 'card-title m-3 '
titulo.textContent = `Imágenes adicionales para: ${objeto.title}`;

// Mostrar las imágenes adicionales
const imagenesDiv = document.getElementById('imagenes');
objeto.additionalImages.forEach(image => {
    const col = document.createElement('div');
    col.className = 'col-md-3 ';

    const img = document.createElement('img');
    img.src = image;
    img.className = 'img-fluid';

    col.appendChild(img);
    imagenesDiv.appendChild(col);

});
