import * as card from './card.js';
import * as metodos from './metodos.js';

// Variables globales
let indice;
let extra;
let palabra;
let indiceLocal;
let textLocal;
//////////////////////////Funciones de consulta a Back
//////////////////////////Traigo los departamentos y los agrego a la ddl//////////////////////////////
export const traerIdDeptos = async () => {
    //url de consulta de deptos al back
    const url = `/api/traerIdDeptos`;

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        const elemDepartmentos = document.getElementById('departmentSelect');

        for (const departamento of data) {
            const option = document.createElement('option');

            // Tomo el nombre para el DDL
            option.textContent = departamento.displayName;

            // Le agrego el valor de ID a la opcion
            option.value = departamento.departmentId;

            elemDepartmentos.appendChild(option);
        }
    }
    catch (error) {
        console.error('Error al cargar departamentos:', error);
    }

}
////////////////////////////////Traigo los museos del back/////////////////////////////////////////////
export const traerMuseosBack = async( pagina = 1 ) => {
//recibo la pagina actual, 
//limpio storage
localStorage.clear()
//paso la pagina al back
    const apiUrl = `/api/traerMuseosBack?pagina=${ pagina }`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('No hubo respuesta del servidor');
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}
//Genero la url y la mando al back
export const filtro = async (filtro1, filtro2, filtro3, depto, local, palabra) => {

    let url = '';

    if (filtro1 && filtro2 && filtro3) {
        url = `/api/buscar?filtro1=true&filtro2=true&filtro3=true&geoLocation=${local}&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && filtro2 && !filtro3) {
        url = `/api/buscar?filtro1=true&filtro2=true&filtro3=false&geoLocation=${local}&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && !filtro2 && filtro3) {
        url = `/api/buscar?filtro1=true&filtro2=false&filtro3=true&palabra=${palabra}&depto=${depto}`;
    } else if (filtro1 && !filtro2 && !filtro3) {
        url = `/api/buscar?filtro1=true&filtro2=false&filtro3=false&depto=${depto}`;//
    } else if (!filtro1 && filtro2 && filtro3) {
        url = `/api/buscar?filtro1=false&filtro2=true&filtro3=true&local=${local}&palabra=${palabra}`;
    } else if (!filtro1 && filtro2 && !filtro3) {
        url = `/api/buscar?filtro1=false&filtro2=true&filtro3=false&local=${local}&palabra=''`;
    } else if (!filtro1 && !filtro2 && filtro3) {
        url = `/api/buscar?filtro1=false&filtro2=false&filtro3=true&palabra=${palabra}`;
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

export const runBusqueda = async ( pagina ) => { //tengo dentro la funcion de filtro y buscar museos por id
    //limpio storage
    localStorage.clear();
    
    //Elementos html
    indice = document.getElementById('departmentSelect').selectedIndex;
    extra = document.getElementById('departmentSelect').options[indice].text;
    indiceLocal = document.getElementById('localSelect').selectedIndex;
    textLocal = document.getElementById('localSelect').value;
    palabra = document.getElementById('inputPalabra').value;

    let filtro1 = false;
    let filtro2 = false;
    let filtro3 = false;


    if (indice !== 0) {
        filtro1 = true;
    }
    if (indiceLocal !== 0) {
        filtro2 = true;
    }
    if (palabra !== '') {
        filtro3 = true;
    }

    if (!filtro1 && !filtro2 && !filtro3) {
        metodos.mostrarErrorFiltrosVacios(1);
        metodos.mostrarSpinner(0);
        return;
    } else {
        metodos.mostrarErrorFiltrosVacios(0);
    }
    //obtengo array de ids pero los manejo en el back
     await filtro(filtro1, filtro2, filtro3, indice, textLocal, palabra);
    
    const datosBack = await traerMuseosBack( pagina );
    
    //console.log('Datos obtenidos:', datosBack);
    card.crearCards(datosBack, pagina)

    metodos.mostrarSpinner(0);
    //metodos.limpiarFiltros();
    metodos.btnPaginacion( pagina );

}









/**
 * 
 * @param {recibe objeto con id y busca individual, descarte y busco en back} obj 
 * @returns 
 */
// export const traerMuseosConId = async (obj) => {
//     let deptos = [];
//     try {
//         console.log(obj);

//         for (let id of obj) {
//             //console.log(id)
//             const url = `/api/traerMuseosConId?ids=${id}`;
//             const respuesta = await fetch(url);
//             const data = await respuesta.json();
            
//             if (data.primaryImageSmall !== '' ) { // Verifica si el objeto tiene imagen
//                 deptos.push(data); // Agrega el objeto completo al array
//             }

//             if (deptos.length >= 10) break; // Limita la búsqueda si ya tienes 10 objetos
//         }

//         return deptos;
//     } catch (error) {
//         console.error('Error al obtener los objetos por ID:', error);
//     }
// };



/**
 * Funcion que recibe id y en base a ese id trae todos los departamentos
 * Los departamentos se los pasa a getObjectId //////////descartada
 * @param {*num} id 
 * @returns array con objetos depsrtamentos completos
 */
// export const listarIdFiltrados = async (id) => {
//     try {
//         const url = `/api/individual/${id}`;
//         const respuesta = await fetch(url);
//         const data = await respuesta.json();

//         // Limitar a los primeros 20 IDs 
//         //decidi limitarlo en objectPorId
//         // const limitedObjectIDs = data.objectIDs.slice(0, 20);

//         const deptosFiltrados = await getObjPorId(data.objectIDs);
//         return deptosFiltrados;
//     } catch (error) {
//         console.error('Error al listar los IDs filtrados:', error);
//     }
// }



