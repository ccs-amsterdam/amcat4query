import { Button } from "semantic-ui-react";
import { Amcat, AmcatUser } from "..";

interface RefreshTokenProps {
  value: AmcatUser;
  onRefresh: (user: AmcatUser) => void;
}
export default function RefreshToken({ value, onRefresh }: RefreshTokenProps) {
  if (value == null) return null;
  const handleClick = () => {
    Amcat.refreshToken(value)
      .then((d) => {
        alert(`${value.token} -> ${d.data.token}`);
        onRefresh({ ...value, token: d.data.token });
      })
      .catch((e) => {
        console.error(e);
        onRefresh(undefined);
      });
  };
  return <Button onClick={handleClick}>Refresh Token</Button>;
}
