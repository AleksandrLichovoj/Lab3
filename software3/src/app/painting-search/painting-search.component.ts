import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-painting-search',
  templateUrl: './painting-search.component.html',
  styleUrls: [ './painting-search.component.css' ]
})
export class PaintingSearchComponent implements OnInit {
  paintings$!: Observable<Painting[]>;
  private searchTerms = new Subject<string>();

  constructor(private paintingService: PaintingService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.paintings$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.paintingService.searchPaintings(term)),
    );
  }
}
