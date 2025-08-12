import Module from './Module';

export default class Canvas extends Module {
    constructor($el) {
        super($el);
    }

    setRefs() {
        this.context = this.$el.getContext('2d', { alpha: false });
    }

    init() {
        super.init();
        this.$offsetCanvas = new OffscreenCanvas(1, 1);
        this.offsetContext = this.$offsetCanvas.getContext('2d');
    }

    drawImage(imageBitmap) {
        this.$el.width = imageBitmap.width;
        this.$el.height = imageBitmap.height;
        this.context.drawImage(imageBitmap, 0, 0);
    }

    export(message, scale = 1) {
        const size = this.$el.width * scale;
        this.$offsetCanvas.width = size;
        this.$offsetCanvas.height = size;
        this.offsetContext.imageSmoothingEnabled = false;
        this.offsetContext.drawImage(this.$el, 0, 0, size, size);
        this.$offsetCanvas.convertToBlob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = message.replaceAll('.', '').substring(0, 32);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }
}
