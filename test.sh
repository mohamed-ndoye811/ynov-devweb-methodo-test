#!/bin/bash

# Répertoires pour les fichiers de test
INPUT_DIR="./tests"
EXPECTED_DIR="./expected"
ACTUAL_DIR="./output"

# Script principal à tester
SCRIPT="script.js"

# Crée les répertoires si nécessaires
mkdir -p $ACTUAL_DIR

# Fonction pour exécuter un test
run_test() {
  local test_name=$1
  local input_file=$2
  local expected_file=$3
  local actual_file=$4

  echo "Running test: $test_name"

  # Exécute le script principal avec le fichier d'entrée
  node $SCRIPT $input_file $actual_file

  # Compare le fichier de sortie avec le fichier attendu
  if diff -u --ignore-space-change $expected_file $actual_file > /dev/null; then
    echo "Test '$test_name' PASSED"
  else
    echo "Test '$test_name' FAILED"
    echo "Differences:"
    diff -u --ignore-space-change $expected_file $actual_file
  fi
}

# Liste des fichiers de test dans le répertoire INPUT_DIR
for input_file in $INPUT_DIR/*.csv; do
  # Extraire le nom de base du fichier sans l'extension
  base_name=$(basename "$input_file" .csv)

  # Définir les chemins des fichiers attendus et réels
  expected_file="$EXPECTED_DIR/$base_name.csv"
  actual_file="$ACTUAL_DIR/$base_name.csv"

  # Vérifier si le fichier attendu existe avant d'exécuter le test
  if [ -f "$expected_file" ]; then
    run_test "$base_name" "$input_file" "$expected_file" "$actual_file"
  else
    echo "Expected file $expected_file does not exist. Skipping test for $base_name."
  fi
done

echo "All tests completed."
