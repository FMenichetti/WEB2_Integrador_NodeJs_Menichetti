

//referencias elementos HTML
//const elemForm = document.getElementById('form');
const spinner = document.getElementById('spinner');
//Elementos html
const rbIndividual = document.getElementById('filtroIndividual');
const rbAnidado = document.getElementById('filtroAnidado');
//botones
const btnDepto = document.getElementById('btnBuscarDepto');
const btnLocation = document.getElementById('btnBuscarLocation');
const btnPalabra = document.getElementById('btnBuscarPalabra');
const btnSubmit = document.getElementById('btnSubmit');
//galeria
const galeria = document.getElementById('gallery');

//error
const divError = document.getElementById('errorSeleccion');

//////////////////////Funciones//////////////////////

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

export const mostrarErrorFiltrosVacios = (num) => {
    if (num === 1) {
        divError.style.display = 'block';
    } else {
        divError.style.display = 'none';
    }
}

export const mostrarSpinner = (num) => {
    if (num === 1) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}

export const borroGaleria = () => {
    galeria.innerHTML = '';
}

export const limpiarFiltros = () =>{
    document.getElementById('departmentSelect').selectedIndex = 0;
    document.getElementById('localSelect').selectedIndex = 0;
    document.getElementById('inputPalabra').value = '';
}