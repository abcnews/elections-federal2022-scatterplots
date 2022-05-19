import { graphToUrlQuery } from './encode';
import type { Graph } from '../store';

export const generateFallback = async (graph: Graph) => {
  const builderUrl = encodeURIComponent(`${__webpack_public_path__}/${graphToUrlQuery(graph)}`);
  const downloadUrl = `https://abcnews-cors-anywhere.herokuapp.com/https://fallback-automation.drzax.now.sh/api?url=${builderUrl}&width=600&selector=article`;

  const res = await fetch(downloadUrl);
  const blob = await res.blob();
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = data;
  link.download = 'scatter-fallback.png';

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  // (initiatingElement as HTMLElement).style.pointerEvents = 'none';
  //
  // const end = () => {
  //   (initiatingElement as HTMLElement).style.pointerEvents = 'initial';
  // };
  //
  // Promise.all(imageBlobPromises)
  //   .then(blobs => {
  //     blobs.forEach((blob, index) => {
  //       if (blob) {
  //         zip.file(`${String(index).padStart(3, '0')}-${filenames[index]}.png`, blob);
  //       }
  //     });
  //     zip
  //       .generateAsync({ type: 'blob' })
  //       .then(content => {
  //         saveAs(content, `lh-fallback-bundle-${Date.now()}.zip`);
  //         end();
  //       })
  //       .catch(end);
  //   })
  //   .catch(end);
};


