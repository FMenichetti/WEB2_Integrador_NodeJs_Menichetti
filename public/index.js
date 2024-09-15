import * as getPalabra from './js/getPalabra.js';
import * as getLocation from './js/getLocation.js';
import * as getDepartamentos from './js/getDepartamentos.js';
import * as getCard from './js/card.js';
// Variables globales
let indice;
let palabra;
let localizacion;

//Funciones
/////////////////////////////////////////////////////////////////////
async function traerMuseosBack() {
    const apiUrl = 'http://localhost:3000/api/test';
    try {
        // Realiza la solicitud a la API
        const response = await fetch(apiUrl);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        return data;
        // Aquí puedes procesar los datos recibidos
        // Por ejemplo, llamar a una función para crear cards
        //crearCards(data);
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}

const elijoFiltro = () => {
    const rbIndividual = document.getElementById('filtroIndividual');
    const rbAnidado = document.getElementById('filtroAnidado');

    if (rbIndividual.checked) {
        btnSubmit.style.display = 'none';
        btnDepto.style.display = 'block';
        btnLocation.style.display = 'block';
        btnPalabra.style.display = 'block';
    } else if (rbAnidado.checked) {
        btnSubmit.style.display = 'block';
        btnDepto.style.display = 'none';
        btnLocation.style.display = 'none';
        btnPalabra.style.display = 'none';
    }
}

const mostrarErrorFiltrosVacios = (num) => {
    if (num === 1) {
        divError.style.display = 'block';
    } else {
        divError.style.display = 'none';
    }
}

const mostrarSpinner = (num) => {
    if (num === 1) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}

const borroGaleria = () => {
    galeria.innerHTML = '';
}

const filtro = async (filtro1, filtro2, filtro3, depto, local, palabra) => {

    let url = '';

    if (filtro1 && filtro2 && filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=true&filtro2=true&filtro3=true&geoLocation=${local}&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && filtro2 && !filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=true&filtro2=true&filtro3=false&geoLocation=${local}&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && !filtro2 && filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=true&filtro2=false&filtro3=true&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && !filtro2 && !filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=true&filtro2=false&filtro3=false&depto=${depto}`;
    } else if (!filtro1 && filtro2 && filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=false&filtro2=true&filtro3=true&local=${local}&palabra=${palabra}`;
    } else if (!filtro1 && filtro2 && !filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=false&filtro2=true&filtro3=false&local=${local}&palabra=''`;
    } else if (!filtro1 && !filtro2 && filtro3) {
        url = `http://localhost:3000/api/buscar?filtro1=false&filtro2=false&filtro3=true&palabra=${palabra}`;
    } else if (!filtro1 && !filtro2 && !filtro3) {
        return []; // Ningún filtro seleccionado
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        return [];
    }
};

const runBusqueda = async () => { //tengo dentro la funcion de filtro y buscar museos por id
    //Elementos html
    indice = document.getElementById('departmentSelect').selectedIndex;
    localizacion = document.getElementById('locationInput').value;
    palabra = document.getElementById('keywordInput').value;

    let filtro1 = false;
    let filtro2 = false;
    let filtro3 = false;


    if (indice !== 0) {
        filtro1 = true;
    }
    if (localizacion !== '') {
        filtro2 = true;
    }
    if (palabra !== '') {
        filtro3 = true;
    }

    if (!filtro1 && !filtro2 && !filtro3) {
        mostrarErrorFiltrosVacios(1);
        mostrarSpinner(0);
        return;
    } else {
        mostrarErrorFiltrosVacios(0);
    }
    //obtengo array de ids
    let dataId = [];
    dataId = await filtro(filtro1, filtro2, filtro3, indice, localizacion, palabra);
    //let objListos = [];

    //let primeros20 = dataId.objectIDs.slice(0, 20);

    //objListos = await getDepartamentos.traerMuseosConId(primeros20);
    //console.log(objListos)

    // Probando obtener los datos desde el back
    const datosBack = await traerMuseosBack();
    
    console.log('Datos obtenidos:', datosBack);
    getCard.crearCards(datosBack)

    //Oculto spinner
    mostrarSpinner(0);

    //return objListos;
}

//referencias elementos HTML
//const elemForm = document.getElementById('form');
const spinner = document.getElementById('spinner');
//botones
const btnDepto = document.getElementById('btnBuscarDepto');
const btnLocation = document.getElementById('btnBuscarLocation');
const btnPalabra = document.getElementById('btnBuscarPalabra');
const btnSubmit = document.getElementById('btnSubmit');
//galeria
const galeria = document.getElementById('gallery');
//rb
const rbIndividual = document.getElementById('filtroIndividual');
const rbAnidado = document.getElementById('filtroAnidado');
//error
const divError = document.getElementById('errorSeleccion');

//inicio
mostrarSpinner(0);
mostrarErrorFiltrosVacios(0);

//Carga de DDL y carga de array de dtos//ok
(async () => {
    try {
        await getDepartamentos.traerIdDeptos();
    } catch (error) {
        console.error('Error al cargar los departamentos:', error);
    }
})();

//Carga de DDL de Location
(async () => {  ///////////////no la hice, la url ver que onda

    let cont = 0;

    try {
        // Realiza la solicitud a la API
        const url = `http://localhost:3000/api/traerLocal`;
        const response = await fetch(url);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Convierte la respuesta a JSON
       const data = await response.json();

       const elemLocal = document.getElementById('localSelect');//id de select

        for (const local of data) {
            const option = document.createElement('option');

            // Tomo el nombre para el DDL
            option.textContent = local.displayName;

            // Le agrego el valor de ID a la opcion
            option.value = cont;
            cont++
            // Agrego la opción al select
            elemLocal.appendChild(option);
        }

       
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
})();



//Escucho los cambios de estado en los rb
rbIndividual.addEventListener('change', elijoFiltro);
rbAnidado.addEventListener('change', elijoFiltro);

//Buscar por depto individual
btnDepto.addEventListener('click', async () => {

    borroGaleria();
    mostrarSpinner(1);
    mostrarErrorFiltrosVacios(0);

    const indice = document.getElementById('departmentSelect').selectedIndex;
    if (indice === 0) {
        mostrarSpinner(0);
        mostrarErrorFiltrosVacios(1);
        return;
    }
    
    await runBusqueda();
    mostrarSpinner(0);
})
//Buscar por Location
btnLocation.addEventListener('click', async () => {

    borroGaleria();
    mostrarSpinner(1);
    mostrarErrorFiltrosVacios(0);

    const localizacion = document.getElementById('locationInput').value;
    let museosFiltradosLocal = [];

    if (localizacion === '') {
        mostrarErrorFiltrosVacios(1);
        mostrarSpinner(0);
        return;
    }

    museosFiltradosLocal = await getLocation.buscarPorLocalizacion(localizacion)
    console.log(museosFiltradosLocal)

    getCard.crearCards(museosFiltradosLocal)

    //Oculto spinner
    mostrarSpinner(0);
})
//Buscar por palabra
btnPalabra.addEventListener('click', async () => {

    borroGaleria();
    mostrarSpinner(1);
    mostrarErrorFiltrosVacios(0);

    const palabra = document.getElementById('keywordInput').value;

    if (palabra === '') {
        mostrarErrorFiltrosVacios(1);
        mostrarSpinner(0);
        return;
    }

    await runBusqueda();

    mostrarSpinner(0);

})


// Agrega un evento al formulario para el submit
btnSubmit.addEventListener('click', async (event) => {

    event.preventDefault();
    borroGaleria();
    mostrarSpinner(1);
    mostrarErrorFiltrosVacios(0);

    const obj = await runBusqueda();
    //console.log(obj)
    
    //getCard.crearCards(obj);

})




///////////////////////////////
// Define la URL de tu API

// Función para obtener los datos de la API

