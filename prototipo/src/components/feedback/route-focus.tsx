import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>("h1");
    document.title = `${heading?.innerText.replace(/\s+/g, " ") ?? "Página"} · MindShare`;
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
