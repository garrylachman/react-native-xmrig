#!/usr/bin/env bash

WD=$(dirname pwd)
BASEDIR=$(dirname "$0")
cd ${BASEDIR}

rm -fr out

##rm -fr out arm arm64 x86 x86_64 android-toolchain-**

chmod +x ./gyp_uv.py
chmod +x ./build/gyp -R

export NDK="/Users/garrylachman/Library/Android/sdk/ndk-bundle"
export TOOLCHAIN=$NDK/toolchains/llvm/prebuilt/darwin-x86_64
export API=29

if [ ! -d "$WD/arm64" ]
then
  source config_target.sh aarch64-linux-android gyp
  BUILDTYPE=Release make -C out
  mv -f out arm64
fi

if [ ! -d "$WD/arm" ]
then
  source config_target.sh armv7a-linux-androideabi gyp
  BUILDTYPE=Release make -C out
  mv -f out arm
fi

if [ ! -d "$WD/x86" ]
then
  source config_target.sh i686-linux-android gyp
  BUILDTYPE=Release make -C out
  mv -f out x86
fi

if [ ! -d "$WD/x86_64" ]
then
  source config_target.sh x86_64-linux-android gyp
  BUILDTYPE=Release make -C out
  mv -f out x86_64
fi

#source android-configure-arm ${NDK} gyp 23
#BUILDTYPE=Release make -C out
#mv -f out arm
#
#source android-configure-arm64 ${NDK} gyp 23
#BUILDTYPE=Release make -C out
#mv -f out arm64
#
#source android-configure-x86 ${NDK} gyp 23
#BUILDTYPE=Release make -C out
#mv -f out x86
#
#source android-configure-x86_64 ${NDK} gyp 23
#BUILDTYPE=Release make -C out
#mv -f out x86_64

cd ${WD}

