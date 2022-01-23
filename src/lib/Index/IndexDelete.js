import React, { useState } from "react";
import { Button, Header, Icon, Modal, Dimmer, Loader } from "semantic-ui-react";

export default function IndexDelete({ amcat, index, button, onDelete }) {
  const [status, setStatus] = useState("inactive");

  const onSubmit = (event) => {
    setStatus("pending");
    amcat
      .deleteIndex(index)
      .then((res) => {
        // maybe check for 201 before celebrating
        setStatus("inactive");
        onDelete(index);
      })
      .catch((e) => {
        console.log(e);
        setStatus("error");
      });
  };

  return (
    <Modal
      closeIcon
      open={status !== "inactive"}
      trigger={
        button || (
          <Button disabled={!index} name="delete index">
            <Icon name="minus" /> Delete Index
          </Button>
        )
      }
      onClose={() => {
        setStatus("inactive");
      }}
      onOpen={() => {
        setStatus("awaiting input");
      }}
    >
      <Header icon="trash" content={`Delete Index ${index}`} />
      <Modal.Content>
        <p>Do you really want to delete this Index?</p>
      </Modal.Content>
      <Modal.Actions>
        {status === "error" ? (
          <div>Could not delete index for a reason not yet covered in the error handling...</div>
        ) : null}
        {status === "pending" ? (
          <Dimmer active inverted>
            <Loader content="Creating Index" />
          </Dimmer>
        ) : (
          <>
            <Button color="red" onClick={() => setStatus("inactive")}>
              <Icon name="remove" /> No
            </Button>
            <Button color="green" onClick={onSubmit}>
              <Icon name="checkmark" /> Yes
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}
