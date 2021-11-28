class Field {
    constructor(world, viewport, camera) {
        this._world    = world;
        this._viewport = viewport;
        this._camera   = camera;

        this.cell = {w: 40, h: 40}

        const canvas = document.createElement('canvas');
        let ctx    = canvas.getContext('2d');

        canvas.width = world.w;
        canvas.height = world.h;

        const rows = ~~(world.h / (this.cell.h + 4)) + 1;
        const cols = ~~(world.w / (this.cell.w + 4)) + 1;

        let color = 'yellow';

        ctx.save();

        for (var x = 0, i = 0; i < rows; x += 44, i++) {
          ctx.beginPath();
          for (var y = 0, j = 0; j < cols; y += 44, j++) {
            ctx.rect(x, y, 40, 40);
          }
          color = (color == "yellow" ? "black" : "yellow");
          ctx.fillStyle = color;
          ctx.fill();
          ctx.closePath();
        }
        ctx.restore();

        // store the generate map as this image texture
        this._backgroundImage = new Image();
        this._backgroundImage.src = ctx.canvas.toDataURL("image/png");

        // clear context
        ctx = null;
    }

    renderField(ctx) {
        ctx.clearRect(0, 0, this._viewport.w, this._viewport.h);

        let sx, sy, dx, dy;
        let sWidth, sHeight, dWidth, dHeight;

        // offset point to crop the image
        sx = this._camera.getXOffset();
        sy = this._camera.getYOffset();

        // dimensions of cropped image          
        sWidth  = ctx.canvas.width;
        sHeight = ctx.canvas.height;

        // if cropped image is smaller than canvas we need to change the source dimensions
        if (this._backgroundImage.width - sx < sWidth) {
          sWidth = this._backgroundImage.width - sx;
        }
        if (this._backgroundImage.height - sy < sHeight) {
          sHeight = this._backgroundImage.height - sy;
        }

        // location on canvas to draw the croped image
        dx = 0;
        dy = 0;
        // match destination with source to not scale the image
        dWidth = sWidth;
        dHeight = sHeight;

        ctx.drawImage(this._backgroundImage, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}
