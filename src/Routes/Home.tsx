import { useQuery } from "react-query";
import styled from "styled-components";
import {
  IGetMoviesResult,
  getNowPlayingMovies,
  getPopularMovies,
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
  const { data: nowPlayingMoviesList, isLoading } = useQuery<IGetMoviesResult>(
    ["nowPlaying", "nowPlayingMovies"],
    getNowPlayingMovies
  );

  const { data: popularMoviesList } = useQuery<IGetMoviesResult>(
    ["popularMovies", "popularMovies"],
    getPopularMovies
  );

  // const { data: topRatedMoviesList } = useQuery<IGetMoviesResult>(
  //   ["topRatedMovies", "topRatedMovies"],
  //   getTopRatedMovies
  // );

  // const { data: upcomingMoviesList } = useQuery<IGetMoviesResult>(
  //   ["upcomingMovies", "upcomingMovies"],
  //   getUpcomingMovies
  // );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingMoviesList?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMoviesList?.results[0].title}</Title>
            <Overview>{nowPlayingMoviesList?.results[0].overview}</Overview>
          </Banner>
          <Sliders
            data={nowPlayingMoviesList as IGetMoviesResult}
            title={"Now Playing"}
          />
          {/* <Sliders
            data={popularMoviesList as IGetMoviesResult}
            title={"Popular"}
          />
          <Sliders
            data={topRatedMoviesList as IGetMoviesResult}
            title={"Top Rated"}
          />
          <Sliders
            data={upcomingMoviesList as IGetMoviesResult}
            title={"Upcoming"}
          /> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
