import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Painting } from '../painting';
import { PaintingService } from '../painting.service';

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: [ './painting-detail.component.css' ]
})
export class PaintingDetailComponent implements OnInit {
  painting: Painting | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPainting();
  }

  getPainting(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.paintingService.getPainting(id)
      .subscribe(painting => this.painting = painting);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.painting) {
      this.paintingService.updatePainting(this.painting)
        .subscribe(() => this.goBack());
    }
  }
}
