import { DeployProvider } from "./_context/deploy.context";
import DeployContent from "./_ui/deploy-content";

interface DeployPageProps {
  params: {
    id: string;
  };
}

export default function DeployPage({ params }: DeployPageProps) {
  return (
    <DeployProvider projectId={params.id}>
      <DeployContent />
    </DeployProvider>
  );
}
