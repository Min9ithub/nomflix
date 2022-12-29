import { createBrowserRouter } from "react-router-dom";
import ErrorComponent from "./Components/ErrorComponent";
import NotFound from "./NotFound";
import Root from "./Root";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Home />,
          errorElement: <ErrorComponent />,
        },
        //   /movie/:id router를 중첩라우팅 하는 방법 찾기
        {
          path: "movies/:id",
          element: <Home />,
        },
        {
          path: "tv",
          element: <Tv />,
        },
        {
          path: "search",
          element: <Search />,
        },
      ],
      errorElement: <NotFound />,
    },
  ],
  { basename: "/" }
);

export default router;
