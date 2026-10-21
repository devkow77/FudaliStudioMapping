import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Container } from "./components/index";
import { CornerRightDown } from "lucide-react";

interface Award {
  title: string;
  description: string;
  value: string;
}

const awards: Award[] = [
  {
    title: "Behance badges",
    description: "for UX/UI & Brand Expertise",
    value: "4 x BE GR",
  },
  {
    title: "Best Polish Rebranding",
    description: "Top 10 Finalist",
    value: "2 x RE PL",
  },
  {
    title: "BrandNew",
    description: "Logomark Spotted",
    value: "1 x BN",
  },
];

const navVariants = {
  visible: { y: "calc(0% - 0rem)" },
  hidden: { y: "calc(-100% - 1rem)" },
};

const headlineWords = ["grow", "scale", "expand", "lead"];

const RotatingWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % headlineWords.length);
    }, 2400);

    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom text-blue-500">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={headlineWords[index]}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {headlineWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

function App() {
  const { scrollY } = useScroll();
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;

    if (latest <= 8) {
      setNavHidden(false);
      lastScrollY.current = latest;
      return;
    }

    if (Math.abs(delta) < 8) return;

    setNavHidden(delta > 0);
    lastScrollY.current = latest;
  });

  return (
    <main>
      <motion.nav
        className={`fixed top-4 z-20 w-full ${navHidden ? "pointer-events-none" : ""}`}
        variants={navVariants}
        initial="visible"
        animate={navHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Container className="flex items-center justify-between xl:px-6">
          <h1 className="text-lg leading-none font-medium">
            MAGDALENA
            <br />
            FUDALI &copy;
          </h1>
          <button className="flex items-center gap-x-2 rounded-4xl bg-white p-1 pr-4">
            <div className="relative size-8 overflow-hidden rounded-full border-3 border-purple-600 lg:size-10">
              <img
                src="./people/woman.avif"
                alt="woman"
                className="absolute size-full object-cover object-center"
              />
            </div>
            <p className="text-sm font-semibold text-black md:text-base">
              Let's Talk
            </p>
          </button>
        </Container>
      </motion.nav>
      <header className="relative h-screen w-full xl:h-[200vh]">
        <Container className="fixed top-25 h-screen w-full px-0 lg:top-0 lg:flex 2xl:pr-4 2xl:pl-12">
          {/* Left Side */}
          <div className="flex items-center px-4 lg:flex-1 xl:mt-16">
            <div className="flex h-full flex-col justify-center gap-y-4">
              <h2 className="max-w-md text-5xl font-medium tracking-tighter uppercase md:text-6xl lg:text-7xl xl:max-w-xl xl:text-[80px]">
                Design for companies ready to <RotatingWord />
              </h2>
              <div>
                <div className="hidden lg:block xl:text-base">
                  <p className="mb-6 font-medium opacity-70">
                    Awards & Recognition
                  </p>
                  <div className="mb-10 flex gap-x-6">
                    {awards.map((award) => (
                      <div key={award.title} className="xl:space-y-1">
                        <p className="font-semibold xl:text-xl">
                          {award.value}
                        </p>
                        <h3 className="text-sm font-semibold">{award.title}</h3>
                        <p className="text-xs font-medium opacity-70">
                          {award.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="flex items-center gap-x-2 font-semibold lg:mt-0 lg:mb-0">
                  <a href="#" className="underline">
                    View Projects
                  </a>{" "}
                  <span className="opacity-70">or </span>
                  <a href="#" className="underline">
                    Explore Services
                  </a>
                  <CornerRightDown className="size-4 text-violet-600" />
                </p>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="top-0 left-0 z-50 hidden h-1/2 space-y-2 lg:grid lg:h-screen lg:flex-1 lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            <div className="flex gap-2 lg:flex-col lg:gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-50 min-w-50 flex-1 lg:min-h-70"
                >
                  <img
                    src={`./carousel/img${index + 1}.avif`}
                    alt=""
                    className="absolute size-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 lg:flex-col lg:gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-50 min-w-50 flex-1 lg:min-h-70"
                >
                  <img
                    src={`./carousel/img${index + 5}.avif`}
                    alt=""
                    className="absolute size-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </header>
      {/* Mobile Carousel and Awards */}
      <article className="sticky top-0 mt-[calc(-50vh+12px)] h-[200vh] overflow-hidden bg-black md:mt-[calc(-40vh)] lg:hidden">
        <section className="absolute top-0 h-screen w-full">
          {/* Carousel*/}
          <div className="relative flex h-2/3 flex-col gap-2 xl:grid xl:h-screen xl:w-1/2 xl:grid-cols-2 xl:gap-3">
            <div className="flex h-1/2 gap-2 xl:flex-col xl:gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-full min-w-50 flex-1 xl:h-70"
                >
                  <img
                    src={`./carousel/img${index + 1}.avif`}
                    alt=""
                    className="absolute size-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex h-1/2 gap-2 xl:flex-col xl:gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-full min-w-50 flex-1 xl:h-70"
                >
                  <img
                    src={`./carousel/img${index + 5}.avif`}
                    alt=""
                    className="absolute size-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Awards */}
          <div className="flex h-1/3 w-full flex-col items-center justify-center overflow-hidden">
            <p className="mb-6 font-medium">Awards & Recognition</p>
            <div className="mb-10 flex gap-x-6">
              {awards.map((award) => (
                <div key={award.title}>
                  <p className="font-semibold">{award.value}</p>
                  <h3 className="text-sm font-semibold">{award.title}</h3>
                  <p className="text-xs font-medium opacity-70">
                    {award.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
      <div className="relative z-10 h-screen bg-violet-800"></div>
    </main>
  );
}

export default App;
