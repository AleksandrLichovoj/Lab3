import { Component, OnInit } from '@angular/core';
import { Painting } from '../painting';
import { PaintingService } from '../painting.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  paintings: Painting[] = [];

  constructor(private paintingService: PaintingService) { }

  ngOnInit(): void {
    this.getPaintings();
  }

  getPaintings(): void {
    this.paintingService.getPaintings()
      .subscribe(paintings => this.paintings = paintings.slice(1, 5));
  }
}
