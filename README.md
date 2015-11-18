Pour commencer
=====================
Utiliser composer pour installer silex (/vendor au même niveau que /src) -> Pas géré par gulp

Installer les dépendances node
```
sudo npm install
```

Ensuite on installe les dépendances front qui deviendront des vendors lors des tests et de la mise en prod
```
bower install
```


GULP
--------------------
Pour lancer les taches par défaut et sortir un proto
```
gulp
```

Pour compiler le SCSS
```
gulp css
```

Pour les scripts JS
```
gulp js
```

Pour les dépendances front 
```
gulp usemin
```



Ajouter du js dans l'appli
--------------------


src/index.html
```
    <!-- build:js js/vendors.js -->
        <script src="../bower_components/jquery/dist/jquery.min.js"></script> 
        ...
        ...
    <!-- endbuild -->
```

Ajouter du css dans l'appli
--------------------

Mettre du code dans ce fichier:
src/styles/main.scss



Roadmap
=====================
https://trello.com/b/eZr1etd6/front-end