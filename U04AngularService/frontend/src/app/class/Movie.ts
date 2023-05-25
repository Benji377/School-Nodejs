export class Movie {
  id: number;
  title: string;
  year: Date;
  published: boolean;
  owner: number;
  fullname: string;

  constructor(id: number, title: string, year: Date, published: boolean, owner: number, fullname: string) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.published = published;
    this.owner = owner;
    this.fullname = fullname;
  }


}
