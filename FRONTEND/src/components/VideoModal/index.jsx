import React, { memo, useState } from 'react';
import './style.scss';
import Modal from '../Modal';


export default function VideoModal({ close }) {
  const [showModal, setShowModal] = useState(true);
  const hasShortcut = window.matchMedia('(display-mode: standalone)').matches;
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
  const videoFile = isSafari ? 'safari.mp4' : 'chrome.mp4';

  if (localStorage.noVideoModal || hasShortcut) {
    return <></>;
  }


  function handleShowModal(){
    setTimeout(() => setShowModal(true), 3000);
  }

  function handleHideModal() {
    localStorage.noVideoModal = true;
    setShowModal(false);
  }



  return (
    <>
      <video
        className="video-modal-loader"
        defaultmuted="true"
        muted
        playsInline // needed for safari
        autoPlay
        onCanPlayThrough={handleShowModal}
        src={`/novoponto/static/assets/videos/${videoFile}`}
        type="video/mp4"
      >
      </video>

      {showModal &&
        <Modal close={close || handleHideModal} buttonText="Mais tarde">

          {/* 
             had to use dangerouslySetInnerHTML because of "muted" issue, not autoplaying in safari
             https://github.com/facebook/react/issues/6544#issuecomment-293672709
          */}

          <div dangerouslySetInnerHTML={{
            __html: /* html */`
                <video
                  class="video-modal"
                  muted
                  defaultmuted
                  autoplay
                  playsinline
                  loop
                  src="/novoponto/static/assets/videos/${videoFile}"
                  type="video/mp4"
                />`
          }}>
          </div>
        </Modal>
      }
    </>
  )
}