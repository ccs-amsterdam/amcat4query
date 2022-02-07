import { SyntheticEvent, useState } from "react";
import { Header, Button, Modal, Form, Dropdown, Loader, Dimmer, Icon } from "semantic-ui-react";
import Amcat from "../apis/Amcat";

// default roles
const guestRoles = [
  { key: 0, value: "NONE", text: "No access" },
  { key: 10, value: "METAREADER", text: "Meta-reader" },
  { key: 20, value: "READER", text: "Reader" },
  { key: 30, value: "WRITER", text: "Writer" },
  { key: 40, value: "ADMIN", text: "Admin" },
];

interface IndexCreateProps {
  amcat: Amcat;
  open: boolean;
  onClose: (name?: string) => void;
}

/**
 *
 * @param {*}        amcat    An Amcat connection, optained with the amcat4auth module
 * @param {*}        button   Optionally, JSX for a custom button (or anything clickable) that opens the modal
 * @param {function} onCreate Function called when new index is created. Argument is the name of the new index
 * @returns
 */
export default function IndexCreate({ open, amcat, onClose }: IndexCreateProps) {
  const [newIndexName, setNewIndexName] = useState("");
  const [guestRole, setGuestRole] = useState("NONE");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await amcat.getIndex(newIndexName);
      setNameError("This index name already exists");
    } catch (e) {
      if (e.response?.status !== 404) {
        setError(`Error checking index name: ${e}`);
        setBusy(false);
        return;
      }
    }

    amcat
      .createIndex(newIndexName, guestRole)
      .then((res) => {
        // maybe check for 201 before celebrating
        onClose(newIndexName);
      })
      .catch((e) => {
        console.log(e.message);
        console.log(e);
        setError("Oops! Error!");
      });
    setBusy(false);
  };

  const validateName = (name: string) => {
    if (name.match(/[ "*|<>/?,A-Z]/)) {
      const invalid = name.match(/[ "*|<>/?]/gi);
      let uniqueInvalid = Array.from(new Set(invalid).values()).map((c) =>
        c === " " ? "space" : c
      );
      if (name.match(/[A-Z]/)) uniqueInvalid.push("UPPERCASE");
      setNameError(`Illegal symbols: ${uniqueInvalid.join(" ")}`);
    } else {
      setNameError(null);
    }
  };

  //if (!this.props.amcatIndices) return null;
  return (
    <Modal
      as={Form}
      onSubmit={onSubmit}
      open={open}
      onClose={() => onClose(undefined)}
      onOpen={() => {
        setNewIndexName("");
        setGuestRole("NONE");
      }}
      size="tiny"
    >
      <Header icon="pencil" content="Create new index" as="h2" />
      <Modal.Content>
        <Form.Group>
          <Form.Input
            width={12}
            label="Name"
            required
            type="text"
            error={nameError ? nameError : null}
            value={newIndexName}
            onChange={(e, d) => {
              validateName(d.value);
              setNewIndexName(d.value.trim());
            }}
            placeholder="Enter name"
          />
          <div>
            <b>Guest role</b>
            <br />
            <Form.Input
              width={4}
              label="Name"
              as={Dropdown}
              selection
              value={guestRole}
              onChange={(e, d) => setGuestRole(d.value)}
              options={guestRoles}
            />
          </div>
        </Form.Group>
      </Modal.Content>
      <Modal.Actions>
        {error ? (
          <div>Could not create index for a reason not yet covered in the error handling...</div>
        ) : null}
        {busy ? (
          <Dimmer active inverted>
            <Loader content="Creating Index" />
          </Dimmer>
        ) : (
          <Button type="submit" color="green" icon="save" content="Create" />
        )}
      </Modal.Actions>
    </Modal>
  );
}
