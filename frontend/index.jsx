import {createRoot} from "react-dom/client";
import React from 'react';

import Root from './src/Root';
import Modal from './src/Modal';

import './globals/translate.js';
import './globals/colors.js';
import './globals/styles.js';
import './globals/i.js';


window.React = React;
window.Modal = Modal;

const $root = document.querySelector('root');
const root = createRoot($root);

root.render(<Root/>);

window.addEventListener('resize', () => root.render(<Root />));