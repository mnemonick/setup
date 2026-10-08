import {type ReactNode, type MouseEvent, type CSSProperties, useEffect} from "react";

import colors from "~/globals/colors.ts";

export default function (props: { children?: ReactNode; onClose: () => void }) {
  const $backdrop: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: content.desktop ? 'center' : 'end',
    alignItems:  'center',
    backdropFilter: 'blur(2px)'
  };

  const $content: CSSProperties = {
    background: 'black',
    // width: content.desktop ? 'auto' : 'calc(100% - 40px)',
    width: true ? 'auto' : 'calc(100% - 40px)',
    borderRadius: 20,
    border: `1px solid ${colors.border.strong}`,
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
    marginBottom: undefined
    // marginBottom: content.desktop ? null : 20
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <backdrop style={$backdrop} onClick={onClose}>
      <content style={$content}>
        {props.children}
      </content>
    </backdrop>
  );

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      props.onClose();
    }
  }

  function onClose(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      props.onClose();
    }
  }
}