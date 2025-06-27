export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { userId: string; isEmailMode: boolean; scheme?: string };
  Dashboard: undefined;
  Preferences: undefined;
  MainApp: undefined;
  VerifyPhone: { userId: string; phoneNumber: string };
  Profile: undefined;
  Favorites: undefined;
  Settings: undefined;
  Cars: undefined;
  Transfers: undefined;
};