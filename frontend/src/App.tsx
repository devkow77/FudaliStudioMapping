import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Container } from "./components/index";
import { CornerRightDown } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

const GalleryTrack = ({
  imageOffset,
  style,
}: {
  imageOffset: number;
  style: {
    x: MotionValue<string> | string;
    y: MotionValue<string> | string;
  };
}) => (
  <div
    aria-hidden="true"
    className="relative min-h-0 flex-1 overflow-hidden lg:h-full lg:flex-none"
  >
    <motion.div
      style={style}
      className="absolute top-0 left-0 flex h-full w-max gap-3 lg:inset-x-0 lg:bottom-auto lg:h-auto lg:w-full lg:flex-col lg:gap-4"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative h-full w-[clamp(220px,84vw,300px)] shrink-0 lg:h-[52vh] lg:w-full"
        >
          <img
            src={`./carousel/img${(index % 4) + imageOffset}.avif`}
            alt=""
            className="absolute size-full object-cover object-center"
          />
        </div>
      ))}
    </motion.div>
  </div>
);

const RotatingWord = () => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % headlineWords.length);
    }, 2400);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  if (reduceMotion) {
    return <span className="text-violet-600">{headlineWords[0]}</span>;
  }

  return (
    <span className="relative inline-flex overflow-hidden align-bottom text-violet-600">
      <span className="sr-only">{headlineWords[0]}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={headlineWords[index]}
          aria-hidden="true"
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
  const headerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const { scrollYProgress: desktopProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: mobileProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"],
  });
  const smoothScroll = { bounce: 0, visualDuration: 0.7 };
  const smoothDesktop = useSpring(desktopProgress, smoothScroll);
  const smoothMobile = useSpring(mobileProgress, smoothScroll);
  const columnUp = useTransform(smoothDesktop, [0, 1], ["0%", "-58%"]);
  const columnDown = useTransform(smoothDesktop, [0, 1], ["-58%", "0%"]);
  const rowLeft = useTransform(
    smoothMobile,
    [0, 0.5, 1],
    ["0%", "-28%", "-28%"],
  );
  const rowRight = useTransform(
    smoothMobile,
    [0, 0.5, 1],
    ["-28%", "0%", "0%"],
  );
  const firstTrack = isDesktop
    ? { x: "0%", y: columnUp }
    : { x: rowLeft, y: "0%" };
  const secondTrack = isDesktop
    ? { x: "0%", y: columnDown }
    : { x: rowRight, y: "0%" };
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.4,
    });

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <motion.header
        className={`fixed top-4 z-20 w-full ${navHidden ? "pointer-events-none" : ""}`}
        variants={navVariants}
        initial="visible"
        animate={navHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeOut" }}
        inert={navHidden || undefined}
      >
        <nav aria-label="Main">
          <Container className="flex items-center justify-between xl:px-6">
            <a
              href="#content"
              className="text-lg leading-none font-medium text-inherit no-underline"
            >
              MAGDALENA
              <br />
              FUDALI &copy;
              <span className="sr-only">, home</span>
            </a>
            <a
              href="#contact"
              className="group flex cursor-pointer items-center gap-x-2 rounded-4xl bg-white p-1 pr-4 text-inherit no-underline transition-all duration-300 hover:rounded-[0%] hover:bg-violet-600"
            >
              <span className="relative size-8 overflow-hidden rounded-[50%] border-3 border-violet-600 transition-all duration-300 group-hover:rounded-[0%] lg:size-10">
                <img
                  src="./people/woman.avif"
                  alt=""
                  className="absolute size-full object-cover object-center"
                />
              </span>
              <span className="text-sm font-semibold text-black md:text-base">
                Let's Talk
              </span>
            </a>
          </Container>
        </nav>
      </motion.header>
      <main id="content" tabIndex={-1} className="outline-none">
        <header ref={headerRef} className="relative w-full lg:h-[200vh]">
          <Container className="px-0 lg:fixed lg:inset-0 lg:flex lg:h-screen lg:w-full lg:flex-row 2xl:pr-4 2xl:pl-12">
            <div className="relative z-10 flex items-center px-4 pt-25 pb-6 lg:static lg:z-auto lg:h-full lg:min-h-0 lg:flex-1 lg:pt-0 lg:pb-0 xl:mt-10">
              <div className="flex h-full flex-col justify-center gap-y-4">
                <h1
                  id="hero-heading"
                  className="max-w-md text-5xl font-medium tracking-tighter uppercase md:text-6xl lg:text-7xl xl:max-w-xl xl:text-[80px]"
                >
                  Design for companies ready to <RotatingWord />
                </h1>
                <div>
                  <section
                    aria-labelledby="awards-heading"
                    className="hidden lg:block xl:text-base"
                  >
                    <h2
                      id="awards-heading"
                      className="mb-6 font-medium opacity-70"
                    >
                      Awards & Recognition
                    </h2>
                    <ul role="list" className="mb-10 flex gap-x-6">
                      {awards.map((award) => (
                        <li
                          key={award.title}
                          role="listitem"
                          className="xl:space-y-1"
                        >
                          <p className="font-semibold xl:text-xl">
                            {award.value}
                          </p>
                          <h3 className="text-sm font-semibold">
                            {award.title}
                          </h3>
                          <p className="text-xs font-medium opacity-70">
                            {award.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <nav
                    aria-label="Explore"
                    className="flex items-center gap-x-2 font-semibold lg:mt-0 lg:mb-0"
                  >
                    <a href="#projects" className="text-inherit underline">
                      View Projects
                    </a>{" "}
                    <span className="opacity-70">or </span>
                    <a href="#services" className="text-inherit underline">
                      Explore Services
                    </a>
                    <CornerRightDown
                      aria-hidden="true"
                      className="size-4 text-violet-600"
                    />
                  </nav>
                </div>
              </div>
            </div>
            <div
              ref={galleryRef}
              className="relative h-[300vh] lg:h-full lg:min-h-0 lg:flex-1"
            >
              <div className="sticky top-0 z-0 flex h-screen flex-col overflow-hidden lg:static lg:grid lg:h-full lg:grid-cols-2 lg:grid-rows-1 lg:gap-3">
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden py-3 lg:contents">
                  <GalleryTrack imageOffset={1} style={firstTrack} />
                  <GalleryTrack imageOffset={5} style={secondTrack} />
                </div>
                <section
                  aria-labelledby="awards-heading-mobile"
                  className="flex w-full shrink-0 flex-col items-center overflow-hidden pt-4 pb-8 lg:hidden"
                >
                  <h2
                    id="awards-heading-mobile"
                    className="mb-2 font-semibold text-violet-200"
                  >
                    Awards & Recognition
                  </h2>
                  <div className="w-full overflow-hidden">
                    <div className="awards-marquee flex w-max">
                      <ul role="list" className="flex shrink-0 gap-10 pr-10">
                        {awards.map((award) => (
                          <li
                            key={award.title}
                            role="listitem"
                            className="flex min-h-24 w-[50vw] shrink-0 flex-col justify-center"
                          >
                            <p className="font-semibold">{award.value}</p>
                            <h3 className="text-sm font-semibold">
                              {award.title}
                            </h3>
                            <p className="text-xs font-medium opacity-70">
                              {award.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div
                        aria-hidden="true"
                        className="flex shrink-0 gap-10 pr-10"
                      >
                        {awards.map((award) => (
                          <div
                            key={award.title}
                            className="flex min-h-24 w-[50vw] shrink-0 flex-col justify-center"
                          >
                            <p className="font-semibold">{award.value}</p>
                            <p className="text-sm font-semibold">
                              {award.title}
                            </p>
                            <p className="text-xs font-medium opacity-70">
                              {award.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </Container>
        </header>
        <div className="relative z-20 mt-[-100vh] h-screen bg-black lg:mt-0"></div>
      </main>
    </>
  );
}

export default App;
