const style = document.createElement('style');

style.textContent = `
  * {
    box-sizing: border-box;
  }
  
  body {
    background: ${colors.main};
    margin: 0; 
    height: 100%; 
    font-family: Montserrat, sans-serif;
  }
  
  html {
    height: 100%
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.scroll.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.scroll.thumb};
    border-radius: 4px;
  }
  
  a {
  	color: #449cf8; 
    text-decoration: none;
		position: relative;
		padding-bottom: 1px;
	}
	
	clickable:hover {
    border-bottom: 1px solid ${colors.text.strong} !important;
    cursor: pointer;
	}
	
  a {
    font-family: Play;
    border-radius: 5px;
    padding: 0px 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    letter-spacing: 1px;
    color: ${colors.link.text};
	}

	:not(html):not(head):not(script):not(style):not(b):not(span):not(i):not(a):not(em):not(strong):not(del):not(li):not(table):not(thead):not(tr):not(td):not(th):not(tbody) { 
    display: block; 
  }
  
  root {
    height: 100%;
  }

  category {
    opacity: 0;
    transform: translateY(60px) scale(0.96);
    transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }

  category.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    category {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  @keyframes electron-v {
    0% {
      transform: translateY(-16px);
      opacity: 0;
    }
    4% {
      opacity: 0.55;
    }
    96% {
      opacity: 0.55;
    }
    100% {
      transform: translateY(calc(var(--electron-v-travel) + 16px));
      opacity: 0;
    }
  }

  @keyframes electron-h {
    0% {
      transform: translateX(-16px);
      opacity: 0;
    }
    4% {
      opacity: 0.45;
    }
    96% {
      opacity: 0.45;
    }
    100% {
      transform: translateX(calc(var(--electron-travel) + 16px));
      opacity: 0;
    }
  }

  @keyframes electron-h-reverse {
    0% {
      transform: translateX(calc(var(--electron-travel) + 16px));
      opacity: 0;
    }
    4% {
      opacity: 0.45;
    }
    96% {
      opacity: 0.45;
    }
    100% {
      transform: translateX(-16px);
      opacity: 0;
    }
  }
`;

document.head.appendChild(style);
