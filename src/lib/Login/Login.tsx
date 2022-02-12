import { useEffect, useState, useMemo } from "react";
import { Form, Button, Segment, Message } from "semantic-ui-react";
import { useCookies } from "react-cookie";
import { getToken } from "../apis/Amcat";
import { AmcatUser } from "../interfaces";

interface LoginProps {
  /** Current logged in user (if any) */
  value: AmcatUser;
  /** Callback that will be called on login (with a user)/logout (with undefined) */
  onLogin: (amcat: AmcatUser) => void;
}

/**
 * An AmCAT login form.
 */
export default function Login({ value, onLogin }: LoginProps) {
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
  return <SignIn value={amcat} onLogin={handleLogin} />;
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

interface SignInProps {
  value: AmcatUser;
  onLogin: (user: AmcatUser) => void;
}
const SignIn = ({ value, onLogin }: SignInProps) => {
  const [host, setHost] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (value?.email) setEmail(value.email);
    if (value?.host) setHost(value.host);
  }, [value]);

  const tryPasswordLogin = async () => {
    setPassword("");
    let token;
    try {
      token = await getToken(host, email, password);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401)
          setError({ field: "password", message: "Invalid email or password" });
        else setError({ field: undefined, message: "Invalid reply from server" });
      } else if (e.request) {
        setError({ field: "host", message: "Could not find server" });
      } else setError({ field: undefined, message: "Error on logging in" });
    }
    if (token !== undefined) {
      onLogin({ host, email, token });
      setError(null);
    }
  };

  let emailError = !email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (email === "admin") emailError = false;

  return (
    <Form size="large" error={error && error.field === undefined}>
      <Segment stacked>
        <Message error header={error?.message} />
        <Form.Input
          fluid
          placeholder="Host"
          name="host"
          label="Host"
          value={host}
          onChange={(e, d) => {
            if (d.value.length < 100) setHost(d.value);
          }}
          error={error?.field === "host" ? error.message : false}
          icon="home"
          iconPosition="left"
          autoFocus
        />

        <Form.Input
          fluid
          placeholder="email adress"
          error={emailError ? "Please enter a valid email adress" : false}
          name="email"
          label="Email"
          icon="mail"
          iconPosition="left"
          value={email}
          onChange={(e, d) => {
            if (d.value.length < 100) setEmail(d.value);
          }}
        />

        <Form.Input
          fluid
          placeholder="password"
          name="password"
          error={error?.field === "password" ? error.message : false}
          label="Password"
          type="password"
          icon="lock"
          iconPosition="left"
          value={password}
          onChange={(e, d) => {
            setPassword(d.value);
          }}
        />

        <Button
          disabled={password.length === 0}
          primary
          onClick={tryPasswordLogin}
          fluid
          size="large"
        >
          Sign in
        </Button>
      </Segment>
      <Message>Don't have an account? pweh!</Message>
    </Form>
  );
};
