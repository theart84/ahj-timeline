import Modal from '../Modal';

const container = document.createElement('div');
const modal = new Modal(container);

test('Method validateValue must validate data correctly', () => {
  expect(modal.validateInput('51.50851, -0.12572')).toBeTruthy();
  expect(modal.validateInput('51.50851,-0.12572')).toBeTruthy();
  expect(modal.validateInput('[51.50851,-0.12572]')).toBeTruthy();
  expect(modal.validateInput('[test,test]')).not.toBeTruthy();
});
