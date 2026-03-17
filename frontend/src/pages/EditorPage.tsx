import Editor from '../components/Editor';

interface EditorPageProps {
  resumeData: any;
}

export default function EditorPage({ resumeData }: EditorPageProps) {
  return <Editor resumeData={resumeData} />;
}
