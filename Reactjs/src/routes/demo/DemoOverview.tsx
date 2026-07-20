import { useOutletContext } from "react-router-dom";

interface DemoOutletContext {
  visitedAt: string;
}

function DemoOverview() {
  const { visitedAt } = useOutletContext<DemoOutletContext>();

  return (
    <div className="status-message">
      <p>DemoLayout passed this down via useOutletContext — rendered at {visitedAt}.</p>
      <p>Pick a demo above to see nested routes, query params, or route state in action.</p>
    </div>
  );
}

export default DemoOverview;
