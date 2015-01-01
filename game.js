function Game() {
  this.number = Math.floor((Math.random() * 100) + 1);
  this.guesses = 5;  
  this.prev_guesses = [];
  this.difference = null;
  this.prev_difference = null;
  this.score = [0,0];
  this.game_over = false;
  }

function validGuess(n) {
  if((n >= 1) && (n <= 100)) {
    return true;
  }
  else {
    return false;
  }
}

Game.prototype.updateScore = function(result) {
  this.score[result] += 1;
  $('#win').text(this.score[1] + " Wins");
  $('#loss').text(this.score[0] + " Losses");
}

Game.prototype.guess = function(n) {
  var difference = n - this.number;
  this.prev_difference = this.difference;
  this.difference = Math.abs(difference);
  var correctness = {
    is_correct: false,
    is_close: []
  };
  if(difference == 0) {
    correctness.is_correct = true;
  }
  else if(difference >=  25) {
    correctness.is_close = ['very cold', 'Guess Lower'];
  }
  else if(difference <= -25) {
    correctness.is_close = ['very cold', 'Guess Higher'];
  }
  else if(difference >= 15) {
    correctness.is_close = ['cold', 'Guess Lower'];
  }
  else if(difference <= -15) {
    correctness.is_close = ['cold', 'Guess Higher'];
  }
  else if(difference >= 5) {
    correctness.is_close = ['warm', 'Guess Lower'];
  }
  else if(difference <= -5) {
    correctness.is_close = ['warm', 'Guess Higher'];
  }
  else if(difference >= 0) {
    correctness.is_close = ['hot', 'Guess Lower'];
  }
  else if(difference <= 0) {
    correctness.is_close = ['hot', 'Guess Higher'];
  }
  return correctness;
}

Game.prototype.win = function() {
  $('.glyphicon').hide();
  $('#direction-text').show();
  $('#direction-text').text("Congratulations! You guessed correctly!");
  this.updateScore(1);
}

Game.prototype.lose = function() {
  $('.glyphicon').hide();
  $('#direction-text').show();
  $('#direction-text')
  .text("Sorry! You ran out of Guesses! It was " + this.number);
  this.updateScore(0);
}

Game.prototype.showHint = function(result) {
  $('.glyphicon').show();
  $('#direction-text').show();
  var temperature = $('#temperature');
  if(result[0] == 'hot') {
    temperature.animate({marginLeft:'85%'},'slow');
  }
  else if(result[0] == 'warm') {
    temperature.animate({marginLeft:'65%'},'slow');
  }
  else if(result[0] == 'cold') {
    temperature.animate({marginLeft:'35%'},'slow');
  }
  else if(result[0] == 'very cold') {
    temperature.animate({marginLeft:'15%'},'slow');
  }
  if(this.prev_difference == null) {
    var guess_progress = '';
  }
  else if(this.prev_difference > this.difference) {
    var guess_progress = 'Warmer - ';
  }
  else {
    var guess_progress = 'Colder - ';
  }
  if(result[1] == "Guess Higher") {
    $('#direction-text').text(guess_progress + result[1]);
    $('.glyphicon').addClass('glyphicon-arrow-up');
    $('.glyphicon').removeClass('glyphicon-arrow-down');
  }
  else {
    $('#direction-text').text(guess_progress + result[1]);
    $('.glyphicon').removeClass('glyphicon-arrow-up');
    $('.glyphicon').addClass('glyphicon-arrow-down');
  }
}

Game.prototype.play = function() {
  var guess_field = $('#guess_field');
  var this_game = this;
  guess_field.on('change', function() {
    if(this_game.game_over) return;
    else {
      var guess_result = this_game.guess(guess_field.val());
      if(!validGuess(guess_field.val())) {
        guess_field.val('');
        $('.glyphicon').hide();
        $('#direction-text').show();
        $('#direction-text').text('Please enter a number between 1-100');
      }
      else if(guess_result.is_correct == true) {
        $('#prev-guesses')
        .append('<h3 class="label label-success">' + guess_field.val()
        + '</h3>');
        this_game.win();
        this_game.game_over = true;
        return;
      }
      else if(this_game.guesses == 0) {
        this_game.lose();
        this_game.game_over = true;
        return;
      }
      else {
        if(guess_result.is_close[0].match(/cold/)) {
        $('#prev-guesses')
        .append('<span class="label label-primary">' + guess_field.val()
        + '</span>');
        }
        else {
        $('#prev-guesses')
        .append('<span class="label label-danger">' + guess_field.val()
        + '</span>');
        }
        this_game.prev_guesses.push(guess_field.val());
        guess_field.val('');
        this_game.guesses -= 1;
        $('#badge').text(this_game.guesses);
        this_game.showHint(guess_result.is_close);
      }
    }
  });
}


$(document).ready(function() {
  $('#direction-text').hide();
  $('.glyphicon').hide();

  var game = new Game();
  game.play();
  $('#play_again').on('click', function() {
    $('#direction-text').hide();
    $('.glyphicon').hide();
    $('#guess_field').val('');
    $('#badge').text(5);
    $('#prev-guesses').text('');
    $('#temperature').animate({marginLeft:'50%'},'slow');
    game.guesses = 5;
    game.difference = null;
    game.prev_difference = null;
    game.number = Math.floor((Math.random() * 100) + 1);
    game.game_over = false;
  });

  $('#hint').on('click', function() {
    $('#direction-text').show()
    .text('Subtle hint: It\'s between '+game.number+' and '+game.number);
    $('.glyphicon').hide();
  });
});
