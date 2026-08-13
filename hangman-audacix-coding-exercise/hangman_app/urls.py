from django.urls import path
from .views import HangmanCreateGameView, GameStateDetailView, GuessLetterView

urlpatterns = [
    path("new/", HangmanCreateGameView.as_view(), name="new-game"),
    path("<int:game_id>/guess/", GuessLetterView.as_view(), name="guess-letter"),
    path("<int:game_id>/", GameStateDetailView.as_view(), name="game-detail"),
]