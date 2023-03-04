import { motion, Variants } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { IGetSearchResult } from "../api";
import { makeImagePath } from "../utils";

const SliderRow = styled(motion.div)`
  position: relative;
  top: -50px;
`;

const Title = styled.h2`
  position: absolute;
  font-size: 30px;
  top: -50px;
  padding-left: 55px;
`;

const Row = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin: 0 55px;
  margin-top: 180px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  margin-bottom: 100px;
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 15px;
  width: 200px;
  height: 275px;
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

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
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

interface ISliderSearch {
  type: string;
  title: string;
  data: IGetSearchResult;
}

function SlidersSearch({ type, title, data }: ISliderSearch) {
  const [index, setIndex] = useState(0);
  const offset = 12;

  return (
    <>
      <SliderRow>
        <Title>{title}</Title>
        <Row>
          {data?.results
            .slice(0)
            .slice(offset * index, offset * index + offset)
            .map((data) => (
              <Box
                layoutId={data.id + type}
                key={data.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(data.poster_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{data.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </SliderRow>
    </>
  );
}

export default SlidersSearch;
