import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";

export default function Home() {
  return (
    <main className="pb-24 sm:pb-48 px-0 overflow-x-hidden">
        <Appbar />
        <Hero />
        <div className="pt-4 sm:pt-8 px-4 sm:px-6">
          <HeroVideo />
        </div>
    </main>
  );
}