import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import Sliders from "../Components/Sliders";
import { makeImagePath } from "../utils";

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
  const { data: nowPlaying, isLoading: nowIsLoading } =
    useQuery<IGetMoviesResult>("nowPlaying", () => getMovies("now_playing"));

  // const { data: latest, isLoading: latestIsLoading } =
  //   useQuery<IGetMoviesResult>("latest", () => getMovies("latest"));

  const { data: topRated, isLoading: topRatedIsLoading } =
    useQuery<IGetMoviesResult>("topRated", () => getMovies("top_rated"));

  const { data: upcoming, isLoading: upcomingIsLoading } =
    useQuery<IGetMoviesResult>("upcoming", () => getMovies("upcoming"));

  return (
    <Wrapper>
      {nowIsLoading &&
      // latestIsLoading &&
      topRatedIsLoading &&
      upcomingIsLoading ? (
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
            type={"nowplaying"}
            title={"Now Playing"}
            data={nowPlaying as IGetMoviesResult}
          />
          {/* <Sliders
            type={"latest"}
            title={"Latest"}
            data={latest as IGetMoviesResult}
          /> */}
          <Sliders
            type={"toprated"}
            title={"Top Rated"}
            data={topRated as IGetMoviesResult}
          />
          <Sliders
            type={"upcoming"}
            title={"Upcoming"}
            data={upcoming as IGetMoviesResult}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
