import { userGameStates } from "../models/userState";

const INACTIVE_THRESHOLD = 72 * 60 * 60 * 1000; // 72 hours
let cleanupInterval: NodeJS.Timeout | null = null;

export function startUserStateCleanup(): void {
  console.log("Starting user state cleanup service (every 15 minutes)");

  const cleanupInactiveUsers = () => {
    const now = new Date();
    const threshold = new Date(now.getTime() - INACTIVE_THRESHOLD);
    let removedCount = 0;

    console.log("Cleaning up inactive user states...");

    userGameStates.forEach((userState, playerId) => {
      if (userState.lastActivity < threshold) {
        console.log(`Removing inactive user state for ${playerId}`);
        userGameStates.delete(playerId);
        removedCount++;
      }
    });

    console.log(
      `Removed ${removedCount} inactive user states. Active users: ${userGameStates.size}`
    );
  };

  // Schedule every 15 minutes
  cleanupInterval = setInterval(cleanupInactiveUsers, 15 * 60 * 1000);
}

export function stopUserStateCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log("User state cleanup service stopped");
  }
}
