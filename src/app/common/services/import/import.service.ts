import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Unit } from 'src/app/unit/unit';
import { Rune } from 'src/app/rune/rune';
import { HttpClient } from '@angular/common/http';
import { SubjectManager } from 'src/app/common/services/sabject-manager/subject.manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private subjectManager: SubjectManager) { }
  sample = 'assets/demo.json';

  importSample(): Observable<any> {
      return this.http.get(this.sample);
  }

  next(e: any) {
      const units = e.unit_list.map(unit => Object.assign(
          new Unit(),
          unit,
          {
              runes: unit.runes.map(rune => Object.assign(new Rune(), rune))
          }
      ));
      const unitRunes = units.map(unit => unit.runes.map(rune => Object.assign(rune, { unit: unit })));
      const runes = e.runes.map(rune => Object.assign(new Rune(), rune));
      unitRunes.forEach((runes: Rune[]) => runes.forEach((rune: Rune) => rune.init()));
      runes.forEach(rune => rune.init());
      this.subjectManager.runes.next([].concat(...unitRunes).concat(runes));
      this.subjectManager.units.next(units.filter(unit => unit.class >= 5 || unit.runes.length > 0));
  }
}
