function Population(quantity, life) {

    this.quantity = quantity;           //how many ships will we have
    this.ships = [];                    //array of our ships
    this.bestdistance = Infinity;       //variable to save best distance got from all the ships
    this.bestship;                      //best ship reference
    this.lifespan = life;               //life of our ship
    this.initlifespan = this.lifespan;  //initial value of life variable
    this.matingpool = [];               //and our dna array


    this.init = function() {

        for (var i = 0; i < this.quantity; i++) {

            this.ships[i] = new Ship(0, 0, this.initlifespan);

        }

    }

    
    this.run = function(ctx, target, walls) {

        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].render(ctx);
            this.ships[i].follow(ctx, target.x, target.y);
            this.ships[i].checkColision(walls);
        }

    }

    //getting best distance and path
    this.getBesttrack = function(ctx) {

        for (var i = 0; i < this.ships.length; i++) {
            
            if (this.bestdistance > this.ships[i].distance) {

                this.bestdistance = this.ships[i].distance;
                this.bestship = this.ships[i];
                ctx.fillStyle = "rgba(20, 20, 40, 1)";
                ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
                this.bestship.beTheBest()
            }
        }

        this.bestship.reset();
    }


    /*
    Fitness is kind of a score of every ship. Based on this variable, program is getting to know 
    how good DNA of that one ship was.
    For example, if our best ship was 100px away from target, and this.ship was 700px away,
    his fitness score will be 1/7*10, so it's 7;
    The best ship with best DNA is getting fitness property ^2, to improve learning speed
    */
    this.checkfitness = function() {

        var avgdistn = 0; 
        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].fitness = this.bestship.distance / (this.ships[i].distance * 10);
            if (this.ships[i].isBest) {
                Math.pow(this.ships[i].fitness,2);
            }
            avgdistn += this.ships[i].fitness;
        }
        avgdistn = avgdistn / this.ships.length;
        this.createMatingPool(avgdistn);
    }


    //If fitness of ship is worse than avg fitness, its DNA is getting lost
    this.createMatingPool = function(avgdistn) {

        for (var i = 0; i < this.ships.length; i++) {
            if (this.ships[i].fitness > avgdistn) {
                for (var j = 0; j < this.ships[i].fitness; j++) {
                    this.matingpool.push(this.ships[i].dna);
                }
            }
        }

    }

}