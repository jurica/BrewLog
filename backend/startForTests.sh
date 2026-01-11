#/bin/bash
cd ../backend
rm -rf pb_data
./BrewLog migrate
./BrewLog createTestUsers
./BrewLog serve
