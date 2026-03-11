"use client";

import dynamic from "next/dynamic";
import Loader from "./components/Loader";
import ProgressBar from "./components/ProgressBar";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Publications from "./components/Publications";
import Projects from "./components/Projects";
import About from "./components/About";
import Education from "./components/Education";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollHint from "./components/ScrollHint";

const ThreeBackground = dynamic(() => import("./components/ThreeBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Loader />
      <ProgressBar />
      <Cursor />
      <ThreeBackground />
      <div className="grid-overlay" />
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Publications />
      <Projects />
      <Stack />
      <Contact />
      <Footer />
      <ScrollHint />
    </>
  );
}
