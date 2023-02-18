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
  const { data: latest, isLoading: latestIsLoading } = useQuery<IGetTvResult>(
    "latest",
    () => getTv("latest")
  );

  const { data: airing, isLoading: airingIsLoading } = useQuery<IGetTvResult>(
    "airing",
    () => getTv("airing_today")
  );

  const { data: popular, isLoading: popularIsLoading } = useQuery<IGetTvResult>(
    "popular",
    () => getTv("popular")
  );

  const { data: toprated, isLoading: topratedIsLoading } =
    useQuery<IGetTvResult>("toprated", () => getTv("top_rated"));

  return (
    <Wrapper>
      {airingIsLoading && popularIsLoading && topratedIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(airing?.results[0].backdrop_path || "")}
          >
            <Title>{airing?.results[0].name}</Title>
            <Overview>{airing?.results[0].overview}</Overview>
          </Banner>
          <SlidersTv
            type="airing"
            title="Airing Today"
            data={airing as IGetTvResult}
          />
          <SlidersTv
            type="popular"
            title="Popular"
            data={popular as IGetTvResult}
          />
          <SlidersTv
            type="toprated"
            title="Top Rated"
            data={toprated as IGetTvResult}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
