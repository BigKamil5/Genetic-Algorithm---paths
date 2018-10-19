//variables to change to get difrent results
var POPULATION_QUANTITY = 500,
    MUTATION_PROBABILITY = 0.3,
    LIFE = 600, //every frame is one life
    SPEED = 5,
    MOVECOUNTER = 30;



function initCanvas(){

    //setting up a canvas
    var ctx = document.getElementById('myCanvas').getContext('2d', { alpha: false });
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //variables
    var cW = ctx.canvas.width, //canvas width
        cH = ctx.canvas.height, //canvas height
        tar = new Target(window.innerWidth-50, window.innerHeight/2,5), //out target which ships have to reach
        generation = 1, //generation counter
        population = new Population(POPULATION_QUANTITY,LIFE),  // our population
        walls = []; //array of our walls on a way
    
    //creating some walls, to make path of ships harder
    walls.push(new Wall(window.innerWidth/3,window.innerHeight/10,30,window.innerHeight/1.2));
    walls.push(new Wall(window.innerWidth/1.7,window.innerHeight/18,30,window.innerHeight/2));
    walls.push(new Wall(window.innerWidth/1.7,window.innerHeight/1.5,30,window.innerHeight/3.2));

    //initialize our population
    population.init();

    //function to help get random number
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
        
    // our main loop
    function animate(){

        requestAnimationFrame(animate);

        //text about generation
        ctx.font = "30px Arial";
        ctx.fillText("Generation : "+generation, window.innerWidth - 300 ,50);

        //refreshing screen
        ctx.fillStyle = "rgba(20, 20, 40, 0.05)";
        ctx.fillRect(0, 0, cW, cH);

        // action after life reach 0, next generation is born
        if(population.lifespan === 0){

            population.getBesttrack(ctx); //check which ships is the best, which was the closest one to destination
            population.checkfitness(); //calculating fitness -> like score of every ship         
            population.ships = []; // clearing ships array
            population.init(); //initialize new ships once again


            /* 
            After create mating pool which is an array with dna of our ships, the better dna ship has
            the more time this dna is in mating pool
            Right here we are getting two random objects of dna and mixing them together, creating new one.
            Chance that one piece of dna mutate is specified in the top with MUTATION_PROBABILITY variable
            After everything we are reseting ships position and let them learn :)

            And what is DNA in this program may you ask. It's just array with the angle by which the ship turns
            */
            for(var i = 0; i < population.quantity; i++ ){
                var dna1 = getRandomInt(0, population.matingpool.length-1),
                    dna2 = getRandomInt(0, population.matingpool.length-1);

                population.ships[i] = population.ships[i].crossDna(population.matingpool[dna1],population.matingpool[dna2]);
                population.ships[i].mutate(MUTATION_PROBABILITY);
                population.ships[i].beMutant();
                population.ships[i].reset();
            }

            console.log(population.matingpool.length);
            population.ships.push(population.bestship); //our best ship is showed as this larger gold one
            population.lifespan = population.initlifespan; //reseting life
            generation += 1; 


        }

        //showing walls on screen too
        for(var i = 0; i < walls.length; i++){
            walls[i].render(ctx);
        }

        //let population GO
        population.run(ctx,tar,walls);
        population.lifespan --;
        tar.render(ctx);

    }
    
    animate();
}

//when window is loaded init out script
window.addEventListener('load', function(event) {
    initCanvas();
});

