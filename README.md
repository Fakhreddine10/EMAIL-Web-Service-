First run the webservice.js with node webservice.js
Seconde Open command ligne and put this cmd: curl -X POST -H "Content-Type: application/json" -d @users.json http://localhost:3000/ReceiveJSON
Third you cand modify the json file to test the api and execute the same cmd.
if the users.json is valid so the api will send 200 like code and will send also all emails with valid adress mail so you can also find another json file which contain list of emails which the adresse mail is not valid, if not the api will send 400 like error code.
