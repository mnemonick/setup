export default function (props) {
  return (
    <Modal onClose={props.onClose}>
      <contact-modal style={{width: layout.desktop ? 400 : '100%'}}>
        test
      </contact-modal>
    </Modal>
  );
}