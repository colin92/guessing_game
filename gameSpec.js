describe('the guessing game', function() {
  beforeEach(function() {
    var game = new Game();
  });

  it('should start an new game', function() {
    expect(game.number).toBeLessThan(100);
    expect(game.number).toBeMoreThan(0);
    expect(game.guesses).toEqual(5);
  });

  it('has a guess evaluation function', function() {
    var guess_result_hot = game.guess(game.number-1); 
    var guess_result_warm = game.guess(game.number-5); 
    var guess_result_cold =  game.guess(game.number-15); 
    var guess_result_very_cold = game.guess(game.number-25);
    var guess_result_correct = game.guess(game.number);
    expect(guess_result_correct['is_correct']).toBe(true);
    expect(guess_result_hot.is_close).toEqual('hot');
  });
  
});
