import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTv, IGetTvResult } from "../api";
import SlidersTv from "../Components/SlidersTv";
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

function Tv() {
  const { data: onTheAirData, isLoading: loadingOnTheAir } =
    useQuery<IGetTvResult>("onTheAir", () => getTv("on_the_air"));

  const { data: airingTodayData, isLoading: loadingAiringToday } =
    useQuery<IGetTvResult>("airingToday", () => getTv("airing_today"));

  const { data: popularData, isLoading: loadingPopular } =
    useQuery<IGetTvResult>("popular", () => getTv("popular"));

  const { data: topRatedData, isLoading: loadingTopRated } =
    useQuery<IGetTvResult>("topRated", () => getTv("top_rated"));

  return (
    <>
      <Helmet>
        <title>Tv Shows</title>
      </Helmet>
      <Wrapper>
        {loadingOnTheAir &&
        loadingAiringToday &&
        loadingPopular &&
        loadingTopRated ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(
                onTheAirData?.results[0].backdrop_path || ""
              )}
            >
              <Title>{onTheAirData?.results[0].name}</Title>
              <Overview>{onTheAirData?.results[0].overview}</Overview>
            </Banner>
            <SlidersTv
              type="on_the_air"
              title="On The Air"
              data={onTheAirData as IGetTvResult}
            />
            <SlidersTv
              type="airing_today"
              title="Airing Today"
              data={airingTodayData as IGetTvResult}
            />
            <SlidersTv
              type="popular"
              title="Popular"
              data={popularData as IGetTvResult}
            />
            <SlidersTv
              type="top_rated"
              title="Top Rated"
              data={topRatedData as IGetTvResult}
            />
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Tv;
