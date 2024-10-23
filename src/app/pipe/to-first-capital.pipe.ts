import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFirstCapital',
  standalone: true
})
export class ToFirstCapitalPipe implements PipeTransform {

  transform(value: string): string {
    let newStr=value.split('')

    newStr[0]=newStr[0].toUpperCase()


    return newStr.join('')
  }

}
