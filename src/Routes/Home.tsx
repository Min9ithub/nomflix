import { useQuery } from "react-query";
import styled from "styled-components";
import {
  IGetMoviesResult,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  // getTopRatedMovies,
  // getUpcomingMovies,
} from "../api";
import { makeImagePath } from "../utils";
import Sliders from "../Components/Sliders";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );

  // const { data: popular } = useQuery<IGetMoviesResult>(
  //   ["moviesdsa", "popular"],
  //   getPopularMovies
  // );

  // const { data: topRated } = useQuery<IGetMoviesResult>(
  //   ["movies", "topRated"],
  //   getTopRatedMovies
  // );

  // const { data: upcomingMoviesList } = useQuery<IGetMoviesResult>(
  //   ["movies", "upcoming"],
  //   getUpcomingMovies
  // );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders
            data={nowPlaying as IGetMoviesResult}
            title={"Now Playing"}
          />
          {/* <Sliders data={popular as IGetMoviesResult} title={"Popular"} /> */}
          {/* <Sliders data={topRated as IGetMoviesResult} title={"Top Rated"} /> */}
          {/* <Sliders
            data={upcomingMoviesList as IGetMoviesResult}
            title={"Upcoming"}
          /> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
