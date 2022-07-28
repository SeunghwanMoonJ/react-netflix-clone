import { height } from "@mui/system";
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
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
  IGetClickedTv,
  IGetMoviesResult,
  IGetTvResult,
  ILatestTv,
} from "../api";
import LatestShow from "../components/LatestShow";
import PopularMovies from "../components/PopularMovies";
import PopularTv from "../components/PopularTv";
import TopRatedMovies from "../components/TopRatedMovies";
import Upcoming from "../components/Upcoming";
import { makeImagePath } from "../utils";
// import * as React from "react";

// declare module "framer-motion" {
//   export interface AnimatePresenceProps {
//     children?: React.ReactNode;
//   }
// }
const Wrapper = styled.div`
  background-color: ${(prop) => prop.theme.black.veryDark};
  color: ${(prop) => prop.theme.white.darker};
  height: 300vh;
  width: 100vw;
  overflow: hidden;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    linear-gradient(
      to left,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.9) 100%
    ),
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.9) 100%
    ),
    url(${(prop) => prop.bgphoto});
  background-size: cover;
`;
const BannerContainerLeft = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
`;
const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 10px;
`;
const Overview = styled.p`
  font-size: 20px;
  width: 35vw;
`;
const Latest = styled(motion.div)`
  display: flex;
  height: 40px;
  width: 300px;
  border-radius: 5px;
  align-items: center;
`;
const LatestTitle = styled.div`
  font-size: 15px;
  margin-right: 10px;
`;
const BigLatest = styled(motion.div)`
  height: 1000vh;
  width: 50vh;
  display: flex;
  margin-right: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const BigLatestCover = styled.div`
  z-index: 77;
  background-size: cover;
  background-position: center center;
  height: 40%;
  width: 40%;
  border-radius: 10px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.754), 0 30px 40px rgba(0, 0, 0, 0.746);
`;
const LatestCategory = styled.span`
  font-size: 10px;
  margin-left: 10%;
`;
const LatestText = styled.span`
  font-size: 18px;
  margin-left: 10%;
`;

const latestVariant: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
const SliderDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const SliderTitle = styled.div`
  position: relative;
  top: -145px;
  font-size: 40px;
  margin-left: 49px;
`;
const Slider = styled(motion.div)`
  position: relative;
  top: -150px;
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
  width: 35%;
  height: 70%;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.754), 0 30px 40px rgba(0, 0, 0, 0.746);
`;
const Overlay = styled(motion.div)`
  z-index: 55;
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
  top: -60px;
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
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  color: ${(prop) => prop.theme.white.lighter};
`;
const BigBoxOverviewButton = styled.div`
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
const BigBoxOverviewRowDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  bottom: 220px;
  margin-left: 10px;
`;
const BigBoxOverviewCategory = styled.div`
  text-align: left;
  font-size: 5px;
  width: 35%;
`;
const BigBoxOverviewCategoryDetail = styled.div`
  text-align: left;
  font-size: 25px;
  width: 65%;
`;

function Tv() {
  const [showingLatest, setShowingLatest] = useState(false);
  const onLatestButtonClick = () => setShowingLatest((prev) => !prev);
  const [latestTvData, setLatestTvData] = useState<ILatestTv>();
  async function getlatestTv() {
    const response = await fetch(
      `${BASE_URL}/tv/latest?api_key=${API_KEY}&language=ko-KR`
    );
    const json = await response.json();
    setLatestTvData(json);
    console.log(json);
  }
  useEffect(() => {
    getlatestTv();
  }, []);

  const [bigBoxOverviewClicked, setBigBoxOverviewClicked] = useState(false);
  const [data, setData] = useState<IGetTvResult>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRowGoRight, setIsRowGoRight] = useState(true);
  async function getMovies() {
    const response = await fetch(
      `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=ko-KR`
    );
    const json = await response.json();
    setData(json);
    setIsLoading((prev) => !prev);
  }
  const [photoPath, setPhotoPath] = useState("");
  useEffect(() => {
    getMovies();
  }, []);
  const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const bigMovieMatchOverview = useRouteMatch<{ tvId: string }>(
    "/tv/:tvId/overview"
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
  };
  const onBoxClicked = async (movieId: string) => {
    history.push(`/tv/${movieId}`);
    await getClickedMovies(movieId);
  };
  async function getClickedMovies(movieId: string) {
    const response = await fetch(
      `${BASE_URL}/tv/${movieId}?api_key=${API_KEY}&language=ko-KR`
    );
    const json = await response.json();
    setClickedMoiveData(json);
    console.log(json);
  }
  const onOverlayClicked = () => {
    setBigBoxOverviewClicked((prev) => !prev);
    history.push("/tv");
  };
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.tvId);

  const [clickedMoiveData, setClickedMoiveData] = useState<IGetClickedTv>();

  const onBigBoxOverviewButtonClicked = (movieId: string) => {
    setBigBoxOverviewClicked((prev) => !prev);
    history.push(`/tv/${movieId}/overview`);
  };
  console.log(latestTvData?.poster_path);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading... </Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(data?.results[19].backdrop_path || "")}
          >
            <BannerContainerLeft>
              <Title>{data?.results[19].name}</Title>
              <Overview>{data?.results[19].overview}</Overview>
            </BannerContainerLeft>
            <AnimatePresence>
              {!showingLatest ? (
                <Latest
                  variants={latestVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <LatestTitle>가장 최근 작품 확인</LatestTitle>

                  <svg
                    onClick={onLatestButtonClick}
                    style={{
                      zIndex: 55,
                      fill: "#e5dedee1",
                      height: "15px",
                      width: "15px",
                      cursor: "pointer",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM382.6 302.6l-103.1 103.1C270.7 414.6 260.9 416 256 416c-4.881 0-14.65-1.391-22.65-9.398L129.4 302.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 306.8V128c0-17.69 14.33-32 32-32s32 14.31 32 32v178.8l49.38-49.38c12.5-12.5 32.75-12.5 45.25 0S395.1 290.1 382.6 302.6z" />
                  </svg>
                </Latest>
              ) : (
                <BigLatest
                  variants={latestVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Overlay onClick={onLatestButtonClick} />
                  {latestTvData?.poster_path ? (
                    <BigLatestCover
                      style={{
                        backgroundImage: `url(${makeImagePath(
                          latestTvData?.poster_path as any,
                          "w500"
                        )})`,
                      }}
                    />
                  ) : (
                    <svg
                      style={{
                        zIndex: 55,
                        fill: "#e5dedee1",
                        height: "30px",
                        width: "30px",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M326.1 160l127.4-127.4C451.7 32.39 449.9 32 448 32h-86.06l-128 128H326.1zM166.1 160l128-128H201.9l-128 128H166.1zM497.7 56.19L393.9 160H512V96C512 80.87 506.5 67.15 497.7 56.19zM134.1 32H64C28.65 32 0 60.65 0 96v64h6.062L134.1 32zM0 416c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V192H0V416z" />
                    </svg>
                  )}
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <LatestCategory>영화 이름</LatestCategory>
                    <LatestText>{latestTvData?.name}</LatestText>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <LatestCategory>마지막 방송</LatestCategory>
                    <LatestText>{latestTvData?.last_air_date}</LatestText>
                  </div>
                </BigLatest>
              )}
            </AnimatePresence>
          </Banner>
          <SliderDiv>
            <SliderTitle>오늘 방송 예정</SliderTitle>
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
                    variants={
                      isRowGoRight ? rowGoRightVariant : rowGoLeftVariant
                    }
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {data?.results
                      .slice(0, 18)
                      .slice(offset * index, offset * index + offset)
                      .map((movie, index) => (
                        <Box
                          layoutId={movie.id + ""}
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
                            <h4>{movie.name}</h4>
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
                  layoutId={bigMovieMatch.params.tvId}
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
                          clickedMovie.name.length > 25
                            ? { top: -95 }
                            : { top: -60 }
                        }
                      >
                        {clickedMovie.name}
                      </BigBoxTitle>

                      <BigBoxTagline
                        style={
                          clickedMovie.name.length > 25
                            ? { top: -110 }
                            : { top: -60 }
                        }
                      >
                        {clickedMoiveData?.tagline
                          ? clickedMoiveData.tagline
                          : clickedMoiveData?.overview.slice(0, 30)}
                        {clickedMoiveData?.overview ? "..." : null}
                      </BigBoxTagline>
                      {clickedMoiveData?.last_episode_to_air.air_date ? (
                        <BigBoxOverviewButtonAndSvgDiv
                          style={
                            clickedMovie.name.length > 25
                              ? { top: -130 }
                              : { top: -80 }
                          }
                        >
                          <BigBoxOverviewButton>
                            방송 정보 보기
                          </BigBoxOverviewButton>
                          <BigBoxOverviewButtonSvg
                            onClick={() =>
                              onBigBoxOverviewButtonClicked(
                                clickedMovie.id + ""
                              )
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
                            <RateAndDate>첫 방영일</RateAndDate>
                            {clickedMoiveData?.first_air_date}
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
                  layoutId={bigMovieMatchOverview.params.tvId}
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
                          clickedMovie.name.length > 25
                            ? { top: -95 }
                            : { top: -60 }
                        }
                      >
                        {clickedMovie.name}
                      </BigBoxTitle>

                      <BigBoxOverviewButtonAndSvgDiv
                        style={
                          clickedMovie.name.length > 25
                            ? { top: -90 }
                            : { top: -60 }
                        }
                      >
                        {/* <BigBoxOverviewButton> */}
                        {/* <BigBoxOverviewRowDiv> */}

                        {/* </BigBoxOverviewRowDiv> */}
                        {/* </BigBoxOverviewButton> */}
                      </BigBoxOverviewButtonAndSvgDiv>

                      <BigBoxOverviewRowDiv>
                        <div
                          style={{
                            display: "flex",
                            width: "50%",
                          }}
                        >
                          <BigBoxOverviewCategory>
                            총 에피소드
                          </BigBoxOverviewCategory>
                          <BigBoxOverviewCategoryDetail>
                            {clickedMoiveData?.number_of_episodes}
                          </BigBoxOverviewCategoryDetail>
                        </div>
                        <div style={{ display: "flex", width: "50%" }}>
                          <BigBoxOverviewCategory>
                            총 시즌
                          </BigBoxOverviewCategory>
                          <BigBoxOverviewCategoryDetail>
                            {clickedMoiveData?.number_of_seasons}
                          </BigBoxOverviewCategoryDetail>{" "}
                        </div>
                        <div style={{ display: "flex", width: "50%" }}>
                          <BigBoxOverviewCategory>
                            마지막 방송일
                          </BigBoxOverviewCategory>
                          <BigBoxOverviewCategoryDetail>
                            {clickedMoiveData?.last_episode_to_air.air_date}
                          </BigBoxOverviewCategoryDetail>
                        </div>
                        <div style={{ display: "flex", width: "50%" }}>
                          <BigBoxOverviewCategory>
                            홈페이지
                          </BigBoxOverviewCategory>
                          <BigBoxOverviewCategoryDetail>
                            {clickedMoiveData?.homepage}
                          </BigBoxOverviewCategoryDetail>
                        </div>
                      </BigBoxOverviewRowDiv>

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
                            <RateAndDate>첫 방영일</RateAndDate>
                            {clickedMoiveData?.first_air_date}
                          </RateAndDatediv>
                        </BigBoxGenresDiv>
                      </BigBoxGenres>
                    </>
                  ) : null}
                </BigBox>
              </>
            ) : null}
          </AnimatePresence>
          <LatestShow />
          <PopularTv />
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
