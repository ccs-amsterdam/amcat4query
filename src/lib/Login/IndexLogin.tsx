import { AxiosError } from "axios";
import { useState } from "react";
import { Message } from "semantic-ui-react";
import { AmcatIndex, AmcatUser, LoginForm } from "..";
import { describeError, getIndex } from "../apis/Amcat";

interface IndexLoginProps {
  /** Which host to log on to */
  host: string;
  /** Which index to use */
  index: string;
  /** Callback after succesful login */
  onLogin: (index: AmcatIndex) => void;
}

/** Show form to log in to a specific index on a specific host */
export default function IndexLogin({ host, index, onLogin }: IndexLoginProps) {
  const [error, setError] = useState<string>();
  const handleLogin = (user: AmcatUser) => {
    getIndex(user, index)
      .then(() => onLogin({ ...user, index }))
      .catch((e: AxiosError) => {
        if (e.response && e.response.status == 404)
          console.error(`Index ${index} does not exist on ${host}`);
        setError(describeError(e));
      });
  };
  return (
    <>
      <LoginForm fix_host={host} onLogin={handleLogin} />
      {error == null ? null : <Message error header={error} />}
    </>
  );
}
