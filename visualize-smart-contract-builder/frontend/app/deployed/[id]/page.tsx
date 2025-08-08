import { DeployedProvider } from "./_context/deployed.context";
import DeployedContent from "./_ui/deployed-content";

interface DeployedPageProps {
  params: {
    id: string;
  };
}

export default function DeployedPage({ params }: DeployedPageProps) {
  return (
    <DeployedProvider projectId={params.id}>
      <DeployedContent />
    </DeployedProvider>
  );
}
