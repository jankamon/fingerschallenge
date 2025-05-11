import { createContext, useEffect, useRef, useState } from "react";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import socket from "@/services/socket";
import playSound from "@/utilities/playSound";

interface GameContextType {
  selectDifficulty: (difficulty: DifficultyEnum) => void;
  handleMove: (move: LockpickMoveEnum) => void;
  difficulty: DifficultyEnum | null;
  lockpicks: number;
  message: string;
  step: number;
  currentChestLevel: number;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [difficulty, setDifficulty] = useState<DifficultyEnum | null>(null);
  const [lockpicks, setLockpicks] = useState<number>(10);
  const [currentChestLevel, setCurrentChestLevel] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);

  // Audio elements
  const successSound = useRef<HTMLAudioElement | null>(null);
  const brokenSound = useRef<HTMLAudioElement | null>(null);
  const failureSound = useRef<HTMLAudioElement | null>(null);
  const openSound = useRef<HTMLAudioElement | null>(null);

  const selectDifficulty = (selectedDifficulty: DifficultyEnum) => {
    // Emit to server
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

    // Emit to server
    socket.emit("lockpick_move", move);
  };

  // Socket.IO connection setup
  useEffect(() => {
    // Socket connection events
    socket.on("connect", () => {
      console.log("Connected to server");

      // Reset game state
      setDifficulty(null);
      setStep(0);
      setLockpicks(0);
      setMessage("");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setMessage("Connection error. Please try again later.");
    });

    socket.on(
      "move_result",
      (result: {
        success: boolean;
        message: string;
        lockpicksRemaining: number;
        isChestOpen?: boolean;
        step?: number;
      }) => {
        // Update state based on server response
        setLockpicks(result.lockpicksRemaining);
        setMessage(result.message);

        if (result.step !== undefined) {
          setStep(result.step);
        }

        if (result.success) {
          playSound(successSound.current);

          if (result.isChestOpen) {
            // Chest is open!
            const timer = setTimeout(() => {
              playSound(openSound.current);
            }, 300);

            // Cleanup the timer
            return () => {
              clearTimeout(timer);
            };
          }
        } else {
          // Failed move
          if (Math.random() < 0.5) {
            playSound(brokenSound.current);
          } else {
            playSound(failureSound.current);
          }
        }
      }
    );

    // Clean up on unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("select_difficulty");
      socket.off("lockpick_move");
      socket.off("move_result");
      socket.disconnect();
      console.log("Disconnected from server");
    };
  }, []);

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
        difficulty,
        selectDifficulty,
        lockpicks,
        handleMove,
        message,
        step,
        currentChestLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
