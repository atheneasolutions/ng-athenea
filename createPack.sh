#!/bin/bash

function checkError {
        if [ $? -ne 0 ]; then
                echo "[*] Error in $1"
        else 
                echo "[*] Succes in $1"
        fi
}

npm cache clean --force &>/dev/null 
checkError "Cleaning cache"
npm cache verify &>/dev/null
checkError "Verifying cache"

rm -rf dist
ng build @components/atheneaform &>/dev/null
checkError "Building Component"

if [ $? -ne 0 ]; then
	echo "[*] The building process failed"
	exit
else 
	echo "[*] The building process was succesfull"
fi

cd dist/components/atheneaform 
npm pack &>/dev/null
checkError "Packing Component"

if [ $? -ne 0 ]; then 
	echo "[*] The packing process failed"
	exit
else 
	echo "[*] The packing process was succesfull"
fi

echo "[*] The process finished succesfully"
