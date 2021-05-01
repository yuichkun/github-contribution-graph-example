import { useCallback, useReducer } from "react";
import { DomainTuple } from "victory";

type Domain = {
  x?: DomainTuple | undefined;
  y?: DomainTuple | undefined;
};

type State = {
  zoomDomain: Domain;
  selectedZoomDomain: Domain;
};
type Action = {
  type: "setZoomDomain" | "setSelectedZoomDomain";
  value: Domain;
};

function reducer(state: State, action: Action): State {
  if (action.type === "setZoomDomain") {
    return {
      ...state,
      zoomDomain: action.value,
    };
  }
  if (action.type === "setSelectedZoomDomain") {
    return {
      ...state,
      selectedZoomDomain: action.value,
    };
  }
  return state;
}

const initialState: State = {
  zoomDomain: {},
  selectedZoomDomain: {},
};

export function useZoom() {
  const [{ zoomDomain, selectedZoomDomain }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const setZoomDomain = useCallback((domain) => {
    dispatch({
      type: 'setZoomDomain',
      value: domain
    })
  }, [])

  const setSelectedZoomDomain = useCallback((domain) => {
    dispatch({
      type: 'setSelectedZoomDomain',
      value: domain
    })
  }, [])

  return {
    setZoomDomain,
    setSelectedZoomDomain,
    zoomDomain,
    selectedZoomDomain
  }
}