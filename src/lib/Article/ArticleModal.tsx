import { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import Article, { ArticleProps } from "./Article";
import "./articleStyle.css";

/**
 * Show a single article
 */
export default function ArticleModal({ index, id, query, changeArticle, link }: ArticleProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [id]);
  if (!index || !id) return null;

  return (
    <Modal open={open} onClose={() => setOpen(false)} style={{ width: "80vw", maxWidth: "1200px" }}>
      <Modal.Header></Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description style={{ height: "100%" }}>
          <Article id={id} index={index} query={query} changeArticle={changeArticle} link={link} />
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions></Modal.Actions>
    </Modal>
  );
}
