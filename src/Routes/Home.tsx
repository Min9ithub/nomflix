import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getMoviesVideo,
  IGetMoviesResult,
  IGetMoviesVideoResult,
} from "../api";
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
  font-weight: 700;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  const { data: nowPlayingData, isLoading: loadingNowPlaying } =
    useQuery<IGetMoviesResult>("nowPlaying", () => getMovies("now_playing"));

  const { data: topRatedData, isLoading: loadingTopRated } =
    useQuery<IGetMoviesResult>("topRated", () => getMovies("top_rated"));

  const { data: upcomingData, isLoading: loadingUpcoming } =
    useQuery<IGetMoviesResult>("upcoming", () => getMovies("upcoming"));

  const { data: popularData, isLoading: loadingPopular } =
    useQuery<IGetMoviesResult>("popular", () => getMovies("popular"));

  const { data: movieVideoData } = useQuery<IGetMoviesVideoResult>(
    [topRatedData?.results[0].id, "videos"],
    () => getMoviesVideo(topRatedData?.results[0].id!)
  );

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Wrapper>
        {loadingNowPlaying &&
        loadingTopRated &&
        loadingUpcoming &&
        loadingPopular ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(
                nowPlayingData?.results[0].backdrop_path || ""
              )}
            >
              <Title>{nowPlayingData?.results[0].title}</Title>
              <Overview>{nowPlayingData?.results[0].overview}</Overview>
            </Banner>
            <Sliders
              type={"nowplaying"}
              title={"Now Playing"}
              data={nowPlayingData as IGetMoviesResult}
            />
            <Sliders
              type={"toprated"}
              title={"Top Rated"}
              data={topRatedData as IGetMoviesResult}
            />
            <Sliders
              type={"upcoming"}
              title={"Upcoming"}
              data={upcomingData as IGetMoviesResult}
            />
            <Sliders
              type={"popular"}
              title={"Popular"}
              data={popularData as IGetMoviesResult}
            />
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Home;
