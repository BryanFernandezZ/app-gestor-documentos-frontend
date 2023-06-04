import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoCoincidencia'
})
export class TextoCoincidenciaPipe implements PipeTransform {

  transform(texto: string, textobuscado: string): string {

    if(!textobuscado) return texto;
    return texto.replace(new RegExp(textobuscado, "gi"), `<span class="texto-coincidencia">${textobuscado}</span>`);
  }

}
