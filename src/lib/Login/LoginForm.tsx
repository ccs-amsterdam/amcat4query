import { useEffect, useState } from "react";
import { Form, Button, Segment, Message } from "semantic-ui-react";
import { AmcatUser } from "../interfaces";
import { getToken } from "../apis/Amcat";

interface LoginFormProps {
  /** Current logged in user (if any) */
  value?: AmcatUser;
  /** If given, don't display the host field, but instead fix the host field to this value */
  fix_host?: string;
  /** Callback that will be called on succesful login  */
  onLogin: (user: AmcatUser) => void;
}
/** Form with login options that handles obtaining a token from an AmCAT backend */
export default function LoginForm({ value, onLogin, fix_host }: LoginFormProps) {
  const [host, setHost] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (value?.email) setEmail(value.email);
    if (fix_host) setHost(fix_host);
    else if (value?.host) setHost(value.host);
  }, [value, fix_host]);

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
        {fix_host != null ? null : (
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
        )}

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
    </Form>
  );
}
