
const calibrateContainer = (container: HTMLDivElement) => {
  container.style.width = `${document.body.clientWidth}px`;
  container.style.height = `${window.innerHeight - 180}px`;
}

export default calibrateContainer;
