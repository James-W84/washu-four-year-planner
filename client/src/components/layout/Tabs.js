import { Tab } from "@headlessui/react";

function Tabs() {
  return (
    <Tab.Group>
      <Tab.List>
        <Tab className="waves-effect waves-light btn">Tab 1</Tab>
        <Tab className="waves-effect waves-light btn">Tab 2</Tab>
        <Tab className="waves-effect waves-light btn">Tab 3</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
export default Tabs;
