import { json } from "stream/consumers";

export const API_KEY = "d874fc05ccd756a9cebe2faf5d05ab82";
export const BASE_URL = "https://api.themoviedb.org/3";

export interface ISearchedData {
    page: number,
    results: ISearchedDataItem[]
}
export interface ISearchedDataItem {
  id: number,
  name:string,
}

export interface ITopRatedTv {
  page: number,
  results: {
    backdrop_path: string,
    first_air_date: string,
    genre_ids: [
        number,
    ],
    id: number,
    name: string,
    overview: string,
    poster_path: string,
    vote_average: number,
  },
}
export interface ILatestTv {
  first_air_date: string,
  id: number,
  last_air_date: string,
  name: string,
  number_of_episodes: number,
  overview: string,
  poster_path: string,
  vote_average: number,
  genres: [
    {
        name: string,
    }
  ]
  original_name: string,
  production_countries: [
    {
        name : string
    }
],

}
export interface IMovies {
  id: number,
  backdrop_path: string,
  poster_path: string,
  title: string,
  overview: string,
  vote_average: number,
}
export interface IGetMoviesResult {
  dates:{
    maximum: string,
    minimum: string,
  }
  page: number,
  results: IMovies[],
  total_pages: number,
  total_results: number,
}
export interface IGetTvResult {
  page:number,
  results: ITvs[],

}
export interface ITvs{
  backdrop_path: string,
  first_air_date: string,
  genre_ids: number[],
  id: number,
  name: string,
  overview: string,
  popularity: number,
  poster_path: string,
  vote_average: number,
  vote_count: number,
}

export interface IGetClickedMovieResult {
  title: string,
  adult: boolean,
  backdrop_path: string,
  vote_average : number,
  belongs_to_collection: {
      id: number,
      backdrop_path: string,
  },
  tagline : string
  genres: [
    {
        id: number,
        name: string,
    },
    {
        id: number,
        name: string,
    },
    {
        id: number,
        name: string,
    },
    {
        id: number,
        name: string,
    },
    {
        id: number,
        name: string,
    }
  ],
  homepage: string,
  id: number,
  imdb_id: string,
  //https://www.imdb.com/title/tt5113044/?ref_=nv_sr_srsg_0
  overview: string,
  popularity: number,
  release_date: string,
}
export interface IGetClickedTv {
    backdrop_path: string,
    first_air_date: string,
    genres: [
      {
        id:number,
        name:string
      }
    ],
    homepage: string,
    id: number,
    last_episode_to_air: {
      air_date: string,
      episode_number: number,
      id: number,
      name: string,
      season_number: 1,
    },
    name: string,
    next_episode_to_air: {
      air_date: string,
      episode_number: number,
      id: number,
      name: string,
      season_number: number,
    },
    number_of_episodes: number,
    number_of_seasons: number,
    overview: string,
    seasons: [
      {
          air_date: string,
          episode_count: number,
          id: number,
          name: string,
          overview: string,
          poster_path: string,
          season_number: number,
      }
  ],    spoken_languages: [],
    status: string,
    tagline: string,
    vote_average: number,
}
// export async function getMovies() {
//   const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
//   const json = await response.json()
//   console.log("shit")
//   // const json = fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then((res) => res.json());
//   // console.log(json);
//   return json;
// }
// http://api.themoviedb.org/3/movie/now_playing?api_key=d874fc05ccd756a9cebe2faf5d05ab82

// const json = fetch("http://api.themoviedb.org/3/movie/now_playing?api_key=d874fc05ccd756a9cebe2faf5d05ab82").then((res) => res.json());
