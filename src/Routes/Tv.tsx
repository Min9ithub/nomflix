import { useQuery } from "react-query";
import styled from "styled-components";
import { getTv, IGetTvResult } from "../api";
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
  const { data, isLoading } = useQuery<IGetTvResult>(
    ["tv", "on the air"],
    getTv
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              data?.results[0].backdrop_path ||
                data?.results[0].poster_path ||
                ""
            )}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderTvs />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
