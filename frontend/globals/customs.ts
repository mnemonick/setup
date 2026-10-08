// Allow any custom tags, e.g. <root />, <wrapper />, <asdf />.
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Suppress react errors for custom tags.
const _error = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("is unrecognized in this browser")) return;
  _error(...args);
};
