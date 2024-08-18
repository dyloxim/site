
const calibrateContainer = (container: HTMLDivElement) => {
  container.style.width = `${document.body.clientWidth}px`;
  container.style.height = `${window.innerHeight - 380}px`;
}

export default calibrateContainer;
