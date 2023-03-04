import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMovieSearch, getTvSearch, IGetSearchResult } from "../api";
import SlidersSearch from "../Components/SlidersSearch";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieSearchData, isLoading: loadingMovieSearch } =
    useQuery<IGetSearchResult>(["Movie Search", keyword], () =>
      getMovieSearch(keyword)
    );

  const { data: tvSearchData, isLoading: loadingTvSearch } =
    useQuery<IGetSearchResult>(["Tv Search", keyword], () =>
      getTvSearch(keyword)
    );

  return (
    <>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <Wrapper>
        {loadingMovieSearch && loadingTvSearch ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <SlidersSearch
              type={"movie"}
              title={`Search for '${keyword}' in movie`}
              data={movieSearchData as IGetSearchResult}
            />
            <SlidersSearch
              type={"tv"}
              title={`Search for '${keyword}' in tv`}
              data={tvSearchData as IGetSearchResult}
            />
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Search;
