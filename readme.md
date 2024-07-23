# README: Installation et Test du Système CSV

---

## Table des Matières
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Exécution du Script](#exécution-du-script)
4. [Automatisation des Tests](#automatisation-des-tests)
5. [Cas de Test](#cas-de-test)
6. [Dépannage](#dépannage)
7. [Contributions et Support](#contributions-et-support)

## Prérequis

Avant de commencer, vous devez avoir les outils suivants installés sur votre système :

1. **Node.js** : Le runtime JavaScript pour exécuter le script.
   - **Windows** : Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/).
   - **macOS** : Utilisez Homebrew avec `brew install node`.
   - **Linux** : Utilisez les gestionnaires de paquets, par exemple `sudo apt-get install nodejs npm` pour Ubuntu.

2. **npm** : Le gestionnaire de paquets Node.js pour installer les modules nécessaires.
   - Inclus avec Node.js. Vérifiez l'installation avec `npm --version`.

3. **Outils de ligne de commande** : Pour la comparaison de fichiers CSV.
   - **Windows** : Installez [Git Bash](https://gitforwindows.org/) ou utilisez PowerShell.
   - **macOS/Linux** : Les outils nécessaires sont généralement préinstallés.

## Installation

1. **Clonez le dépôt du projet** :

   ```bash
   git clone https://github.com/mohamed-ndoye811/ynov-devweb-methodo-test.git
   cd ynov-devweb-methodo-test
   ```

2. **Installez les dépendances Node.js** :

   ```bash
   npm install
   ```

## Exécution du Script

1. **Préparez les fichiers de test et les résultats attendus** :
   - Placez les fichiers CSV d'entrée dans le répertoire `./tests`.
   - Placez les fichiers CSV attendus dans le répertoire `./expected`.

2. **Créez le répertoire pour les fichiers de sortie** :

   ```bash
   mkdir -p ./output

   # Si besoin il est possible de changer le nom du dossier dans le script de test
   ```

3. **Exécutez le script Node.js avec un fichier d'entrée et un fichier de sortie** :

   ```bash
   node script.js <INPUT_FILE> <OUTPUT_FILE>
   ```

   Exemple :

   ```bash
   node script.js ./tests/test1.csv ./output/test1.csv
   ```

## Automatisation des Tests

Pour automatiser les tests, créez un script Bash qui exécutera le script principal avec différents fichiers de test et comparera les résultats avec les fichiers attendus.

### Script de Test Automatisé

Un fichier test.sh vous permettra de lancer les tests. Pour ajouter un cas de test il suffit d'ajouter un fichier csv dans le dossier `tests` et de mettre le résultat attendu dans le dossier `expected`. Veillez à ce que les fichiers aient exactement le même nom, et que les entrées soient triées par date croissante

### Rendez le Script Exécutable

Assurez-vous que le script de test est exécutable avec la commande :

```bash
chmod +x test.sh
```

### Exécutez le Script de Test

Lancez le script de test automatisé avec :

```bash
./test.sh
```

## Cas de Test

Les cas de test permettent de valider le bon fonctionnement du script. Voici des exemples de cas de test à inclure dans le répertoire `./tests`:

1. **Test 1** : Vérifie le fonctionnement de la logique de jour pratiqué. Selon les exercices et leur nombres, les séances seront enregistré et les séries seront incrémenté de 1
   - **Fichier d'entrée** : `/tests/test1.csv`
   - **Fichier attendu** : `/expected/test1.csv`

2. **Test 2** : Testez l'augmentation de la série, malgré la perte de quelques vies, ainsi que sa réinitialisation lors de totale des vies
   - **Fichier d'entrée** : `/tests/test2.csv`
   - **Fichier attendu** : `test2.csv`

3. **Test 3** : Tester le système de regain d'une vie
   - **Fichier d'entrée** : `/tests/test3.csv`
   - **Fichier attendu** : `test3.csv`

4. **Test 4** : Test sur plusieurs utilisateurs
   - **Fichier d'entrée** : `/tests/test4.csv`
   - **Fichier attendu** : `test4.csv`

## Dépannage

### Problème : Commande `node` non trouvée

Assurez-vous que Node.js est correctement installé et que son chemin est inclus dans la variable d'environnement `PATH`. Vérifiez l'installation avec :

```bash
which node
```

Sur Windows, assurez-vous que le répertoire d'installation de Node.js est inclus dans les variables d'environnement système.

### Problème : Les fichiers CSV ne sont pas générés correctement

- Assurez-vous que le script Node.js écrit correctement les fichiers CSV dans le répertoire `./output`.
- Vérifiez les permissions d'écriture dans le répertoire `./output`.

### Problème : Différences dans les fichiers CSV

Utilisez `sed` pour nettoyer les espaces et les retours à la ligne des fichiers CSV avant la comparaison :

```bash
sed 's/\r//' "$FILE" | sed 's/[[:space:]]\+/ /g' | sort > "$CLEANED_FILE"
```

Comparez les fichiers nettoyés avec `diff` :

```bash
diff -u "$CLEANED_EXPECTED_FILE" "$CLEANED_ACTUAL_FILE"
```