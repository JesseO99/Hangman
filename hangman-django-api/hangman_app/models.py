from django.db import models


# Create your models here.
class Word(models.Model):
    word = models.CharField(max_length=50, primary_key=True)

    def __str__(self):
        return self.word


class Game_State(models.Model):
    class StatesChoices(models.TextChoices):
        ACTIVE = 'a', "active"
        WON = 'w', "won"
        LOST = 'l', "lost"

    game_id = models.AutoField(primary_key=True)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    current_state = models.CharField(max_length=1, choices=StatesChoices.choices, default=StatesChoices.ACTIVE)
    guessed_word = models.CharField(max_length=50, default="")
    guessed_letters = models.CharField(max_length=26, default="")
    incorrect_guesses = models.IntegerField(default=0)
    max_incorrect_guesses = models.IntegerField(default=1)
    
    def guess_letter(self, letter):
        if letter in self.guessed_letters:
            return False  # Letter has already been guessed

        letter_not_in_word = True 
        guessed_word_list = list(self.guessed_word)

        for i, ch in enumerate(self.word.word):
            if ch.lower() == letter.lower():
                if i == 0:
                    guessed_word_list[i] = letter.upper()
                else:
                    guessed_word_list[i] = letter.lower()
                
                letter_not_in_word = False
        self.guessed_letters += letter

        if letter_not_in_word:
            self.incorrect_guesses += 1

        self.guessed_word = "".join(guessed_word_list)
        self.check_game_status()
        self.save()
        return not letter_not_in_word

    def check_game_status(self):
        if self.guessed_word == self.word.word:
            self.current_state = self.StatesChoices.WON
        elif self.incorrect_guesses >= self.max_incorrect_guesses:
            self.current_state = self.StatesChoices.LOST
        else:
            self.current_state = self.StatesChoices.ACTIVE
        return self.current_state

    def __str__(self):
        return f"GameState {self.game_id} for {self.word.word} with {self.incorrect_guesses} incorrect guesses, guessed letters: {self.guessed_letters}, incorrect guesses: {self.incorrect_guesses}/sS{self.max_incorrect_guesses}"