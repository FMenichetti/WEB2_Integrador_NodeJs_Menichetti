
//array de departamentos//ok
export let departamentos = [];
/**
 * Consulta Todos los departamentos para llenar DDL
 * @returns array de objetos deptos (id + nombre) y carga en ddl
 */
export const traerIdDeptos = async () => {
    //Obtengo los Objetos de los departamentos
    const url = `http://localhost:3000/api/traerIdDeptos`;

    try {
        //Nombre de departamentos para llenar DDL
        //departamentos = await traerIdDeptos();//array de obj
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        const elemDepartmentos = document.getElementById('departmentSelect');//id de select

        for (const departamento of data) {
            const option = document.createElement('option');

            // Tomo el nombre para el DDL
            option.textContent = departamento.displayName;

            // Le agrego el valor de ID a la opcion
            option.value = departamento.departmentId;

            // Agrego la opción al select
            elemDepartmentos.appendChild(option);
        }
    }
    catch (error) {
        console.error('Error al cargar departamentos:', error);
    }

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
//             const url = `http://localhost:3000/api/traerMuseosConId?ids=${id}`;
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
//         const url = `http://localhost:3000/api/individual/${id}`;
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



