
import * as metodo from "./metodos.js";
const errorFiltros = document.getElementById('errorFiltros')

//recibo el objeto a pintar 
export const crearCards = async (objetos) => {
    //limpio el storage
    localStorage.clear();
    errorFiltros.style.display = 'none';
    const gallery = document.getElementById('gallery');

    if (!objetos || objetos.length === 0) {
        // let error = document.createElement('h3')
        // error.textContent = "No se encontraron datos para su busqueda"
        // gallery.appendChild(error);
        errorFiltros.style.display = 'block';
        return;
    } else {

        objetos.forEach(objeto => {

            // creo el contenedor principal de la card
            const cardCol = document.createElement('div');
            cardCol.className = 'col tarj ';

            const card = document.createElement('div');
            card.className = 'card h-100 tarj-body ';

            // Creo el elemento img para la imagen de la card
            const img = document.createElement('img');
            img.className = 'card-img-top tarj mt-1';
            img.src = objeto.primaryImage || 'https://via.placeholder.com/150';
            img.title = objeto.objectDate || 'Fecha sin data';

            // Creo el cuerpo de la card
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body tarj-body';

            // creo el título de la card
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title tarj-title';
            cardTitle.textContent = objeto.title;

            // creo el texto para la cultura
            const cardCulture = document.createElement('p');
            cardCulture.className = 'card-text';
            cardCulture.textContent = `Cultura: ${objeto.culture || 'Cultura sin identificar'}`;

            // creo el texto para la dinastía
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
                btnVerMas.className = 'btn btn-dark mt-2';
                btnVerMas.textContent = 'Ver más imágenes';
                btnVerMas.onclick = function () {
                    // convierto obj en url Json
                    metodo.guardarUltimaPagina(objetos)
                    const objetoStr = encodeURIComponent(JSON.stringify(objeto));

                    // Abre una nueva ventana o pestaña con la URL
                    window.open(`/add?objeto=${objetoStr}`, '_blank');
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


