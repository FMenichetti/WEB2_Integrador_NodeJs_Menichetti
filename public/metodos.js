

//referencias elementos HTML
//const elemForm = document.getElementById('form');
const spinner = document.getElementById('spinner');
//Elementos html
//botones
const btnDepto = document.getElementById('btnBuscarDepto');
const btnLocation = document.getElementById('btnBuscarLocation');
const btnPalabra = document.getElementById('btnBuscarPalabra');
const btnSubmit = document.getElementById('btnSubmit');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

//galeria
const galeria = document.getElementById('gallery');

//error
const divError = document.getElementById('errorSeleccion');

//////////////////////Funciones//////////////////////
//Alterno botones de busqueda mediante el RB
export const elijoFiltro = () => {
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
//Si no lleno un filtro e intento buscar sale este error
export const mostrarErrorFiltrosVacios = (num) => {
    if (num === 1) {
        divError.style.display = 'block';
    } else {
        divError.style.display = 'none';
    }
}
//Muestro u oculto spinner
export const mostrarSpinner = (num) => {
    if (num === 1) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}
//Limpio las cards
export const borroGaleria = () => {
    galeria.innerHTML = '';
    btnAnterior.style.display = 'none';
    btnSiguiente.style.display = 'none';
}
//Limpia los filtros
export const limpiarFiltros = () => {
    document.getElementById('departmentSelect').selectedIndex = 0;
    document.getElementById('localSelect').selectedIndex = 0;
    document.getElementById('inputPalabra').value = '';
}
//manejo visibilidad de anterior y siguiente
export const btnPaginacion = (pagina = 1) => {
    const totalPaginas = 4; // Total de páginas

    if (pagina === 1) {
        btnAnterior.style.display = 'none';   // Ocultar "Anterior" en la primera página
        btnSiguiente.style.display = 'block'; // Mostrar "Siguiente"
    } else if (pagina === totalPaginas) {
        btnAnterior.style.display = 'block';  // Mostrar "Anterior"
        btnSiguiente.style.display = 'none';  // Ocultar "Siguiente" en la última página
    } else {
        btnAnterior.style.display = 'block';  // Mostrar ambos botones en páginas intermedias
        btnSiguiente.style.display = 'block';
    }
}
//Guardar ultima pagina
export function guardarUltimaPagina(datos) {
    localStorage.setItem('ultimaPagina', JSON.stringify(datos));
}
//Recuperar ultima pagina
export function recuperarUltimaPagina() {
    const datosGuardados = localStorage.getItem('ultimaPagina');
    return datosGuardados ? JSON.parse(datosGuardados) : null;
}



