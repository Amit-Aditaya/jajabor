export const PORTFOLIO_TABS_ID = "portfolio-tabs";

export function scrollToPortfolioTabs() {
  document.getElementById(PORTFOLIO_TABS_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
