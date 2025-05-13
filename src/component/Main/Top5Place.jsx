import { useNavigate } from "react-router-dom";
import SamplePopData from "../../datas/Sample/SamplePopData";
import Slider from "react-slick";
import { MdArrowCircleRight, MdArrowCircleLeft } from "react-icons/md";
import { Wrapper,TitleBox,SliderContainer,SlideItem,SlideImage,Overlay,
 } from "../../styles/RolingSlideStyle";


// 화살표 컴포넌트 (함수형으로 onClick 받음)
const PrevArrow = (props) => {
  const { onClick, style } = props;
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <MdArrowCircleLeft size={36} color="#333" />
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick, style } = props;
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <MdArrowCircleRight size={36} color="#333" />
    </button>
  );
};


function Top5Place() {
  const navigate = useNavigate();

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "100px",
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Wrapper>
      <TitleBox>인기 명소</TitleBox>
      <SliderContainer>
        <Slider {...settings}>
          {SamplePopData.map((item) => (
            <SlideItem key={item.id} onClick={() => navigate(`/spot/${item.id}`)}>
              <SlideImage src={item.imgUrl} alt={item.name} />
              <Overlay>
                {item.region} {item.spot}
              </Overlay>
            </SlideItem>
          ))}
        </Slider>
      </SliderContainer>
    </Wrapper>
  );
}

export default Top5Place;
