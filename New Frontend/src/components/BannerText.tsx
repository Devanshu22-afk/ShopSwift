import Container from "./Container";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  title: string;
  description?: string;
}

const BannerText = ({ title, description }: Props) => {
  const defaultDescription = "ShopSwift - Your one-stop destination for quality products, amazing deals, and exceptional service.";
  
  return (
    <div className="hidden lg:inline-block absolute top-0 left-0 w-full h-full">
      <Container className="flex h-full flex-col gap-y-6 justify-center">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-lg md:text-xl text-slate-100 drop-shadow-md max-w-2xl"
        >
          {description || defaultDescription}
        </motion.p>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex gap-x-4 mt-2"
        >
          <Link href="/">
            <button className="py-3 px-6 rounded-full bg-white hover:bg-orange-500 hover:text-white text-orange-600 duration-200 text-sm uppercase font-semibold shadow-lg">
              Explore Now
            </button>
          </Link>
          <Link href="/cart">
            <button className="py-3 px-6 rounded-full bg-orange-600 hover:bg-orange-700 text-white duration-200 text-sm uppercase font-semibold shadow-lg">
              Shop Now
            </button>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
};

export default BannerText;
