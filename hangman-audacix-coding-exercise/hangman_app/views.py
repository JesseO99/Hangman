from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Word, Game_State
from math import ceil

class HangmanCreateGameView(APIView):
    def post(self, request):
        random_word = Word.objects.order_by("?").first()

        if random_word is None:
            return Response(
                {"error": "No words available. Add a Word first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        secret = random_word.word
        max_incorrect = max(1, ceil(len(secret) / 2))

        game = Game_State.objects.create(
            word=random_word,
            guessed_word="_" * len(secret),
            max_incorrect_guesses=max_incorrect,
        )

        return Response({
            "game_id": game.game_id,
            "word": random_word.word,
            "max_incorrect_guesses": game.max_incorrect_guesses,
        }, status=status.HTTP_201_CREATED)


class GameStateDetailView(APIView):
    def get(self, request, game_id):
        try:
            game = Game_State.objects.get(game_id=game_id)
        except Game_State.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

        guesses_made = len(game.guessed_letters)
        guesses_left = max(0, game.max_incorrect_guesses - game.incorrect_guesses)

        return Response({
            "game_id": game.game_id,
            "current_state": game.current_state,
            "guessed_word": game.guessed_word,
            "guesses_made": guesses_made,
            "guesses_left": guesses_left,
            "incorrect_guesses": game.incorrect_guesses,
            "max_incorrect_guesses": game.max_incorrect_guesses,
        }, status=status.HTTP_200_OK)


class GuessLetterView(APIView):
    def post(self, request, game_id):
        try:
            game = Game_State.objects.get(game_id=game_id)
        except Game_State.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

        letter = request.data.get("letter") or request.query_params.get("letter")

        if letter is None:
            return Response({"error": "Please provide a single character in the 'letter' field."}, status=status.HTTP_400_BAD_REQUEST)

        if len(letter) != 1 or not letter.isalpha():
            return Response({"error": "The guessed value must be a single letter."}, status=status.HTTP_400_BAD_REQUEST)

        if letter.lower() in game.guessed_letters.lower():
            return Response({
                "message": f"The character '{letter}' has already been guessed.",
                "game_id": game.game_id,
                "current_state": game.current_state,
                "guessed_word": game.guessed_word,
                "guesses_made": len(game.guessed_letters),
                "guesses_left": max(0, game.max_incorrect_guesses - game.incorrect_guesses),
            }, status=status.HTTP_200_OK)

        updated = game.guess_letter(letter)
        if not updated:
            return Response({
                "message": f"The character '{letter}' is not available to be guessed.",
                "game_id": game.game_id,
                "current_state": game.current_state,
                "guessed_word": game.guessed_word,
                "guesses_made": len(game.guessed_letters),
                "guesses_left": max(0, game.max_incorrect_guesses - game.incorrect_guesses),
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Letter processed successfully.",
            "game_id": game.game_id,
            "current_state": game.current_state,
            "guessed_word": game.guessed_word,
            "guessed_letters": game.guessed_letters,
            "incorrect_guesses": game.incorrect_guesses,
            "guesses_made": len(game.guessed_letters),
            "guesses_left": max(0, game.max_incorrect_guesses - game.incorrect_guesses),
        }, status=status.HTTP_200_OK)