
const objectIDs = [];

/**
 * 
 * @param {*} palabra 
 */
export const getIdPorPalabra = async (palabra) => {
    try {

        const urlPalabra = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}`;
        const respuesta = await fetch(urlPalabra);
        const data = await respuesta.json();



        let objetosFiltrados = await getObjPorId(data);
        return objetosFiltrados;
    } catch (error) {
            console.log(error)
            console.log('No se encontro resultado para esa palabra clave')
    }

}

const getObjPorId = async (obj) => {
    //Si los IDs son mas de 0
    let museos = [];
    try {

        if (obj.objectIDs && obj.objectIDs.length > 0) {
            for (const id of obj.objectIDs) {
                const urlDetalle = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
                const respuesta = await fetch(urlDetalle);
                const data = await respuesta.json();

                if (data.primaryImageSmall !== '') { //Si tiene imagen lo agrego
                    museos.push(data); // Agrego el objeto completo al array
                }

                if (museos.length > 10) { //limito la busqueda
                    return museos;
                    break;
                }
            }
        } else {
            console.log('No se encontraron objetos.');
        }
    } catch (error) {
        console.log(error)
        console.log('No se pudieron obtener los objetos de los IDs del filtro palabra')
    }
}