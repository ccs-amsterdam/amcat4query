import React, { useState } from "react";
import { Container, Menu, Segment } from "semantic-ui-react";

// Main pages. Use below in items to include in header menu
import AmcatAggregate from "lib/AmcatAggregate/AmcatAggregate";
import AmcatArticles from "lib/AmcatArticles/AmcatArticles";

const previewComponents = [
  { name: "AmcatAggregate", component: AmcatAggregate },
  { name: "AmcatArticles", component: AmcatArticles },
];

const App = () => {
  const [component, setComponent] = useState(null);

  return (
    <Container>
      <ComponentMenu setComponent={setComponent} />
      <Segment attached="bottom">{component}</Segment>
    </Container>
  );
};

const ComponentMenu = ({ setComponent }) => {
  const [active, setActive] = useState(null);

  const onSelect = (component) => {
    setActive(component.name);
    setComponent(component.component);
  };

  return (
    <Menu attached="top" tabular>
      {previewComponents.map((component) => {
        console.log(component);
        return (
          <Menu.Item
            name={component.name}
            active={active === component.name}
            onClick={() => onSelect(component)}
          />
        );
      })}
    </Menu>
  );
};

export default App;
