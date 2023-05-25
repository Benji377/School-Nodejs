import { Component, OnInit } from '@angular/core';
import {BackendService} from '../service/MovieService';
import {Movie} from '../class/Movie';
import {ActivatedRoute} from '@angular/router';
import { JwtAuthService } from '../service/JwtAuthService';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public filmList!: Array<Movie>;
  public error!: string;

  constructor(private backend: BackendService, private authservice: JwtAuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(result => {
        this.filmList = new Array<Movie>();

        if (this.authservice.isLoggedIn()) {
          this.backend.getAll(result.sort)
          .then(filmList => filmList.forEach(value => {
            this.filmList.push(new Movie(value.id, value.title, value.year, value.published, value.owner, value.fullname));
          }))
          .catch(error => {console.log(error); this.error = error});
        } else {
          this.backend.getAllPublic(result.sort)
          .then(filmList => filmList.forEach(value => {
            this.filmList.push(new Movie(value.id, value.title, value.year, value.published, value.owner, value.fullname));
          }))
          .catch(error => console.log(error));
        }
      });
  }
}
