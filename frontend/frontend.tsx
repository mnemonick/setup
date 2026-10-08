import {createRoot} from "react-dom/client";

import Root from '~/components/Root.tsx';

import '~/globals/customs.ts';
import '~/globals/styles.ts';

const $root = document.querySelector('root')!;
const root = createRoot($root);

root.render(<Root/>);

window.addEventListener('resize', () => root.render(<Root />));