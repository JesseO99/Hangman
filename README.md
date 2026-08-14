# Hangman 
## Author
Jesse Osrecak


## Hangman API
The Hangman API is built using Django and supports 3 API Calls:
POST /game/new/
POST /game/<id>/?letter=<letter to be guessed>
GET  /Game/<id>

A requirements.txt will be included for dependencies required by the python virtual environment

## Hangman Front-end
The Hangman Front-end utilities the Hangman API and runs in ReactJS. It is able to dynamically change with the theme of the browser and has an onscreen keyboard to input guesses making it friendly for a touch interface alongside coloured feedback on keys already pressed disabling them from subsequent key presses.
The root URL will take you to a page where you can start the game and the /game/<id> will take you to a saved game with that id.
