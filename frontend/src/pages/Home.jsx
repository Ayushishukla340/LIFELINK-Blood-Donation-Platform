import Hero from "../components/Hero/Hero";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import BloodFacts from "../components/BloodFacts/BloodFacts";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Statistics from "../components/Statistics/Statistics";
import CountUp from "react-countup";

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <BloodFacts />
      <WhyChoose />
      <Statistics />
    </>
  );
}

export default Home;