import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor(private http: HttpClient) {}

  // Get lat/long data from LocationIQ for address passed in from component
  getLatLong(data): Observable<any> {
    return this.http.get(
      `https://eu1.locationiq.com/v1/search.php?key=${environment.latLongApiKey}&q=${data}&format=json&no_annotations=1`
    );
  }
}
