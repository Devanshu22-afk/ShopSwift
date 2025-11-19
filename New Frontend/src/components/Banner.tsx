"use client";
import Slider from "react-slick";
import bannerone from "@/images/bannerone.png";
import bannertwo from "@/images/bannertwo.png";
import bannerthree from "@/images/bannerthree.png";
import { PiCaretLeftLight, PiCaretRightLight } from "react-icons/pi";
import Image from "next/image";
import BannerText from "./BannerText";

const Banner = () => {
  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="p-3 bg-slate-100 hover:text-orange-600 hover:bg-white cursor-pointer duration-200 rounded-full text-2xl flex items-center justify-center z-20 absolute left-2 top-1/2"
        onClick={onClick}
      >
        <PiCaretLeftLight />
      </div>
    );
  };
  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="p-3 bg-slate-100 hover:text-orange-600 hover:bg-white cursor-pointer duration-200 rounded-full text-2xl flex items-center justify-center z-20 absolute right-2 top-1/2"
        onClick={onClick}
      >
        <PiCaretRightLight />
      </div>
    );
  };
  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <div className="relative h-[800px]">
      <Slider {...settings}>
        <div className="w-full h-[800px] relative">
          <Image
            src={bannerone}
            alt="ShopSwift - Discover Amazing Products"
            className="w-full h-full object-cover relative"
            priority
          />
          <BannerText 
            title="Discover Amazing Products" 
            description="Explore our wide range of quality products at unbeatable prices. Shop with confidence and enjoy fast delivery."
          />
        </div>
        <div className="w-full h-[800px] relative">
          <Image
            src={bannertwo}
            alt="ShopSwift - Special Offers"
            className="w-full h-full object-cover relative"
          />
          <BannerText 
            title="Special Offers" 
            description="Don't miss out on our exclusive deals and seasonal discounts. Save big on your favorite items today!"
          />
        </div>
        <div className="w-full h-[800px] relative">
          <Image
            src={bannerthree}
            alt="ShopSwift - Premium Collection"
            className="w-full h-full object-cover relative"
          />
          <BannerText 
            title="Premium Collection" 
            description="Shop the latest trends and premium quality products. Elevate your style with our curated selection."
          />
        </div>
      </Slider>
      <div className="absolute w-full h-44 bg-gradient-to-t from-gray-100 to-transparent bottom-0 left-0 z-10" />
    </div>
  );
};

export default Banner;
