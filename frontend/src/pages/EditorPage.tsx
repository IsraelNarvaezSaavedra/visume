import Editor from '../components/Editor';

interface EditorPageProps {
  resumeData: any;
  onUpgrade: () => void;
}

export default function EditorPage({ resumeData, onUpgrade }: EditorPageProps) {
  return <Editor resumeData={resumeData} onUpgrade={onUpgrade} />;
}
