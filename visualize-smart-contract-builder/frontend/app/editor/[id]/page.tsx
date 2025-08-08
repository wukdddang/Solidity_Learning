import { EditorProvider } from "./_context/editor.context";
import EditorContent from "./_ui/editor-content";

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <EditorProvider projectId={params.id}>
      <EditorContent />
    </EditorProvider>
  );
}
