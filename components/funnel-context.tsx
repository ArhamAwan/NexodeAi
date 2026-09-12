"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type FunnelController = {
  open: () => void;
  focus: () => void;
};

const FunnelContext = createContext<FunnelController | null>(null);

export function useFunnelActions() {
  return useContext(FunnelContext);
}

type FunnelProviderProps = {
  children: ReactNode;
  controller: FunnelController;
};

export function FunnelProvider({ children, controller }: FunnelProviderProps) {
  const value = useMemo(() => controller, [controller]);
  return (
    <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>
  );
}

export function useFunnelControllerRef() {
  const openRef = useRef<() => void>(() => {});
  const focusRef = useRef<() => void>(() => {});

  const register = useCallback((api: FunnelController) => {
    openRef.current = api.open;
    focusRef.current = api.focus;
  }, []);

  const controller = useMemo<FunnelController>(
    () => ({
      open: () => openRef.current(),
      focus: () => focusRef.current(),
    }),
    [],
  );

  return { controller, register };
}
