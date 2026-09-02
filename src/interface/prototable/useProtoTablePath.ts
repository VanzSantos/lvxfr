import { useCallback, useEffect, useState } from "react";

export interface ProtoTablePath {
  project: string | null;
  module: string | null;
  flow: string | null;
}

const PARAM_PROJECT = "pt_project";
const PARAM_MODULE = "pt_module";
const PARAM_FLOW = "pt_flow";

function readPath(): ProtoTablePath {
  const params = new URLSearchParams(window.location.search);
  return {
    project: params.get(PARAM_PROJECT),
    module: params.get(PARAM_MODULE),
    flow: params.get(PARAM_FLOW),
  };
}

/** Caminho de navegação do ProtoTable (Projeto/Módulo/Fluxo selecionados)
    guardado na URL (query params), não em useState solto — é o que permite
    reaproveitar o átomo Breadcrumb de verdade (ele só aceita `href`, sem
    onClick, ver contratos/breadcrumb.contract.json) com back/forward do
    navegador funcionando e URL compartilhável, sem precisar adicionar uma
    lib de rotas nova (mesmo racional do ?standalone= que o App já usa). */
export function useProtoTablePath() {
  const [path, setPath] = useState<ProtoTablePath>(readPath);

  useEffect(() => {
    function onPopState() {
      setPath(readPath());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((next: Partial<ProtoTablePath>) => {
    const merged: ProtoTablePath = { ...readPath(), ...next };
    const params = new URLSearchParams(window.location.search);
    if (merged.project) params.set(PARAM_PROJECT, merged.project);
    else params.delete(PARAM_PROJECT);
    if (merged.module) params.set(PARAM_MODULE, merged.module);
    else params.delete(PARAM_MODULE);
    if (merged.flow) params.set(PARAM_FLOW, merged.flow);
    else params.delete(PARAM_FLOW);

    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.pushState({}, "", url);
    setPath(readPath());
  }, []);

  /** Href pra um Breadcrumb real — mesmo formato que `navigate` produziria,
      mas como string estática (o link é clicado como <a>, não via JS). */
  const hrefFor = useCallback((next: Partial<ProtoTablePath>) => {
    const merged: ProtoTablePath = { ...readPath(), ...next };
    const params = new URLSearchParams(window.location.search);
    if (merged.project) params.set(PARAM_PROJECT, merged.project);
    else params.delete(PARAM_PROJECT);
    if (merged.module) params.set(PARAM_MODULE, merged.module);
    else params.delete(PARAM_MODULE);
    if (merged.flow) params.set(PARAM_FLOW, merged.flow);
    else params.delete(PARAM_FLOW);
    const query = params.toString();
    return `${window.location.pathname}${query ? `?${query}` : ""}`;
  }, []);

  return { path, navigate, hrefFor };
}
