import Generator from '../components/Generator';

interface GeneratorPageProps {
  onGenerate: (data: any) => void;
  onUpgrade: () => void;
}

export default function GeneratorPage({ onGenerate, onUpgrade }: GeneratorPageProps) {
  return <Generator onGenerate={onGenerate} onUpgrade={onUpgrade} />;
}