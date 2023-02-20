const API_KEY = "1b88530c8ac350029276f29845306e48";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: string;
  release_date: string;
}

export interface IGetMoviesResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages?: number;
  total_results: number;
}

export interface IGetMoviesDetailResult {
  genres: {
    id: number;
    name: string;
  }[];
}

export interface IGetMoviesActorResult {
  cast: {
    id: number;
    name: string;
  }[];
  crew: {
    name: string;
  }[];
}

export function getMovies(type: string) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMoviesDetail(id: number) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getMoviesActor(id: number) {
  return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getTv(type: string) {
  return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export function getSearch(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getMovieSearch(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getTvSearch(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
