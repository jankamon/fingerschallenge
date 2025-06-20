import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import socket from "@/services/socket";
import { playSound, playDelayedSound } from "@/utilities/playSound";
import UserGameStateInterface from "@shared/interfaces/userGameState.interface";
import UserMove from "@shared/interfaces/userMoves.interface";
import { Filter } from "bad-words";
import GameStatsInterface from "@shared/interfaces/gameStats.interface";

const filter = new Filter();

interface GameContextType {
  handleSelectDifficulty: (difficulty: DifficultyEnum) => void;
  handleMove: (move: LockpickMoveEnum) => void;
  handleNextChest: () => void;
  handleSaveResult: (username: string) => void;
  closeSaveResultDialog: () => void;
  handleGetLeaderboard: (
    difficulty: DifficultyEnum,
    page?: number,
    pageSize?: number
  ) => void;
  handleTryAgain: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleGetGameStats: () => void;
  handleChangeRankingDifficulty: (difficulty: DifficultyEnum) => void;
  difficulty: DifficultyEnum | null;
  lockpicks: number;
  message: MessageType;
  currentChestLevel: number;
  isChestOpen: boolean;
  score: number;
  openedChests: number;
  highestOpenedChestLevel: number;
  isSaveResultDialogOpen: boolean;
  leaderboard: UserGameStateInterface[];
  leaderboardPage: number;
  leaderboardPageSize: number;
  leaderboardTotal: number;
  userMovesVisualisation: UserMove[];
  gameStats: GameStatsInterface | null;
  rankingDifficulty: DifficultyEnum;
}

type MessageType = {
  id: number;
  text: string;
};

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [difficulty, setDifficulty] = useState<DifficultyEnum | null>(null);
  const [lockpicks, setLockpicks] = useState<number>(0);
  const [currentChestLevel, setCurrentChestLevel] = useState<number>(0);
  const [message, setMessage] = useState<MessageType>({ id: 0, text: "" });
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [openedChests, setOpenedChests] = useState<number>(0);
  const [highestOpenedChestLevel, setHighestOpenedChestLevel] =
    useState<number>(0);
  const [isSaveResultDialogOpen, setIsSaveResultDialogOpen] =
    useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<UserGameStateInterface[]>([]);
  const [leaderboardPage, setLeaderboardPage] = useState<number>(1);
  const [leaderboardPageSize, setLeaderboardPageSize] = useState<number>(10);
  const [leaderboardTotal, setLeaderboardTotal] = useState<number>(0);
  const [userMovesVisualisation, setUserMovesVisualisation] = useState<
    UserMove[]
  >([]);
  const [gameStats, setGameStats] = useState<GameStatsInterface | null>(null);
  const [rankingDifficulty, setRankingDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.JOURNEYMAN
  );

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
      setMessage((prevMessage) => ({
        id: prevMessage.id + 1,
        text: "You have no lockpicks left!",
      }));
      return;
    }

    if (isChestOpen) {
      setMessage((prevMessage) => ({
        id: prevMessage.id + 1,
        text: "The chest is already open!",
      }));
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
        setMessage((prevMessage) => ({
          id: prevMessage.id + 1,
          text: result.message,
        }));

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

            // Get next chest after 1s
            setTimeout(() => {
              handleNextChest();
            }, 1000);
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
        setMessage((prevMessage) => ({
          id: prevMessage.id + 1,
          text: `Level ${newChestLevel} chest ready!`,
        }));
      }
    );
  };

  const handleSaveResult = (username: string) => {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length > 64) {
      setMessage({ id: 0, text: "Username is too long!" });
      return;
    }

    if (trimmedUsername.length === 0) {
      username = "Nameless";
    }

    // Filter out bad words
    const cleanUsername = filter.clean(trimmedUsername);

    // Emit save result to server
    socket.emit(
      "save_result",
      cleanUsername,
      (response: { success: boolean }) => {
        if (response.success) {
          setMessage({ id: 0, text: "Result saved successfully!" });
        } else {
          setMessage({ id: 0, text: "Failed to save result." });
        }
        setIsSaveResultDialogOpen(false);
      }
    );
  };

  // Try again button handler
  const handleTryAgain = () => {
    // Reset game state
    setDifficulty(null);
    setCurrentChestLevel(0);
    setLockpicks(0);
    setMessage({ id: 0, text: "" });
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

    const newMove: UserMove = {
      direction: move,
      success,
    };

    setUserMovesVisualisation((prevMoves) => {
      const updatedMoves = [...prevMoves];
      const lastIndex = updatedMoves.length - 1;
      const lastMove = lastIndex >= 0 ? updatedMoves[lastIndex] : null;
      const lastMoveWasFailure = lastMove?.success === false;

      if (success) {
        // Current step isn't equal to move index, there is no time for explain, follow the train CJ
        // Just kidding, after success the currentStep is our move index + 1, so for our first success move it will be 1
        // If currentStep after success is 0, that means we finished that chest and server reseted steps for next game
        // If the first move was false, we are still at step 0, if any other move was false, we are back to step 0
        if (currentStep === 1) {
          // First success step, add/replace at position 0
          updatedMoves[0] = newMove;
        } else if (currentStep === 0) {
          // If currentStep is 0 after success, that means we opened chest and reseted steps
          if (lastMoveWasFailure) {
            // If the last move was false, we are replacing it with the new one
            updatedMoves[lastIndex] = newMove;
          } else {
            // If the last move was success, we are adding a new one
            updatedMoves.push(newMove);
          }
        } else {
          // Add this new successful move
          updatedMoves[currentStep - 1] = newMove;
        }
      } else if (updatedMoves.length === 0 || !lastMoveWasFailure) {
        // Add a new failed move on very first move or only after a success
        updatedMoves.push(newMove);
      }

      // Return the updated moves array
      return updatedMoves;
    });
  };

  // Get leaderboard data from server
  const handleGetLeaderboard = useCallback(
    (
      difficulty: DifficultyEnum = DifficultyEnum.JOURNEYMAN,
      page: number = 1,
      pageSize: number = 10
    ) => {
      setRankingDifficulty(difficulty);

      socket.emit(
        "get_leaderboard",
        difficulty,
        page,
        pageSize,
        (data: {
          results: UserGameStateInterface[];
          total: number;
          page: number;
          pageSize: number;
        }) => {
          console.log("Received leaderboard data:", data);
          setLeaderboard(data.results);
          setLeaderboardTotal(data.total);
          setLeaderboardPage(data.page);
          setLeaderboardPageSize(data.pageSize);
        }
      );
    },
    []
  );

  const handleNextPage = useCallback(() => {
    const totalPages = Math.ceil(leaderboardTotal / leaderboardPageSize);
    if (leaderboardPage < totalPages) {
      handleGetLeaderboard(
        rankingDifficulty,
        leaderboardPage + 1,
        leaderboardPageSize
      );
    }
  }, [
    leaderboardPage,
    leaderboardPageSize,
    leaderboardTotal,
    rankingDifficulty,
    handleGetLeaderboard,
  ]);

  const handlePrevPage = useCallback(() => {
    if (leaderboardPage > 1) {
      handleGetLeaderboard(
        rankingDifficulty,
        leaderboardPage - 1,
        leaderboardPageSize
      );
    }
  }, [
    leaderboardPage,
    leaderboardPageSize,
    rankingDifficulty,
    handleGetLeaderboard,
  ]);

  const handleChangeRankingDifficulty = useCallback(
    (difficulty: DifficultyEnum) => {
      setRankingDifficulty(difficulty);
      // Reset leaderboard state
      setLeaderboard([]);
      setLeaderboardPage(1);
      setLeaderboardPageSize(10);
      setLeaderboardTotal(0);
      // Fetch leaderboard for the new difficulty
      handleGetLeaderboard(difficulty, 1, 10);
    },
    [handleGetLeaderboard]
  );

  // Handle get game stats
  const handleGetGameStats = useCallback(() => {
    socket.emit("get_game_stats", (stats: GameStatsInterface) => {
      setGameStats(stats);
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
      setMessage({ id: 0, text: "" });
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setMessage((prevMessage) => ({
        id: prevMessage.id + 1,
        text: "Connection error. Please try again later.",
      }));
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
    successSound.current = new Audio("/assets/audio/PICKLOCK_SUCCESS.WAV");
    brokenSound.current = new Audio("/assets/audio/PICKLOCK_BROKEN.WAV");
    failureSound.current = new Audio("/assets/audio/PICKLOCK_FAILURE.WAV");
    openSound.current = new Audio("/assets/audio/INV_OPEN.WAV");
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
        handleNextPage,
        handlePrevPage,
        handleGetGameStats,
        handleChangeRankingDifficulty,
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
        leaderboardPage,
        leaderboardPageSize,
        leaderboardTotal,
        gameStats,
        rankingDifficulty,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
