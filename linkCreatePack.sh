#!/bin/bash

rm -rf dist
ng build @components/atheneaform

if [ $? -ne 0 ]; then
    echo "[*] The building process failed"
    exit 1
else 
    echo "[*] The building process was successful"
fi

cd dist/components/atheneaform 
npm link

if [ $? -ne 0 ]; then 
    echo "[*] The linking process failed"
    exit 1
else 
    echo "[*] The linking process was successful"
fi

echo "[*] The process finished successfully"

