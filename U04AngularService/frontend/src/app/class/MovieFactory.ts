import {Movie} from './Movie';

export class MovieFactory {

  constructor() {
  }

  public empty(): Movie {
    return new Movie(-1, '', new Date(), false, -1, '');
  }

}
