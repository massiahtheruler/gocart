'use client'
import ActiveDeals from "@/components/ActiveDeals";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import RevealSection from "@/components/RevealSection";

export default function Home() {
    return (
        <div>
            <RevealSection delay={40}>
                <Hero />
            </RevealSection>
            <RevealSection delay={130}>
                <ActiveDeals />
            </RevealSection>
            <RevealSection delay={220}>
                <LatestProducts />
            </RevealSection>
            <RevealSection delay={310}>
                <BestSelling />
            </RevealSection>
            <RevealSection delay={400}>
                <OurSpecs />
            </RevealSection>
            <RevealSection delay={490}>
                <Newsletter />
            </RevealSection>
        </div>
    );
}
