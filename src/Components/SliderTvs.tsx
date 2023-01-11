import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetTvResult } from "../api";
import { makeImagePath, useWindowDimensions } from "../utils";

const SliderRow = styled.div`
  position: relative;
  height: 200px;
  top: -100px;
  margin-bottom: 80px;
`;

const Title = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const SliderBtn = styled(motion.div)<{ isRight: boolean }>`
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

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigTv = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
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
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISlider {
  data: IGetTvResult;
  title: string;
}

function SliderTvs({ data, title }: ISlider) {
  const width = useWindowDimensions();
  const navigate = useNavigate();
  const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [clickReverse, setClickReverse] = useState(false);

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setClickReverse(true);
      toggleLeaving();
      // banner에 있는 영화 하나 빼기
      const totalMovies = data.results.length - 1;
      // 1) index도 마찬가지, 2) 올림이나 내림을 해줌
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setClickReverse(false);
      toggleLeaving();
      // banner에 있는 영화 하나 빼기
      const totalMovies = data.results.length - 1;
      // 1) index도 마찬가지, 2) 올림이나 내림을 해줌
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tv: number) => {
    navigate(`/tv/${tv}`);
  };

  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id + "" === bigTvMatch.params.tvId);

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
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            custom={{ width, clickReverse }}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + ""}
                  key={tv.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(tv.id)}
                  transition={{ type: "tween" }}
                  bgPhoto={makeImagePath(
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
        {bigTvMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigTv
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigTvMatch.params.tvId}
            >
              {clickedTv && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedTv.backdrop_path || clickedTv.poster_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedTv.name}</BigTitle>
                  <BigOverview>{clickedTv.overview}</BigOverview>
                </>
              )}
            </BigTv>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default SliderTvs;
