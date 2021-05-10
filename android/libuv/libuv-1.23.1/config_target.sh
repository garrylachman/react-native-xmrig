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

if [[ $2 == 'gyp' ]]
  then
    ./gyp_uv.py -Dtarget_arch=arm -DOS=android -f make-android
fi
