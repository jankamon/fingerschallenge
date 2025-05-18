import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import socket from "@/services/socket";
import { playSound, playDelayedSound } from "@/utilities/playSound";
import UserGameStateInterface from "@shared/interfaces/userGameState.interface";
import UserMove from "@shared/interfaces/userMoves.interface";

interface GameContextType {
  handleSelectDifficulty: (difficulty: DifficultyEnum) => void;
  handleMove: (move: LockpickMoveEnum) => void;
  handleNextChest: () => void;
  handleSaveResult: (username: string) => void;
  closeSaveResultDialog: () => void;
  handleGetLeaderboard: (limit: number) => void;
  handleTryAgain: () => void;
  difficulty: DifficultyEnum | null;
  lockpicks: number;
  message: string;
  currentChestLevel: number;
  isChestOpen: boolean;
  score: number;
  openedChests: number;
  highestOpenedChestLevel: number;
  isSaveResultDialogOpen: boolean;
  leaderboard: UserGameStateInterface[];
  userMovesVisualisation: UserMove[];
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [difficulty, setDifficulty] = useState<DifficultyEnum | null>(null);
  const [lockpicks, setLockpicks] = useState<number>(0);
  const [currentChestLevel, setCurrentChestLevel] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [openedChests, setOpenedChests] = useState<number>(0);
  const [highestOpenedChestLevel, setHighestOpenedChestLevel] =
    useState<number>(0);
  const [isSaveResultDialogOpen, setIsSaveResultDialogOpen] =
    useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<UserGameStateInterface[]>([]);
  const [userMovesVisualisation, setUserMovesVisualisation] = useState<
    UserMove[]
  >([]);

  // Audio elements
  const successSound = useRef<HTMLAudioElement | null>(null);
  const brokenSound = useRef<HTMLAudioElement | null>(null);
  const failureSound = useRef<HTMLAudioElement | null>(null);
  const openSound = useRef<HTMLAudioElement | null>(null);

  const handleSelectDifficulty = (selectedDifficulty: DifficultyEnum) => {
    // Emit difficulty selection to server
    socket.emit(
      "select_difficulty",
      selectedDifficulty,
      ({
        lockpicksCount,
        newChestLevel,
      }: {
        lockpicksCount: number;
        newChestLevel: number;
      }) => {
        setLockpicks(lockpicksCount);
        setCurrentChestLevel(newChestLevel);
        setDifficulty(selectedDifficulty);
        setUserMovesVisualisation([]);

        console.log(`Selected difficulty: ${selectedDifficulty}`);
        console.log(`Received lockpicks count: ${lockpicksCount}`);
      }
    );
  };

  const handleMove = (move: number) => {
    if (lockpicks <= 0) {
      setMessage("You have no lockpicks left!");
      return;
    }

    if (isChestOpen) {
      setMessage("The chest is already open!");
      return;
    }

    // Emit move to server
    socket.emit(
      "lockpick_move",
      move,
      (result: {
        success: boolean;
        message: string;
        lockpicksRemaining: number;
        currentStep: number;
        isChestOpen?: boolean;
        score?: number;
        openedChests?: number;
        highestOpenedChestLevel?: number;
        allowedToSave?: boolean;
      }) => {
        console.log(`Move result: ${JSON.stringify(result)}`);

        // Update state based on server response
        setLockpicks(result.lockpicksRemaining);
        setMessage(result.message);

        recordUserMoveForVisualisation(
          move,
          result.success,
          result.currentStep ?? 0
        );

        if (result.success) {
          playSound(successSound.current);

          if (result.isChestOpen) {
            // Chest is open!
            setIsChestOpen(true);
            setScore(result.score ?? score);
            setOpenedChests(result.openedChests ?? openedChests);
            setHighestOpenedChestLevel(
              result.highestOpenedChestLevel ?? highestOpenedChestLevel
            );

            // Play open sound with delay to not interrupt success sound
            playDelayedSound(openSound.current, 300);
          }
        } else {
          if (result.allowedToSave) {
            setIsSaveResultDialogOpen(true);
          }

          // Failed move
          if (Math.random() < 0.5) {
            playSound(brokenSound.current);
          } else {
            playSound(failureSound.current);
          }
        }
      }
    );
  };

  const handleNextChest = () => {
    if (!isChestOpen) {
      return;
    }

    // Send request for next chest to server
    socket.emit(
      "next_chest",
      ({ newChestLevel }: { newChestLevel: number }) => {
        // Reset user moves
        if (difficulty === DifficultyEnum.ADEPT) {
          setUserMovesVisualisation([]);
        }

        // Update chest level
        setCurrentChestLevel(newChestLevel);

        // Reset chest state
        setIsChestOpen(false);
        setMessage(`Level ${newChestLevel} chest ready!`);
      }
    );
  };

  const handleSaveResult = (username: string) => {
    if (username.length > 64) {
      setMessage("Username is too long!");
      return;
    }
    if (username.length === 0) {
      username = "Nameless";
    }

    // Emit save result to server
    socket.emit("save_result", username, (response: { success: boolean }) => {
      if (response.success) {
        setMessage("Result saved successfully!");
      } else {
        setMessage("Failed to save result.");
      }
      setIsSaveResultDialogOpen(false);
    });
  };

  // Try again button handler
  const handleTryAgain = () => {
    // Reset game state
    setDifficulty(null);
    setCurrentChestLevel(0);
    setLockpicks(0);
    setMessage("");
    setIsChestOpen(false);
    setScore(0);
    setOpenedChests(0);
    setHighestOpenedChestLevel(0);
    setUserMovesVisualisation([]);

    // Emit reset game state to server
    socket.emit("reset_game_state", () => {
      console.log("Game state reset on server");
    });
  };

  // Record user moves for visualisation
  const recordUserMoveForVisualisation = (
    move: LockpickMoveEnum,
    success: boolean,
    currentStep: number
  ) => {
    if (difficulty !== DifficultyEnum.ADEPT) {
      return;
    }

    console.log(
      `Recording user move for visualisation: ${move}, success: ${success}, currentStep: ${currentStep}`
    );

    const newMove: UserMove = {
      direction: move,
      success,
    };

    setUserMovesVisualisation((prevMoves) => {
      // Create a copy of the previous moves
      const updatedMoves = [...prevMoves];

      if (success) {
        // Current step isn't equal to move index, there is no time for explain, follow the train CJ
        // Just kidding, after success the currentStep is our move index + 1, so for our first move it will be 1
        // If currentStep after success is 0, that means we finished that chest and server reseted steps for next game
        // If the first move was false, we are still at step 0, if any other move was false, we are back to step 0
        if (currentStep === 1) {
          // First success step, add/replace at position 0
          updatedMoves[0] = newMove;
        } else if (currentStep === 0) {
          // If currentStep is 0 after success, that means we opened chest and reseted steps
          if (updatedMoves[updatedMoves.length - 1]?.success === false) {
            // If the last move was false, we are replacing it with the new one
            updatedMoves[updatedMoves.length - 1] = newMove;
          } else {
            // If the last move was success, we are adding a new one
            updatedMoves[updatedMoves.length] = newMove;
          }
        } else {
          // Add this new successful move
          updatedMoves[currentStep - 1] = newMove;
        }
      } else {
        if (currentStep === 0 && updatedMoves.length === 0) {
          // By this we preventing adding multiple failed moves at the beginning
          updatedMoves[0] = newMove;
        } else if (updatedMoves[updatedMoves.length - 1]?.success === false) {
          // If the last move was false, we are replacing it with the new one
          updatedMoves[updatedMoves.length - 1] = newMove;
        } else {
          // Failed move, add it at the end of the array
          updatedMoves[updatedMoves.length] = newMove;
        }
      }

      console.log(
        `Updated moves for visualisation length ${
          updatedMoves.length
        }, data: ${JSON.stringify(updatedMoves)}`
      );

      // Return the updated moves array
      return updatedMoves;
    });
  };

  // Get leaderboard data from server
  const handleGetLeaderboard = useCallback((limit: number) => {
    socket.emit("get_leaderboard", limit, (data: UserGameStateInterface[]) => {
      console.log("Received leaderboard data:", data);
      setLeaderboard(data);
    });
  }, []);

  // Socket.IO connection setup
  useEffect(() => {
    // Socket connection events
    socket.on("connect", () => {
      console.log("Connected to server");

      // Reset game state
      setDifficulty(null);
      setLockpicks(0);
      setMessage("");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setMessage("Connection error. Please try again later.");
    });

    // Clean up on unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("select_difficulty");
      socket.off("lockpick_move");
      socket.off("next_chest");
      socket.off("save_result");
      socket.off("get_leaderboard");
      socket.disconnect();
      console.log("Disconnected from server");
    };
  }, []);

  const closeSaveResultDialog = () => {
    setIsSaveResultDialogOpen(false);
  };

  // Initialize audio elements
  useEffect(() => {
    successSound.current = new Audio("/sounds/PICKLOCK_SUCCESS.WAV");
    brokenSound.current = new Audio("/sounds/PICKLOCK_BROKEN.WAV");
    failureSound.current = new Audio("/sounds/PICKLOCK_FAILURE.WAV");
    openSound.current = new Audio("/sounds/INV_OPEN.WAV");
  }, []);

  return (
    <GameContext.Provider
      value={{
        handleSelectDifficulty,
        handleMove,
        handleSaveResult,
        handleNextChest,
        closeSaveResultDialog,
        handleGetLeaderboard,
        handleTryAgain,
        lockpicks,
        difficulty,
        message,
        currentChestLevel,
        isChestOpen,
        score,
        openedChests,
        highestOpenedChestLevel,
        isSaveResultDialogOpen,
        leaderboard,
        userMovesVisualisation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
