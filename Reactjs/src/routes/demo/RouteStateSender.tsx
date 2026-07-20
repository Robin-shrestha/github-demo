import { useNavigate } from "react-router-dom";

function RouteStateSender() {
  const navigate = useNavigate();

  function handleSend(): void {
    navigate("/demo/route-state/receiver", {
      state: { note: "Custom state", sentAt: new Date().toLocaleTimeString() },
    });
  }

  return (
    <div className="status-message">
      <p>
        Clicking below navigates with a `state` object attached to the navigation itself — it never
        appears in the URL, and it's gone if you refresh or link directly to the receiver page.
      </p>
      <button type="button" className="btn" onClick={handleSend}>
        Send with route state
      </button>
    </div>
  );
}

export default RouteStateSender;
