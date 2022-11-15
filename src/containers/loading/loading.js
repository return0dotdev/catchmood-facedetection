import React from "react";
import ReactLoading from "react-loading";
import { Section, Article, list } from "./generic";
import { Modal } from 'react-bootstrap';
const Loading = (props) => (

  <Modal className="showloading"
    size="xl"
    style={{ width: '100%', height: '100%', padding: "0px !important" }}
    show={props.showloading}
  >
    <Section>
      {list.map(l => (
        <Article key={l.prop} >
          <ReactLoading type={l.prop} color="#000" height='200px' width='200px' />
        </Article>
      ))}
    </Section>
  </Modal>
);

export default Loading;