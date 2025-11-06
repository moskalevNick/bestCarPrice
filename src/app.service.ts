import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<string> {
    return this.httpService
        // .post('https://api.av.by/offer-types/cars/filters/main/apply',{"page":3,"properties":[{"name":"year","value":{"max":null,"min":null}},{"name":"price_currency","value":2}],"sorting":1},{headers: {'x-api-key': 'ia873161724b9074f6b35d2'}})
        .get('https://api.av.by/offer-types/cars/filters/main/init?price_currency=2')
        .pipe(
            map((response: AxiosResponse) => {
              return response.data;
            }),
        );
  }
}
