import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(datos: any[], nropagina: number, nroelementos: number, filtro: string): any[] {
    let datosFiltrados: any[] = [];

    //TODO: 1 para usuarios y 2 para documentos
    let tablaType: number = 0;

    tablaType = datos[0].correo ? 1 : 2;

    if (tablaType === 1) {
      datosFiltrados = filtro === "" ?
        datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
        : datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
          .filter(dato => dato.nombre.toString().toLowerCase().includes(filtro.toLowerCase()) ||
            dato.apellidos.toString().toLowerCase().includes(filtro.toLowerCase())
          );
    } else {
      datosFiltrados = filtro === "" ?
        datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
        : datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
          .filter(dato => dato.nroDocumento.toString().toLowerCase().includes(filtro.toLowerCase()) ||
            dato.suministro.toString().toLowerCase().includes(filtro.toLowerCase()) ||
            dato.referencia.toString().toLowerCase().includes(filtro.toLowerCase()));
    }

    return datosFiltrados;
  }

}
