function Ship(x, y, life) {

    this.x = x;
    this.y = y;
    this.distance = Infinity; //less distance ship has, better this ship is
    this.fitness = 0;
    this.angleRadians = Math.atan2(Math.floor(Math.random() * (window.innerWidth - 0 + 1)) + 0, Math.floor(Math.random() * (window.innerHeight - 0 + 1)) + 0);;
    this.clr = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6); //random color
    this.r = 1.5;
    this.speed = SPEED;
    this.movescounter = MOVECOUNTER;
    this.dna = new Dna();
    this.isBest = false;
    this.isMutant = false;
    this.index = 0;
    this.life = life;
    this.counter = this.life / this.movescounter - 1;


    this.render = function(ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.clr;
        ctx.fill();
        ctx.closePath();

    }


    /*
    follow and drawDnaPath functions

    Here all the math happens...
    Distance is calculating with simple Pythagorean theorem dist^2 = x^2 + y^2
    Movecounter is how much "ticks" ship can make with one angle;

    follow() -> only first generation is using that function. Creating bunch of random angles, putting them
    into DNA arrays of every ship
    Angle is calculating with Math.atan2 function.

    drawDnaPath() -> in this function our DNA is already created, we are getting every angle from DNA array
    similar way to follow(), just not random. DNA arrays is generated with cross and mutating functions
    */ 
    this.follow = function(ctx, targetX, targetY) {

        var tmpdist = this.distance
        if (tmpdist > Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2)))
            this.distance = Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));

        if (this.isBest || this.isMutant) {
            this.drawDnaPath(ctx);
        } else {
            if (this.movescounter === 0) {
                this.counter--;
                this.dna.addToPath(this.angleRadians);
                tarX = Math.floor(Math.random() * (window.innerWidth - 0 + 1)) + 0;
                tarY = Math.floor(Math.random() * (window.innerHeight - 0 + 1)) + 0;
                this.angleRadians = Math.atan2(tarY - this.y, tarX - this.x);
                this.movescounter = MOVECOUNTER;
                if (this.counter === 0) {
                    this.dna.addToPath(this.angleRadians);
                }
            } else {
                this.movescounter--;
                this.x += Math.cos(this.angleRadians) * this.speed;
                this.y += Math.sin(this.angleRadians) * this.speed;
            }
        }
    }


    this.drawDnaPath = function(ctx) {

        if (this.movescounter === 0) {
            this.index++;
            this.movescounter = MOVECOUNTER;
        } else {
            this.movescounter--;
            ctx.moveTo(this.x, this.y);
            this.x += Math.cos(this.dna.path[this.index]) * this.speed;
            this.y += Math.sin(this.dna.path[this.index]) * this.speed;
            ctx.lineTo(this.x, this.y);
            if (this.isBest) {
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#DAA520';
                ctx.stroke();
            }
        }
    }


    /*
    Well, it is sary condidtion but it's nothing special, if our ships X cordinate or Y adter adding radius of our ship (X,Y are center) 
    hits wall or canvas edge, it just stops moving
    */
    this.checkColision = function(walls) {

        for (var i = 0; i < walls.length; i++) {
            if (((this.x + this.r) - walls[i].x < walls[i].w && (this.x + this.r) - walls[i].x > -2 && (this.y + this.r) - walls[i].y > 0 && (this.y + this.r) - walls[i].y < walls[i].h) ||
                ((this.y >= window.innerHeight - this.r || this.y <= 0 - this.r - 2) || (this.x <= 0 - this.r - 2 || this.x > window.innerWidth + this.r))) {
                this.speed = 0;
            }
        }
    }


    this.reset = function() {

        this.x = 0;
        this.y = 0;
        this.index = 0;
        this.movescounter = MOVECOUNTER;
        this.speed = SPEED;
    }


    this.beTheBest = function() {

        this.isBest = true;
        this.r = 1.5;
        this.clr = "green";
    }


    this.beMutant = function() {

        this.isMutant = true;
    }

    // MUTATION AND CROSSING ARE EXPLAINED IN COMMENTS IN SCRIPT.JS... more or less
    //crossing DNA process
    this.crossDna = function(firstshipDNA, secondshipDNA) {

        var midpoint = firstshipDNA.path.length / 2,
            child = new Ship(0, 0);

        for (var i = 0; i < firstshipDNA.path.length; i++) {
            if (i > midpoint) child.dna.path[i] = firstshipDNA.path[i];
            else child.dna.path[i] = secondshipDNA.path[i];
        }
        return child;

    }

    // mutation process
    this.mutate = function(mutationproability) {

        for (var i = 0; i < this.dna.path.length; i++) {
            if (Math.random() < mutationproability) {
                var tarX = Math.floor(Math.random() * (window.innerWidth - 0 + 1)) + 0,
                    tarY = Math.floor(Math.random() * (window.innerHeight - 0 + 1)) + 0,
                    mutateangle = Math.atan2(tarY - this.y, tarX - this.x);

                this.dna.path[i] = mutateangle;
            }
        }

    }


}