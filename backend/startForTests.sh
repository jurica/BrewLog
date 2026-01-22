#/bin/bash
rm -rf pb_data
./BrewLog migrate
./BrewLog createTestUsers
./BrewLog serve
