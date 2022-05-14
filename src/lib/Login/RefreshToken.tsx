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
        console.log(d.data);
        alert(`${value.token} -> ${d.data.access_token}`);
        onRefresh({ ...value, token: d.data.access_token });
      })
      .catch((e) => {
        console.error(e);
        onRefresh(undefined);
      });
  };
  return <Button onClick={handleClick}>Refresh Token</Button>;
}
