import {createRoot} from "react-dom/client";
import React from 'react';

import Root from './src/Root';
import Modal from './src/Modal';

import BoilerplateModal from "./src/BoilerplateModal.jsx";
import ComponentsModal from "./src/ComponentsModal.jsx";
import SettingsModal from "./src/SettingsModal.jsx";

import './globals/translate.js';
import './globals/colors.js';
import './globals/styles.js';
import './globals/i.js';

window.React = React;
window.Modal = Modal;

window.BoilerplateModal = BoilerplateModal;
window.ComponentsModal = ComponentsModal;
window.SettingsModal = SettingsModal;

const $root = document.querySelector('root');
const root = createRoot($root);

root.render(<Root/>);

window.addEventListener('resize', () => root.render(<Root />));