# Copy everything to build folder
cp favicon.ico build
cp -R css js images build

# Deploy build folder
cd build
find . -type f -exec curl --user $FTP_USER:$FTP_PASSWORD --ftp-create-dirs -T {} ftp://quoralis.com/curltest/{} \;