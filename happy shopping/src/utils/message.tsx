

import ReactDOM from 'react-dom/client';


const modalStyle = {
  display: "table",
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "-50% -50%",
  width: " 3rem",
  height: "1rem",
  marginLeft: "-1.5rem",
  marginTop: "-0.5rem",
  borderRadius: ".08rem",
  background: " rgba(0,0,0, .7)",

}

const modalTextStyle = {
  display: "table-cell",
  padding: ".2rem",
  fontSize: ".16rem",
  color: " #FFF",
  verticalAlign: "middle",
  textAlign: "center" as const,
}

const element = document.createElement('div');
const root = ReactDOM.createRoot(element);
export const message = (message: string, timeout = 1500) => {
  root.render(
    <div style={modalStyle}>
      <div style={modalTextStyle}> {message} </div>
    </div>
  );
  if (!element.parentNode) {
    document.body.appendChild(element);
    setTimeout(() => {
      document.body.removeChild(element);
    }, timeout)
  }
}

