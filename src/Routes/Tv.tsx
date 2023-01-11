import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getOnTheAirTv,
  getPopularTv,
  getTopRatedTv,
  IGetTvResult,
} from "../api";
import SliderTvs from "../Components/SliderTvs";
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
  const { data: ontheairTvList, isLoading } = useQuery<IGetTvResult>(
    ["tv", "on the air"],
    getOnTheAirTv
  );

  const { data: popularTvList } = useQuery<IGetTvResult>(
    ["popularTv", "popularTv"],
    getPopularTv
  );

  const { data: topRatedTvList } = useQuery<IGetTvResult>(
    ["topRatedtv", "topRatedtv"],
    getTopRatedTv
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              ontheairTvList?.results[0].backdrop_path ||
                ontheairTvList?.results[0].poster_path ||
                ""
            )}
          >
            <Title>{ontheairTvList?.results[0].name}</Title>
            <Overview>{ontheairTvList?.results[0].overview}</Overview>
          </Banner>
          <SliderTvs
            data={ontheairTvList as IGetTvResult}
            title={"On The Air"}
          />
          {/* <SliderTvs data={popularTvList as IGetTvResult} title={"Popular"} />
          <SliderTvs
            data={topRatedTvList as IGetTvResult}
            title={"Top Rated"}
          /> */}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
