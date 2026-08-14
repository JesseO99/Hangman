from rest_framework import serializers
from .models import Game_State

class Game_StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game_State
        fields = [
            "game_id",
            "word",
            "current_state",
            "guessed_word",
            "guessed_letters",
            "incorrect_guesses",
            "max_incorrect_guesses",
        ]