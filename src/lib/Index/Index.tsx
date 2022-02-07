import { useState, useEffect } from "react";
import { Dropdown, Button, DropdownProps, DropdownItemProps } from "semantic-ui-react";
import Amcat from "../apis/Amcat";

import IndexCreate from "./IndexCreate";
import IndexDelete from "./IndexDelete";

interface IndexProps {
  amcat: Amcat;
  index: string;
  setIndex: (index: string) => void;
  canCreate: boolean;
  canDelete: boolean;
}

export default function Index({ amcat, index, setIndex, canCreate, canDelete }: IndexProps) {
  const [options, setOptions] = useState<DropdownItemProps[]>([]);

  useEffect(() => {
    if (!amcat) {
      //setIndex(null);
      setOptions([]);
    } else prepareOptions(amcat, index, setOptions);
  }, [amcat, index, setIndex]);

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
          onChange={(e, d) => setIndex(d.value as string)}
        />
      </div>

      <div style={{ flex: "0 1 auto" }}>
        <Button.Group style={{ marginLeft: canDelete || canCreate ? "5px" : "0" }}>
          {!canCreate ? null : (
            <IndexCreateButton amcat={amcat} setIndex={setIndex} setOptions={setOptions} />
          )}
          {!canDelete ? null : (
            <IndexDeleteButton
              amcat={amcat}
              index={index}
              setIndex={setIndex}
              setOptions={setOptions}
            />
          )}
        </Button.Group>
      </div>
    </div>
  );
}

const buttonStyle = { paddingLeft: "5px", paddingRight: "5px" };

interface CreateButtonProps {
  amcat: Amcat;
  setIndex: (name: string) => void;
  setOptions: (options: DropdownItemProps[]) => void;
}

const IndexCreateButton = ({ amcat, setIndex, setOptions }: CreateButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = (name: string) => {
    setOpen(false);
    if (name) {
      setIndex(name);
      prepareOptions(amcat, name, setOptions);
    }
  };
  return (
    <>
      <Button icon="plus" style={buttonStyle} onClick={() => setOpen(true)} />
      <IndexCreate amcat={amcat} onClose={handleClose} open={open} />
    </>
  );
};

interface DeleteButtonProps extends CreateButtonProps {
  index: string;
}
const IndexDeleteButton = ({ amcat, index, setIndex, setOptions }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  const onDelete = (deleted: boolean) => {
    setOpen(false);
    // when a new index is delete, unselect it, and re-create options
    if (deleted) {
      setIndex(null);
      prepareOptions(amcat, undefined, setOptions);
    }
  };
  return (
    <>
      <Button disabled={!index} icon="minus" style={buttonStyle} onClick={() => setOpen(true)} />;
      <IndexDelete amcat={amcat} index={index} open={open} onClose={onDelete} />;
    </>
  );
};

async function prepareOptions(
  amcat: Amcat,
  index: string,
  setOptions: (options: DropdownItemProps[]) => void
) {
  try {
    const res = await amcat.getIndices();
    const options = res.data.map((ix: { name: string; role: string }) => {
      return {
        key: ix.name,
        value: ix.name,
        text: ix.name,
        description: ix.role,
        selected: ix.name === index,
      };
    });
    setOptions(options);
  } catch (e) {
    console.log(e);
    setOptions([]);
  }
}
