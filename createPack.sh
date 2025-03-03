#!/bin/bash

rm -rf dist
ng build @components/atheneaform

if [ $? -ne 0 ]; then
	echo "[*] The building process failed"
	exit
else 
	echo "[*] The building process was succesfull"
fi

cd dist/components/atheneaform 
npm pack

if [ $? -ne 0 ]; then 
	echo "[*] The packing process failed"
	exit
else 
	echo "[*] The packing process was succesfull"
fi

echo "[*] The process finished succesfully"
