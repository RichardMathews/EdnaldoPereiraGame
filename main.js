var mainState = {

  //Responsavel por executar o começo (sons e imagens)
  preload: function() { 
    //Carrega o sprite do passaro
    game.load.image('ednaldoBird', 'assets/ednaldoBird.png'); 
    game.load.image('ney', 'assets/neyPipe.png');
    game.load.audio('jump', 'assets/edinaldo.wav'); 
  },

  //Função chamada a seguir, aqui 
  //apresenta o setup do jogo, display, sprites, etc.
  create: function() { 
    // Altera a cor de fundo do jogo 
    game.stage.backgroundColor = '#71c5cf';

    // Inicia a fisica do sistema
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Posição inicial do passaro position x=100 and y=245
    this.bird = game.add.sprite(100, 200, 'ednaldoBird');

    // Adciona a fisica do jogo
    // Necessario para : movimentos, gravidade, colisões, etc.
    game.physics.arcade.enable(this.bird);

    // Adciona gravidade no pássaro para fazer ele cair
    this.bird.body.gravity.y = 1000;  

    // Chama a função 'jump' para quando apertar espaço o passaro "pular"
    var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);     

    // Create an empty group
    this.pipes = game.add.group(); 
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

    //Exibe a pontuação
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", 
    { font: "30px Arial", fill: "#ffffff" }); 

    // Move the anchor to the left and downward
    this.bird.anchor.setTo(-0.2, 0.5); 

    this.jumpSound = game.add.audio('jump'); 
  },

  //Esta função é chamada em 60 segundos 
  //E aqui contém a logica do jogo
  update: function() {
    //Esta função e chamada se o passaro 
    //estiver fora da tela (tanto em cima quanto em baixo)
    if (this.bird.y < 0 || this.bird.y > 490)
    this.restartGame();

    //Chama a função "restartGame()" toda vez que o pássaro colide com
    //um cano
    game.physics.arcade.overlap(
    this.bird, this.pipes, this.restartGame, null, this);
    
    //Animação do passaro levemente para cima e para baixo
    if (this.bird.angle < 20)
    this.bird.angle += 1; 

    game.physics.arcade.overlap(
    this.bird, this.pipes, this.hitPipe, null, this);  
  },

  // Faz o pássaro "pular"
  jump: function() {
    // Adciona velocidade vertical do passaro
    this.bird.body.velocity.y = -350;

    //Criando uma animação para o passaro
    var animation = game.add.tween(this.bird);

    //Mudando o angulo do passaro para -20° em milliseconds
    animation.to({angle: -20}, 100);

    // Iniciando a animação
    animation.start(); 

     //Animação em uma unica linha
    //game.add.tween(this.bird).to({angle: -20}, 100).start(); 

    //Impedir do passaro pular quando estiver morto
    if (this.bird.alive == false)
    return;  

    this.jumpSound.play();
  },

  // Reinicia o jogo
  restartGame: function() {
    //Inicia o estado 'main', quando o jogo recomeçar 
    game.state.start('main');
  },

  addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'ney');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe 
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200; 

    // Automatically kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

    //Aumentar a pontuação de 1 em 1
    this.score += 1;
    this.labelScore.text = this.score; 
  },

  addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);   
  },

  hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    //Muda a vida do passaro para falso
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
  }, 
};

// Inicializa o Phaser, e cria uma tela 400px por 490px do jogo.
var game = new Phaser.Game(400, 490);

// adciona o 'mainState' e chama o 'main'
game.state.add('main', mainState); 

// Inicia o estado atual (inicia o jogo)
game.state.start('main');

//python -m http.server 8000 --bind 127.0.0.1