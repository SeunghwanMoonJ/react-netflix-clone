import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  API_KEY,
  BASE_URL,
  IGetClickedMovieResult,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";

const SliderDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const SliderTitle = styled.div`
  position: relative;
  top: 510px;
  font-size: 40px;
  margin-left: 49px;
`;
const Slider = styled(motion.div)`
  position: relative;
  top: 510px;
`;
const RowDiv = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RowSvgButton = styled.svg`
  height: 30px;
  width: 30px;
  cursor: pointer;
  fill: ${(prop) => prop.theme.white.darker};
  &:hover {
    fill: rgba(255, 255, 255, 0.2);
  }
  margin: 10px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 95%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  border-radius: 2px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.9) 100%
    ),
    url(${(prop) => prop.bgphoto});
  cursor: pointer;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  &:hover {
    div {
      div {
        opacity: 1;
      }
    }
  }
`;
const rowGoRightVariant: Variants = {
  initial: {
    x: window.outerWidth + 5,
  },
  animate: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const rowGoLeftVariant: Variants = {
  initial: {
    x: -window.outerWidth - 5,
  },
  animate: {
    x: 0,
  },
  exit: {
    x: window.outerWidth + 5,
  },
};
const offset = 6;
const Info = styled(motion.div)`
  padding: 5px;
  opacity: 1;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  h4 {
    text-align: center;
    font-size: 13px;
  }
  div {
    opacity: 0;
    font-size: 13px;
  }
  width: 15.17vw;
`;
const infoVariant: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const BigBox = styled(motion.div)`
  z-index: 111;
  position: absolute;
  background-color: ${(prop) => prop.theme.black.darker};
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 70%;
  width: 35%;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.754), 0 30px 40px rgba(0, 0, 0, 0.746);
`;
const Overlay = styled(motion.div)`
  z-index: 99;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  opacity: 0;
`;
const BigBoxCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 45%;
`;
const BigBoxTitle = styled.h4`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: 36px;
  position: relative;
  /* top: -60px; */
  padding: 10px;
`;

const BigBoxTagline = styled.div`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: 20px;
  padding: 10px;
  position: relative;
  top: -60px;
`;
const BigBoxOverviewButtonAndSvgDiv = styled.div`
  position: relative;
  z-index: 99;
  top: -70px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const BigBoxOverviewButton = styled.div`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: 15px;
  padding-left: 10px;
  padding-right: 10px;
`;
const BigBoxOverviewButtonSvg = styled(motion.svg)`
  height: 15px;
  padding-left: 5px;
  fill: ${(prop) => prop.theme.white.lighter};
  &:hover {
    height: 16px;
    fill: #c3a119;
  }
`;
const BigBoxOverview = styled.div`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: 15px;
  padding: 10px;
  position: relative;
  top: -60px;
`;
const BigBoxGenres = styled.div`
  color: ${(prop) => prop.theme.white.lighter};
  font-size: 15px;
  padding: 10px;
  position: absolute;
  bottom: -10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BigBoxGenresDiv = styled.div`
  display: flex;
`;
const Genresdiv = styled.div`
  margin-right: 10px;
`;
const RateAndDatediv = styled.div`
  display: flex;
  margin-left: 15px;
  margin-bottom: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
`;
const RateAndDate = styled.p`
  font-size: 7px;
`;
function PopularMovies() {
  const API_OPTION = "popular";

  const [bigBoxOverviewClicked, setBigBoxOverviewClicked] = useState(false);
  const [data, setData] = useState<IGetMoviesResult>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRowGoRight, setIsRowGoRight] = useState(true);
  const [photoPath, setPhotoPath] = useState("");
  async function getMovies() {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`
    );
    const json = await response.json();
    setData(json);
    setIsLoading((prev) => !prev);
  }
  useEffect(() => {
    getMovies();
  }, []);
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/${API_OPTION}/:movieId`
  );
  const bigMovieMatchOverview = useRouteMatch<{ movieId: string }>(
    `/${API_OPTION}/:movieId/overview`
  );
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const setScrolly = useTransform(scrollY, (value) => value + 100);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const plusIndex = () => {
    console.log(index, leaving);
    if (!leaving) {
      //   const totalMovies = data.results.length - 2;
      //   const maxIndex = Math.ceil(totalMovies / offset) - 1;
      //   console.log(leaving);
      setIndex((prev) => (prev === 2 ? 0 : prev + 1));
      console.log(index);
      setLeaving(true);
      setTimeout(() => {
        setLeaving(false);
      }, 1000);
      setIsRowGoRight(true);
    }
  };
  const minusIndex = () => {
    if (!leaving) {
      // const totalMovies = data.results.length - 2;
      // const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? 2 : prev - 1));
      setLeaving(true);
      setTimeout(() => {
        setLeaving(false);
      }, 1000);
      setIsRowGoRight(false);
    }
  };
  const setLeavingFalse = () => {
    setLeaving(false);
    console.log(23423423);
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = async (movieId: string) => {
    history.push(`/${API_OPTION}/${movieId}`);
    await getClickedMovies(movieId);
  };
  const onOverlayClicked = () => {
    setBigBoxOverviewClicked((prev) => !prev);
    history.push(`/${API_OPTION}`);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  const [clickedMoiveData, setClickedMoiveData] =
    useState<IGetClickedMovieResult>();
  async function getClickedMovies(movieId: string) {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
    );
    const json = await response.json();
    setClickedMoiveData(json);
  }
  const onBigBoxOverviewButtonClicked = (movieId: string) => {
    setBigBoxOverviewClicked((prev) => !prev);
    history.push(`/${API_OPTION}/${movieId}/overview`);
  };

  return (
    <>
      <SliderDiv>
        <SliderTitle>인기 많은</SliderTitle>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={setLeavingFalse}>
            <RowDiv>
              <RowSvgButton
                onClick={minusIndex}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M77.25 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C175.6 444.9 183.8 448 192 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L77.25 256zM269.3 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C367.6 444.9 375.8 448 384 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L269.3 256z" />
              </RowSvgButton>
              <Row
                transition={{ type: "tween", duration: 1 }}
                key={index}
                variants={isRowGoRight ? rowGoRightVariant : rowGoLeftVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {data?.results
                  .slice(0, 18)
                  .slice(offset * index, offset * index + offset)
                  .map((movie, index) => (
                    <Box
                      layoutId={movie.id + API_OPTION}
                      onClick={() => {
                        setPhotoPath(movie.backdrop_path);
                        onBoxClicked(movie.id + "");
                      }} // movie.id
                      transition={{ type: "tween" }}
                      initial={{ zIndex: 0 }}
                      whileHover={{
                        zIndex: 1,
                        y: -50,
                        scale: 1.3,
                        transition: {
                          delay: 0.5,
                          duration: 0.3,
                        },
                      }}
                      style={
                        index === 0
                          ? { originX: 0 }
                          : index === 5
                          ? { originX: 1 }
                          : {}
                      }
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w400")}
                    >
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                        <motion.div>✭ {movie.vote_average}</motion.div>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <RowSvgButton
                onClick={plusIndex}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M246.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L178.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C47.63 444.9 55.81 448 64 448s16.38-3.125 22.62-9.375l160-160C259.1 266.1 259.1 245.9 246.6 233.4zM438.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L370.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C239.6 444.9 247.8 448 256 448s16.38-3.125 22.62-9.375l160-160C451.1 266.1 451.1 245.9 438.6 233.4z" />
              </RowSvgButton>
            </RowDiv>
          </AnimatePresence>
        </Slider>
      </SliderDiv>

      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClicked}
            />
            <BigBox
              style={{
                top: setScrolly,
                height: !clickedMoiveData?.overview ? "50%" : "70%",
              }}
              transition={{ type: "tween", duration: 0.3 }}
              layoutId={bigMovieMatch.params.movieId + API_OPTION}
            >
              {clickedMovie ? (
                <>
                  <BigBoxCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                        photoPath,
                        "w500"
                      )})`,
                    }}
                  ></BigBoxCover>
                  <BigBoxTitle
                    style={
                      clickedMovie.title.length > 15
                        ? { top: -95 }
                        : { top: -60 }
                    }
                  >
                    {clickedMovie.title}
                  </BigBoxTitle>

                  <BigBoxTagline
                    style={
                      clickedMovie.title.length > 15
                        ? { top: -110 }
                        : { top: -60 }
                    }
                  >
                    {clickedMoiveData?.tagline
                      ? clickedMoiveData.tagline
                      : clickedMoiveData?.overview.slice(0, 30)}
                    {clickedMoiveData?.overview ? "..." : null}
                  </BigBoxTagline>
                  {clickedMoiveData?.overview ? (
                    <BigBoxOverviewButtonAndSvgDiv
                      style={
                        clickedMovie.title.length > 15
                          ? { top: -105 }
                          : { top: -60 }
                      }
                    >
                      <BigBoxOverviewButton>줄거리 보기</BigBoxOverviewButton>
                      <BigBoxOverviewButtonSvg
                        onClick={() =>
                          onBigBoxOverviewButtonClicked(clickedMovie.id + "")
                        }
                        style={{ cursor: "pointer" }}
                        whileHover={{ fill: "#ad802ddf" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M364.2 83.8C339.8 59.39 300.2 59.39 275.8 83.8L91.8 267.8C49.71 309.9 49.71 378.1 91.8 420.2C133.9 462.3 202.1 462.3 244.2 420.2L396.2 268.2C407.1 257.3 424.9 257.3 435.8 268.2C446.7 279.1 446.7 296.9 435.8 307.8L283.8 459.8C219.8 523.8 116.2 523.8 52.2 459.8C-11.75 395.8-11.75 292.2 52.2 228.2L236.2 44.2C282.5-2.08 357.5-2.08 403.8 44.2C450.1 90.48 450.1 165.5 403.8 211.8L227.8 387.8C199.2 416.4 152.8 416.4 124.2 387.8C95.59 359.2 95.59 312.8 124.2 284.2L268.2 140.2C279.1 129.3 296.9 129.3 307.8 140.2C318.7 151.1 318.7 168.9 307.8 179.8L163.8 323.8C157.1 330.5 157.1 341.5 163.8 348.2C170.5 354.9 181.5 354.9 188.2 348.2L364.2 172.2C388.6 147.8 388.6 108.2 364.2 83.8V83.8z" />
                      </BigBoxOverviewButtonSvg>
                    </BigBoxOverviewButtonAndSvgDiv>
                  ) : null}

                  <BigBoxGenres>
                    <BigBoxGenresDiv>
                      {clickedMoiveData?.genres.map((item) => (
                        <Genresdiv key={item.name}>{item.name}</Genresdiv>
                      ))}
                    </BigBoxGenresDiv>
                    <BigBoxGenresDiv>
                      <RateAndDatediv>
                        <RateAndDate>평점</RateAndDate>
                        {clickedMoiveData?.vote_average}
                      </RateAndDatediv>
                      <RateAndDatediv>
                        <RateAndDate>개봉일</RateAndDate>
                        {clickedMoiveData?.release_date}
                      </RateAndDatediv>
                    </BigBoxGenresDiv>
                  </BigBoxGenres>
                </>
              ) : null}
            </BigBox>
          </>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {bigMovieMatchOverview ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClicked}
            />
            <BigBox
              style={{
                top: setScrolly,
                height: "80%",
              }}
              transition={{ type: "tween", duration: 0.3 }}
              layoutId={bigMovieMatchOverview.params.movieId + API_OPTION}
            >
              {clickedMovie ? (
                <>
                  <BigBoxCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                        clickedMoiveData?.backdrop_path as any,
                        "w500"
                      )})`,
                    }}
                  ></BigBoxCover>
                  <BigBoxTitle
                    style={
                      clickedMovie.title.length > 15
                        ? { top: -95 }
                        : { top: -60 }
                    }
                  >
                    {clickedMovie.title}
                  </BigBoxTitle>

                  <BigBoxOverviewButtonAndSvgDiv
                    style={
                      clickedMovie.title.length > 15
                        ? { top: -100 }
                        : { top: -70 }
                    }
                  >
                    <BigBoxOverviewButton>
                      {clickedMoiveData?.overview}
                    </BigBoxOverviewButton>
                  </BigBoxOverviewButtonAndSvgDiv>

                  <BigBoxGenres>
                    <BigBoxGenresDiv>
                      {clickedMoiveData?.genres.map((item) => (
                        <Genresdiv>{item.name}</Genresdiv>
                      ))}
                    </BigBoxGenresDiv>
                    <BigBoxGenresDiv>
                      <RateAndDatediv>
                        <RateAndDate>평점</RateAndDate>
                        {clickedMoiveData?.vote_average}
                      </RateAndDatediv>
                      <RateAndDatediv>
                        <RateAndDate>개봉일</RateAndDate>
                        {clickedMoiveData?.release_date}
                      </RateAndDatediv>
                    </BigBoxGenresDiv>
                  </BigBoxGenres>
                </>
              ) : null}
            </BigBox>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default PopularMovies;
