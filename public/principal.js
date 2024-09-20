import * as consultasBack from './js/consultasBack.js';
import * as metodos from './js/metodos.js';
import * as card from './js/card.js';

console.log('andando')

// Variables globales
let indice;
let palabra;
let indiceLocal;
let textLocal;
const listaLocal = ['Mexico', 'Guatemala', 'United States', 'England', 'Spain', 'Netherlands', 'Canada', 'China', 'Italy', 'Germany', 'Japan', 'Czech Republic', 'France'];
let pagina = 1;
//Elementos html
const rbIndividual = document.getElementById('filtroIndividual');
const rbAnidado = document.getElementById('filtroAnidado');
//botones
const btnDepto = document.getElementById('btnBuscarDepto');
const btnLocation = document.getElementById('btnBuscarLocation');
const btnPalabra = document.getElementById('btnBuscarPalabra');
const btnSubmit = document.getElementById('btnSubmit');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');


//inicio
metodos.mostrarSpinner(0);
metodos.mostrarErrorFiltrosVacios(0);


//Carga de DDL y carga de array de dtos//ok
// (async () => {
//     try {
//         await consultasBack.traerIdDeptos();
//     } catch (error) {
//         console.error('Error al cargar los departamentos:', error);
//     }
// })();


//Carga de location de array local
// (async () => {
//     const elemLocal = document.getElementById('localSelect');//id de select
//     let cont = 0;

//     for (const local of listaLocal) {
//         const option = document.createElement('option');

//         // Tomo el nombre para el DDL
//         option.textContent = local;

//         // Le agrego el valor de ID a la opcion
//         option.value = local;
//         cont++
//         // Agrego la opción al select
//         elemLocal.appendChild(option);
//     }
// })();

//Escucho los cambios de estado en los rb
rbIndividual.addEventListener('change', metodos.elijoFiltro);
rbAnidado.addEventListener('change', metodos.elijoFiltro);

//Buscar por depto individual
btnDepto.addEventListener('click', async () => {

    document.getElementById('localSelect').selectedIndex = 0;
    document.getElementById('inputPalabra').value = '';

    pagina = 1
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    const indice = document.getElementById('departmentSelect').selectedIndex;
    if (indice === 0) {
        metodos.mostrarSpinner(0);
        metodos.mostrarErrorFiltrosVacios(1);
        return;
    }
    
    await consultasBack.runBusqueda( pagina );
})

//Buscar por Location
btnLocation.addEventListener('click', async () => {

    document.getElementById('departmentSelect').selectedIndex = 0;
    document.getElementById('inputPalabra').value = '';

    pagina = 1
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    let indice = document.getElementById('localSelect').selectedIndex;

    if (indice === 0) {
        metodos.mostrarErrorFiltrosVacios(1);
        metodos.mostrarSpinner(0);
        return;
    }

    await consultasBack.runBusqueda( pagina );
})
//Buscar por palabra
btnPalabra.addEventListener('click', async () => {

    document.getElementById('departmentSelect').selectedIndex = 0;
    document.getElementById('localSelect').selectedIndex = 0;

    pagina = 1
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    const palabra = document.getElementById('inputPalabra').value;

    if (palabra === '') {
        metodos.mostrarErrorFiltrosVacios(1);
        metodos.mostrarSpinner(0);
        return;
    }

    await consultasBack.runBusqueda( pagina );

})

// Agrega un evento al formulario para el submit
btnSubmit.addEventListener('click', async (event) => {

    pagina = 1
    event.preventDefault();
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    await consultasBack.runBusqueda( pagina );
    

})
//Paginacion eventos
btnSiguiente.addEventListener('click', async () => {

    pagina ++;
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    const datosBack = await consultasBack.traerMuseosBack( pagina );
    
    card.crearCards(datosBack)

    metodos.mostrarSpinner(0);
    metodos.limpiarFiltros();
    metodos.btnPaginacion( pagina );

});

btnAnterior.addEventListener('click', async() => {
    
    pagina --;
    metodos.borroGaleria();
    metodos.mostrarSpinner(1);
    metodos.mostrarErrorFiltrosVacios(0);

    const datosBack = await consultasBack.traerMuseosBack( pagina );
    
    card.crearCards(datosBack)

    metodos.mostrarSpinner(0);
    metodos.limpiarFiltros();
    metodos.btnPaginacion( pagina );

});



//Carga de DDL de Location con consulta, esta sin usar////activar en caso de usar
// (async () => {  ///////////////no la hice, la url ver que onda

//     let cont = 0;

//     try {
//         // Realiza la solicitud a la API
//         const url = `http://localhost:3000/api/traerLocal`;
//         const response = await fetch(url);

//         // Verifica si la respuesta es exitosa
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         // Convierte la respuesta a JSON
//        const data = await response.json();

//        const elemLocal = document.getElementById('localSelect');//id de select

//         for (const local of data) {
//             const option = document.createElement('option');

//             // Tomo el nombre para el DDL
//             option.textContent = local.displayName;

//             // Le agrego el valor de ID a la opcion
//             option.value = cont;
//             cont++
//             // Agrego la opción al select
//             elemLocal.appendChild(option);
//         }

       
//     } catch (error) {
//         console.error('Hubo un problema con la solicitud:', error);
//     }
// });