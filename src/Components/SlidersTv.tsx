import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getTvActor,
  getTvDetail,
  IGetTvActorResult,
  IGetTvDetailResult,
  IGetTvResult,
} from "../api";
import { makeImagePath, useWindowDimensions } from "../utils";

const SliderRow = styled(motion.div)`
  position: relative;
  height: 200px;
  top: -100px;
  margin-bottom: 80px;
`;

const Title = styled.h2`
  position: absolute;
  font-size: 30px;
  top: -50px;
  margin-left: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 15px;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 0px 0px 15px 15px;
  opacity: 0;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const SliderBtn = styled.div<{ isRight: boolean }>`
  position: absolute;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 40px;
  border: none;
  z-index: 2;
  color: ${(props) => props.theme.white.darker};
  svg {
    width: 40px;
    height: 40px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 3;
`;

const ModalTv = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 3;
`;

const ModalCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const ModalTitle = styled.h3`
  font-weight: 600;
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: relative;
  top: -60px;
  padding-left: 20px;
`;

const ModalInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  color: ${(props) => props.theme.white.lighter};
`;

const ModalInfoOne = styled.div`
  padding-left: 20px;
  font-size: 25px;
  font-weight: 500;
`;

const ModalDate = styled.span`
  margin-right: 10px;
`;
const ModalRank = styled.span`
  color: ${(props) => props.theme.red};
`;

const ModalInfoTwo = styled.div`
  padding: 0px 20px;
`;

const ModalGenres = styled.p`
  margin-bottom: 10px;
`;

const ModalActor = styled.p``;

const ModalOverview = styled.p`
  padding-left: 10px;
`;

const rowVariants: Variants = {
  hidden: ({
    width,
    clickReverse,
  }: {
    width: number;
    clickReverse: boolean;
  }) => ({
    x: clickReverse ? -width - 5 : width + 5,
  }),

  visible: {
    x: 0,
  },

  exit: ({
    width,
    clickReverse,
  }: {
    width: number;
    clickReverse: boolean;
  }) => ({
    x: clickReverse ? width + 5 : -width - 5,
  }),
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.7,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface ISliderTv {
  type: string;
  title: string;
  data: IGetTvResult;
}

function SlidersTv({ type, title, data }: ISliderTv) {
  const width = useWindowDimensions();
  const navigate = useNavigate();
  const modalTvMatch = useMatch(`/tv/${type}/:tvId`);
  const { scrollY } = useScroll();
  const offset = 6;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [clickReverse, setClickReverse] = useState(false);

  const { data: tvDetailData } = useQuery<IGetTvDetailResult>(
    [modalTvMatch?.params.tvId, "TvDetail"],
    () => getTvDetail(+modalTvMatch?.params.tvId!)
  );

  const { data: tvActorData } = useQuery<IGetTvActorResult>(
    [modalTvMatch?.params.tvId, "TvActor"],
    () => getTvActor(+modalTvMatch?.params.tvId!)
  );

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setClickReverse(true);
      toggleLeaving();
      // banner에 있는 영화 하나 빼기
      const totalTvs = data.results.length - 1;
      // 1) index도 마찬가지, 2) 올림이나 내림을 해줌
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setClickReverse(false);
      toggleLeaving();
      // banner에 있는 영화 하나 빼기
      const totalTvs = data.results.length - 1;
      // 1) index도 마찬가지, 2) 올림이나 내림을 해줌
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number, type: string) => {
    navigate(`/tv/${type}/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    modalTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id + "" === modalTvMatch.params.tvId);

  return (
    <>
      <SliderRow>
        <Title>{title}</Title>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ width, clickReverse }}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
            custom={{ width, clickReverse }}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + type}
                  key={tv.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(tv.id, type)}
                  transition={{ type: "tween" }}
                  $bgPhoto={makeImagePath(
                    tv.backdrop_path || tv.poster_path,
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <SliderBtn onClick={decreaseIndex} isRight={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
          </svg>
        </SliderBtn>
        <SliderBtn onClick={increaseIndex} isRight={true}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
          </svg>
        </SliderBtn>
      </SliderRow>
      <AnimatePresence>
        {modalTvMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <ModalTv
              style={{ top: scrollY.get() + 150 }}
              layoutId={modalTvMatch.params.tvId + type}
            >
              {clickedTv && (
                <>
                  <ModalCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedTv.backdrop_path,
                        "original"
                      )})`,
                    }}
                  />
                  <ModalTitle>{clickedTv.name}</ModalTitle>
                  <ModalInfo>
                    <ModalInfoOne>
                      <ModalDate>
                        {clickedTv.first_air_date.slice(0, 4)}
                      </ModalDate>
                      <ModalRank>{clickedTv.vote_average}</ModalRank>
                    </ModalInfoOne>
                    <ModalInfoTwo>
                      <ModalGenres>
                        <span>Genres: </span>
                        {tvDetailData?.genres.slice(0, 3).map((data) => (
                          <span key={data.id}>{data.name} </span>
                        ))}
                      </ModalGenres>
                      <ModalActor>
                        <span>Actors: </span>
                        {tvActorData?.cast.slice(0, 3).map((data) => (
                          <span key={data.id}>{data.name} </span>
                        ))}
                      </ModalActor>
                    </ModalInfoTwo>
                    <ModalOverview>
                      {clickedTv.overview || "No Overview"}
                    </ModalOverview>
                  </ModalInfo>
                </>
              )}
            </ModalTv>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default SlidersTv;
