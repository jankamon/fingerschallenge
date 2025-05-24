import UserGameStateInterface from "@shared/interfaces/userGameState.interface";

// Store for game states and connections
export const connectedClients = new Map<string, any>();
export const userGameStates = new Map<string, UserGameStateInterface>();
