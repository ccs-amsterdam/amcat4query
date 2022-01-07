import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "semantic-ui-react";

import AmcatIndexCreate from "./AmcatIndexCreate";
import AmcatIndexDelete from "./AmcatIndexDelete";

export default function AmcatIndex({ amcat, index, setIndex, canCreate, canDelete }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!amcat) {
      setIndex(null);
      setOptions([]);
    } else prepareOptions(amcat, setOptions);
  }, [amcat, setIndex]);

  if (!amcat) return null;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1 1 auto" }}>
        <Dropdown
          placeholder="select index"
          fluid
          search
          selection
          value={index}
          options={options}
          onChange={(e, d) => setIndex(d.value)}
        />
      </div>

      <div style={{ flex: "0 1 auto" }}>
        <Button.Group style={{ marginLeft: canDelete || canCreate ? "5px" : "0" }}>
          <AmcatIndexCreateButton
            amcat={amcat}
            canCreate={canCreate}
            setIndex={setIndex}
            setOptions={setOptions}
          />
          <AmcatIndexDeleteButton
            amcat={amcat}
            index={index}
            canDelete={canDelete}
            setIndex={setIndex}
            setOptions={setOptions}
          />
        </Button.Group>
      </div>
    </div>
  );
}

const buttonStyle = { paddingLeft: "5px", paddingRight: "5px" };

const AmcatIndexCreateButton = ({ amcat, canCreate, setIndex, setOptions }) => {
  if (!canCreate) return null;

  const onCreate = (name) => {
    // when a new index is created, select it, and re-create options
    // (we could also directly change the options instead of calling API, but this seems safer)
    setIndex(name);
    prepareOptions(amcat, setOptions);
  };

  const CreateButton = <Button icon="plus" style={buttonStyle} />;
  return <AmcatIndexCreate amcat={amcat} button={CreateButton} onCreate={onCreate} />;
};

const AmcatIndexDeleteButton = ({ amcat, index, canDelete, setIndex, setOptions }) => {
  if (!canDelete) return null;

  const onDelete = (name) => {
    // when a new index is delete, unselect it, and re-create options
    setIndex(null);
    prepareOptions(amcat, setOptions);
  };

  const DeleteButton = <Button disabled={!index} icon="minus" style={buttonStyle} />;
  return <AmcatIndexDelete amcat={amcat} index={index} button={DeleteButton} onDelete={onDelete} />;
};

const prepareOptions = async (amcat, setOptions) => {
  try {
    const res = await amcat.getIndices();
    const options = res.data.map((index) => {
      console.log(index);
      return { key: index.name, value: index.name, text: index.name, description: index.role };
    });
    setOptions(options);
  } catch (e) {
    console.log(e);
    setOptions([]);
  }
};
