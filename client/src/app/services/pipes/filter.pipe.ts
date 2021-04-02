import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'filter',
   pure: false
})
export class FilterPipe implements PipeTransform {

   transform(itemsArray: any[], filterBy: string, propery: string): any[] {
      if (filterBy) {
         return itemsArray.filter((item) => {
            return item[propery] === filterBy
         })
      }

      return itemsArray
   }

}
