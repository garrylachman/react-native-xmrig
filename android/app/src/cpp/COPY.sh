#!/bin/bash

WD=$(dirname pwd)
BASEDIR=$(dirname "$0")

rm -Rf ${BASEDIR}/../main/jniLibs/arm64-v8a/
rm -Rf ${BASEDIR}/../main/jniLibs/x86_64/
rm -Rf ${BASEDIR}/../main/jniLibs/x86/
rm -Rf ${BASEDIR}/../main/jniLibs/armeabi-v7a/

mkdir ${BASEDIR}/../main/jniLibs/arm64-v8a/
mkdir ${BASEDIR}/../main/jniLibs/x86_64/
mkdir ${BASEDIR}/../main/jniLibs/x86/
mkdir ${BASEDIR}/../main/jniLibs/armeabi-v7a/

cp -f ${BASEDIR}/../../.cxx/cmake/release/arm64-v8a/xmrig-notls ${BASEDIR}/../main/jniLibs/arm64-v8a/libxmrig.so
cp -f ${BASEDIR}/../../.cxx/cmake/release/x86_64/xmrig-notls ${BASEDIR}/../main/jniLibs/x86_64/libxmrig.so
cp -f ${BASEDIR}/../../.cxx/cmake/release/x86/xmrig-notls ${BASEDIR}/../main/jniLibs/x86/libxmrig.so
cp -f ${BASEDIR}/../../.cxx/cmake/release/armeabi-v7a/xmrig-notls ${BASEDIR}/../main/jniLibs/armeabi-v7a/libxmrig.so
