
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const CustomModal = (props) => {
  const {
    toggle,
    modal
  } = props;

  return (
      <Modal isOpen={modal} toggle={toggle} style={{zIndex: 100}}>
        <ModalHeader toggle={toggle}>Welcome to Daisy Care Support page!</ModalHeader>
        <ModalBody>
            <h3>Currently, We work from 8:00 a.m to 9:00 p.m.</h3>
            <h5>Channel 1: Ask about common problems.</h5>
            <h5>Channel 2: Support you booking schedule/ change schedule.</h5>
            <h5>Channel 3: Ask/Complain about our service.</h5>
            <h6>Have a good day!</h6>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>I got it</Button>
        </ModalFooter>
      </Modal>
  );
}

export default CustomModal;