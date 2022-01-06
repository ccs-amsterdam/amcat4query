import React, { useState } from "react";
import { Header, Button, Modal, Form, Dropdown, Loader, Dimmer, Icon } from "semantic-ui-react";

// default roles
const guestRoles = [
  { key: 0, value: "NONE", text: "No access" },
  { key: 10, value: "METAREADER", text: "Meta-reader" },
  { key: 20, value: "READER", text: "Reader" },
  { key: 30, value: "WRITER", text: "Writer" },
  { key: 40, value: "ADMIN", text: "Admin" },
];

/**
 *
 * @param {*}        amcat    An Amcat connection, optained with the amcat4auth module
 * @param {*}        button   Optionally, JSX for a custom button (or anything clickable) that opens the modal
 * @param {function} onCreate Function called when new index is created. Argument is the name of the new index
 * @returns
 */
export default function AmcatIndexCreate({ amcat, button, onCreate }) {
  const [modalStatus, setModalStatus] = useState("inactive");
  const [newIndexName, setNewIndexName] = useState("");
  const [guestRole, setGuestRole] = useState("None");
  const [nameError, setNameError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await amcat.getIndex(newIndexName);
      setNameError("This index name already exists");
    } catch (e) {
      console.log("name doensnt yet exist, which is cool");
      console.log(e);
    }

    setModalStatus("pending");

    amcat
      .createIndex(newIndexName, guestRole)
      .then((res) => {
        // maybe check for 201 before celebrating
        setModalStatus("inactive");
        onCreate(newIndexName);
      })
      .catch((e) => {
        console.log(e.message);
        console.log(e);
        setModalStatus("error");
      });
  };

  const validateName = (name) => {
    if (name.match(/[ "*|<>/?,A-Z]/)) {
      const invalid = name.match(/[ "*|<>/?]/gi);
      let uniqueInvalid = [...new Set(invalid)].map((c) => (c === " " ? "space" : c));
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
      trigger={
        button || (
          <Button primary>
            <Icon name="plus" />
            Create new index
          </Button>
        )
      }
      onSubmit={(e) => onSubmit(e)}
      open={modalStatus !== "inactive"}
      onClose={() => setModalStatus("inactive")}
      onOpen={() => {
        setNewIndexName("");
        setGuestRole("NONE");
        setModalStatus("awaiting input");
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
              setModalStatus("awaiting input");
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
        {modalStatus === "error" ? (
          <div>Could not create index for a reason not yet covered in the error handling...</div>
        ) : null}
        {modalStatus === "pending" ? (
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
