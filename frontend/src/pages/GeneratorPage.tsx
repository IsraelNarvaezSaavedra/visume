import Generator from '../components/Generator';

interface GeneratorPageProps {
  onGenerate: (data: any) => void;
}

export default function GeneratorPage({ onGenerate }: GeneratorPageProps) {
  return <Generator onGenerate={onGenerate} />;
}