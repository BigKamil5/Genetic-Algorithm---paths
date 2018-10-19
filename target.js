function Target(x, y, r) {

    this.x = x;
    this.y = y;
    this.r = r;
    this.clr = "white";

    this.render = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.clr;
        ctx.fill();
    }

}