import { AuthErrorCode } from "@/data/authErrors";

export const authErrorMap: Record<string, string> = {
  // Login
  [AuthErrorCode.INVALID_CREDENTIALS]: "邮箱或密码错误",

  // Sign up
  [AuthErrorCode.USERNAME_ALREADY_EXISTS]: "用户名已被占用",
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: "邮箱已被注册",
  [AuthErrorCode.SIGNUP_FAILED]: "注册失败，请稍后再试",
  [AuthErrorCode.SIGNUP_INVALID]: "邮箱格式错误 或 密码太短",

  // Common
  [AuthErrorCode.UNKNOWN_ERROR]: "发生未知错误",
};
