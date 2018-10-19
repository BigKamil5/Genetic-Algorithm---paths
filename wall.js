function Wall(x, y, width, height) {

    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height

    this.render = function(ctx) {

        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "gray";
        ctx.fillStyle = "gray";
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
        ctx.stroke();
    }
}