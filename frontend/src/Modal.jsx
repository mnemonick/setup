import {ReactNode, useEffect} from "react";
import colors from "@/utils/colors";
import {Styles} from "@/types/Styles";
import useLayoutSize from "@/hooks/useLayoutSize";

interface ModalProps {
  children: ReactNode;
  onClose: (() => void);
}

export default function (props: ModalProps) {
  const styles: Styles = {};
  const content = useLayoutSize();

  styles.backdrop = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: colors.modal.backdrop,
    display: 'flex',
    justifyContent: 'center',
    alignItems: content.desktop ? 'center' : 'end',
    backdropFilter: 'blur(2px)'
  };

  styles.content = {
    background: colors.modal.content,
    width: content.desktop ? 'auto' : 'calc(100% - 40px)',
    borderRadius: 20,
    border: `1px solid ${colors.border.strong}`,
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
    marginBottom: content.desktop ? null : 20
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <backdrop style={styles.backdrop} onClick={onClose}>
      <content style={styles.content}>
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