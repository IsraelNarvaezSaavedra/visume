import Hero from '../components/homepage/Hero';
import HowItWorks from '../components/homepage/HowItWorks';

interface HomePageProps {
  onGetStarted: () => void;
}

export default function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <HowItWorks />
    </>
  );
}
