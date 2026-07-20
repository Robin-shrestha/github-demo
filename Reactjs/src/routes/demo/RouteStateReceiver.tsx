import { Link, useLocation } from "react-router-dom";

interface RouteState {
  note: string;
  sentAt: string;
}

function RouteStateReceiver() {
  const location = useLocation();
  const state = location.state as RouteState | null;

  if (!state) {
    return (
      <div className="status-message">
        <p>No route state here — you probably refreshed or navigated here directly.</p>
        <Link to="/demo/route-state">Go send some state</Link>
      </div>
    );
  }

  return (
    <div className="status-message">
      <p>
        Received: "{state.note}" (sent at {state.sentAt})
      </p>
      <Link to="/demo/route-state">Back</Link>
    </div>
  );
}

export default RouteStateReceiver;
