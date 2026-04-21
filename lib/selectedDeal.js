const SELECTED_DEAL_KEY = "gocart-selected-deal";

export const getSelectedDealCode = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SELECTED_DEAL_KEY) || "";
};

export const setSelectedDealCode = (code) => {
  if (typeof window === "undefined") return;
  if (!code) {
    window.localStorage.removeItem(SELECTED_DEAL_KEY);
  } else {
    window.localStorage.setItem(SELECTED_DEAL_KEY, code.toUpperCase());
  }

  window.dispatchEvent(new CustomEvent("gocart:selected-deal"));
};

export const clearSelectedDealCode = () => {
  setSelectedDealCode("");
};
