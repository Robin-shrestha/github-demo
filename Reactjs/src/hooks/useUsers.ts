import { useEffect, useState } from "react";
import type { User } from "../types/types";
import { listUsers } from "../api/users";

type UsersState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; users: User[] };

export interface UseUsersResult {
  state: UsersState;
  reload: () => void;
}

function useUsers(token: string | null): UseUsersResult {
  const [state, setState] = useState<UsersState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const users = await listUsers(token);
        if (cancelled) return;
        setState({ status: "success", users });
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  return { state, reload: () => setReloadKey((k) => k + 1) };
}

export default useUsers;
