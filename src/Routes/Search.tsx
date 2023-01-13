import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResult } from "../api";
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

const Row = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  margin: 0 55px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  margin-top: 200px;
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 200px;
  height: 275px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

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

const offset = 5;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useQuery<IGetSearchResult>(
    ["search", keyword],
    () => getSearch(keyword)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Row>
            {data?.results
              .slice(0)
              .slice(offset * index, offset * index + offset)
              .map((data) => (
                <Box
                  key={data.id}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  bgPhoto={makeImagePath(
                    data.backdrop_path || data.poster_path,
                    "w500"
                  )}
                  variants={boxVariants}
                >
                  <p>{data.title}</p>
                </Box>
              ))}
          </Row>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
