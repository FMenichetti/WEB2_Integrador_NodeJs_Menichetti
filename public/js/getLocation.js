/**
 * 
 * @param {recibe localizacion} localizacion 
 * @returns devulve array de objectIDs de esa localizacion
 */
export const buscarPorLocalizacion = async ( localizacion ) => {

    const data = [];
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${localizacion}&q=""`;
    try {
        const respuesta = await fetch(url);
        let data = await respuesta.json();

        data = await obtenerDetallesObjeto( data )

        return data;
        // Si hay respuesta
    //     if (data.objectIDs && data.objectIDs.length > 0) {
    //         console.log(`Se encontraron ${data.objectIDs.length} objetos para la localización "${localizacion}"`);

    //     } else {
    //         console.log('No se encontraron objetos para la localización especificada.');
    //     }
    } catch (error) {
        console.error('Error al buscar por localización:', error);
    }
};

/**
 * 
 * @param {* recibe array de objetos completos} museos 
 * @returns arreglo de objetos completos
 */
export async function obtenerDetallesObjeto( data ) {

    let museos = [];

    if (data.objectIDs.length > 0) {
        for (let id of data.objectIDs) {
            const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${ id }`;
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.primaryImageSmall !== '') { //Si tiene imagen lo agrego
                museos.push(data); // Agrego el objeto completo al array
            }

            if (museos.length > 10) { //limito la busqueda
                return museos;
                break;
            }
        }

        
    }
}

// for (const id of data.objectIDs) {
//     //lleno array con objetos
//     objetos.push( await obtenerDetallesObjeto( id ) );
//     return objetos;
// }