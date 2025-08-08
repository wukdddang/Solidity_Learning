import { TemplatesProvider } from "./_context/templates.context";
import TemplatesContent from "./_ui/templates-content";

export default function TemplatesPage() {
  return (
    <TemplatesProvider>
      <TemplatesContent />
    </TemplatesProvider>
  );
}
