

// Función para crear y agregar las cards al contenedor

import * as metodo from "./metodos.js";

//recibo el objeto a pintar y la pagina actual para pasarla al volver de la pagina de extras
export const crearCards = async( objetos ) => {

localStorage.clear();

    const gallery = document.getElementById('gallery');

    if (!objetos || objetos.length === 0) {
        let error = document.createElement('h3')
        error.textContent = "No se encontraron datos para su busqueda"
        gallery.appendChild(error);

    } else {

        objetos.forEach(objeto => {

            // Crear el contenedor principal de la card
            const cardCol = document.createElement('div');
            cardCol.className = 'col tarj ';

            const card = document.createElement('div');
            card.className = 'card h-100 tarj-body ';

            // Crear el elemento img para la imagen de la card
            const img = document.createElement('img');
            img.className = 'card-img-top tarj';
            img.src = objeto.primaryImage || 'https://via.placeholder.com/150';
            img.title = objeto.objectDate || 'Fecha sin data';

            // Crear el cuerpo de la card
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body tarj-body';

            // Crear el título de la card
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title tarj-title';
            cardTitle.textContent = objeto.title;

            // Crear el texto para la cultura
            const cardCulture = document.createElement('p');
            cardCulture.className = 'card-text';
            cardCulture.textContent = `Cultura: ${objeto.culture || 'Cultura sin identificar'}`;

            // Crear el texto para la dinastía
            const cardDynasty = document.createElement('p');
            cardDynasty.className = 'card-text';
            cardDynasty.textContent = `Dinastía: ${objeto.dynasty || 'Dinastia sin especificar'}`;



            // Agregar los elementos al cuerpo de la card
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardCulture);
            cardBody.appendChild(cardDynasty);

            // Si hay más imágenes, agregar un botón
            if (objeto.additionalImages && objeto.additionalImages.length > 0) {
                const btnVerMas = document.createElement('button');
                btnVerMas.className = 'btn btn-outline-secondary mt-2';
                btnVerMas.textContent = 'Ver más imágenes';
                btnVerMas.onclick = function () {
                    // convierto obj en url Json
                    metodo.guardarUltimaPagina( objetos )
                    const objetoStr = encodeURIComponent(JSON.stringify(objeto));

                    // redirijo al html img-adicionales
                    window.location.href = `/add?objeto=${objetoStr}`;
                };

                cardBody.appendChild(btnVerMas);
            }

            // Agregar la imagen y el cuerpo a la card
            card.appendChild(img);
            card.appendChild(cardBody);

            // Agregar la card al contenedor de la columna
            cardCol.appendChild(card);

            // Agregar la columna con la card al contenedor principal de la galería
            gallery.appendChild(cardCol);
        });
    }

}


