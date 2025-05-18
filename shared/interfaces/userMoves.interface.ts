import { LockpickMoveEnum } from "../enums/lockpickMove.enum";

export default interface UserMove {
  direction: LockpickMoveEnum;
  success: boolean;
}
