import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SnippetsProvider } from "@/components/theme/Snippets";
import { FloatingBits, Nav, TopBar } from "@/components/sections/Chrome";
import { Access, Footer, Production, Waitlist } from "@/components/sections/Closing";
import { Codebase } from "@/components/sections/Codebase";
import { Does } from "@/components/sections/Does";
import { Enterprise } from "@/components/sections/Enterprise";
import { Gov } from "@/components/sections/Gov";
import { Hero } from "@/components/sections/Hero";
import { Models } from "@/components/sections/Models";
import { Pair } from "@/components/sections/Pair";
import { Receive } from "@/components/sections/Receive";
import { Surfaces } from "@/components/sections/Surfaces";
import { Why } from "@/components/sections/Why";
import { highlightSnippets } from "@/lib/highlight";

export default async function Home() {
  const snippets = await highlightSnippets();
  return (
    <SnippetsProvider value={snippets}>
      <SmoothScroll />
      <TopBar />
      <Nav />
      <main id="main">
        <Hero />
        <Why />
        <Does />
        <Codebase />
        <Surfaces />
        <Pair />
        <Gov />
        <Receive />
        <Models />
        <Enterprise />
        <Production />
        <Waitlist />
        <Access />
      </main>
      <Footer />
      <FloatingBits />
    </SnippetsProvider>
  );
}
