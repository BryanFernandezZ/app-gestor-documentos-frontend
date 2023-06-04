import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(datos: any[], nropagina: number, nroelementos: number, filtro: string): any[] {
    let datosFiltrados = filtro === "" ?
      datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
      : datos.slice(nroelementos * nropagina, (nroelementos * nropagina) + nroelementos)
        .filter(dato => dato.nroDocumento.toString().toLowerCase().includes(filtro.toLowerCase()) ||
          dato.suministro.toString().toLowerCase().includes(filtro.toLowerCase()) ||
          dato.referencia.toString().toLowerCase().includes(filtro.toLowerCase()));

    return datosFiltrados;
  }

}
