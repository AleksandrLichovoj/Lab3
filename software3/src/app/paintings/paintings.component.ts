import { Component, OnInit } from '@angular/core';

import { Painting } from '../painting';
import { PaintingService } from '../painting.service';

@Component({
  selector: 'app-paintings',
  templateUrl: './paintings.component.html',
  styleUrls: ['./paintings.component.css']
})
export class HeroesComponent implements OnInit {
  paintings: Painting[] = [];

  constructor(private paintingService: PaintingService) { }

  ngOnInit(): void {
    this.getPaintings();
  }

  getPaintings(): void {
    this.paintingService.getPaintings()
    .subscribe(paintings => this.paintings = paintings);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.paintingService.addPainting({ name } as Painting)
      .subscribe(painting => {
        this.paintings.push(painting);
      });
  }

  delete(painting: Painting): void {
    this.paintings = this.paintings.filter(h => h !== painting);
    this.paintingService.deletePainting(painting.id).subscribe();
  }

}
