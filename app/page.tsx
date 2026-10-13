import "./art.css";
import "./life.css";
import "./home.css";
import "./torn.css";
import { Api } from "@/components/home/api";
import { HomeFooter, Start } from "@/components/home/closing";
import { CustomizeSection } from "@/components/home/customize-section";
import { Hero } from "@/components/home/hero";
import { Showcase } from "@/components/home/showcase";

export default function Home() {
  return (
    <>
      <main id="main" className="home mx-auto w-full max-w-[85rem] flex-1 px-4 sm:px-8">
        <Hero />
        <Showcase />
        <Api />
        <CustomizeSection />
        <Start />
      </main>
      <HomeFooter />
    </>
  );
}
