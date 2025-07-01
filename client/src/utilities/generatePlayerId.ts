export const generatePlayerId = (): string => {
  return "player_" + Date.now() + Math.random().toString(36);
};
