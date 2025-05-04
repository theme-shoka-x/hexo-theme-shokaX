import { HanaImgViewer } from 'hana-img-viewer'
import { createApp } from 'vue';

export const postImageViewer = (p: string) => {
  document.querySelectorAll(`${p} .md img:not(.emoji):not(.vemoji)`).forEach((element) => {
    const img = element as HTMLImageElement;
    const imgSrc = img.src

    const wrapper = document.createElement('div');
    img.replaceWith(wrapper);

    const app = createApp(HanaImgViewer, { src: imgSrc, maskOpacity: 0.8 });
    app.mount(wrapper);
  });
};
