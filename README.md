# Hypermedia-project-part2

La pàgina utilitza *delays* que s'han implementat amb la funció setTimeout(...). 

El dealer té dos casos en els que pot agafar cartes:
- dealer.points() < player.points(): Si té menys punts que el jugador sempre agafarà cartes.
- dealer.points() == player.points() && probsGoodCard(dealer.points() > 37): Si els punts que tenen són iguals, el dealer  només s'arriscarà si les probabilitats d'agafar una bona carta són superiors al 37%. Això permet al dealer prendre riscos calculats sense ser massa agressiu i fer el joc més interessant i just per al jugador.

La funció probsGoodCard(points) calcula les probabilitats d'agafar una bona carta en funció dels punts passats com a paràmetre i les cartes pendents i agafades de la baralla.
