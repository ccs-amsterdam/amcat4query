import { useMemo } from "react";
import { Button } from "semantic-ui-react";
import { useCookies } from "react-cookie";
import { AmcatUser } from "../interfaces";
import LoginForm from "./LoginForm";

interface LoginProps {
  /** Current logged in user (if any) */
  value: AmcatUser;
  /** Callback that will be called on login (with a user)/logout (with undefined) */
  onLogin: (amcat: AmcatUser) => void;
  fix_host?: string;
}

/**
 * An AmCAT login form.
 */
export default function Login({ value, onLogin, fix_host }: LoginProps) {
  const [cookies, setCookies] = useCookies(["amcat"]);

  const amcat = useMemo(
    () =>
      cookies.amcat || {
        host: "http://127.0.0.1:5000",
        email: "admin",
        token: null,
      },
    [cookies.amcat]
  );

  const handleLogout = (old_value: AmcatUser) => {
    // remove cookie for current
    if (old_value != null)
      setCookies("amcat", JSON.stringify({ ...old_value, token: null }), { path: "/" });
    onLogin(undefined);
  };

  const handleLogin = (u: AmcatUser) => {
    setCookies("amcat", JSON.stringify(u), { path: "/" });

    onLogin(u);
  };

  // if logged in, show log out
  if (value) return <SignOut value={value} onLogout={handleLogout} />;
  return <LoginForm value={amcat} onLogin={handleLogin} fix_host={fix_host} />;
}

interface SignOutProps {
  value: AmcatUser;
  onLogout: (user: AmcatUser) => void;
}
const SignOut = ({ value, onLogout }: SignOutProps) => {
  return (
    <Button fluid secondary onClick={() => onLogout(value)}>
      Sign out from <span style={{ color: "lightblue" }}>{value.email}</span>
    </Button>
  );
};
