import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "searchOffersPipe",
})
export class SearchOffersPipePipe implements PipeTransform {
  transform(items: any[], filterdata: string): any[] {
    if (!items) return [];
    if (!filterdata) return items;
    filterdata = filterdata.toString().toLowerCase();
    return items.filter((it) => {
      return (
        it.promocode.toLowerCase().includes(filterdata) ||
        it.subscription_name.toLowerCase().includes(filterdata)
        )
    });
  }
}
