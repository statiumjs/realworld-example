import React, { useEffect, useRef } from 'react';

// main.css from demo.productionready.io is based on very old
// 4.0.0-alpha2 version of Bootstrap. This stylesheet adds
// missing styles to make modals work as expected(ish).
import './Modal.css';

const showModal = modalEl => {
  document.body.classList.add('modal-open');

  const backdropEl = document.createElement('div');
  backdropEl.className = 'modal-backdrop fade show';
  document.body.appendChild(backdropEl);

  modalEl.classList.add('show');
  modalEl.style.display = 'block';
};

const hideModal = modalEl => {
  document.body.classList.remove('modal-open');

  const backdropEl = document.body.querySelector('.modal-backdrop');

  if (backdropEl) {
    document.body.removeChild(backdropEl);
  }

  modalEl.classList.remove('show');
  modalEl.style.display = 'none';
};

const Modal = props => {
  const modalRef = useRef(null);

  const {
    show,
    title,
    closable = true,
    content,
    callback = () => {},
    buttons = [],
  } = props;

  useEffect(() => {
    if (show) {
      showModal(modalRef.current);
    }
    else {
      hideModal(modalRef.current);
    }
  }, [show]);

  return (
    <div ref={modalRef} className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            {closable && (
              <button type="button"
                className="close"
                aria-label="Close"
                onClick={e => {
                  e.preventDefault();
                  // We don't pass back the button here simply because
                  // it is easier to do in the demo. Most actions calling
                  // modal() will not care for this result anyway.
                  callback(null);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
          <div className="modal-body">
            {content}
          </div>
          <div className="modal-footer">
            {buttons.map((button, idx) =>
              // This is a pretty crude way to inject onClick handlers
              // in the buttons passed from the calling code; something
              // more flexible and sophisticated is left as exercise
              // for the application developer. :)
              React.cloneElement(button, {
                key: idx,
                onClick: () => { callback(button) },
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;