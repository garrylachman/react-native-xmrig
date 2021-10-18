# Configure target.
export TARGET=$1
export AR=$TOOLCHAIN/bin/llvm-ar
export CC=$TOOLCHAIN/bin/$TARGET$API-clang
export AS=$CC
export CXX=$TOOLCHAIN/bin/$TARGET$API-clang++
export LD=$TOOLCHAIN/bin/ld
export RANLIB=$TOOLCHAIN/bin/llvm-ranlib
export STRIP=$TOOLCHAIN/bin/llvm-strip
export PLATFORM=android
export CFLAGS="-D__ANDROID_API__=$API"

echo "Configure\n"
echo $TARGET

$ANDROID_HOME/cmake/3.10.2.4988404/bin/cmake -DCMAKE_TOOLCHAIN_FILE=$ANDROID_HOME/ndk/20.0.5594570/build/cmake/android.toolchain.cmake -DCMAKE_BUILD_TYPE=Release -DANDROID_ABI="arm64-v8a" -DANDROID_PLATFORM=android-21 ..
          $ANDROID_HOME/cmake/3.10.2.4988404/bin/cmake --build .

if [[ $2 == 'gyp' ]]
  then
    ./gyp_uv.py -Dtarget_arch=arm -DOS=android -f make-android
fi
