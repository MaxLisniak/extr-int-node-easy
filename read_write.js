const fs = require('fs');
const readline = require('node:readline');
const path = require('path');
const axios = require('axios').default;



async function readWrite() {

    // read from file function
    function read(filepath, nth = undefined, json = false) {
        try {
            const data = fs.readFileSync(filepath, 'utf8');
            if (nth === undefined) {
                if (json === true) {
                    console.log(JSON.parse(data))
                } else {
                    console.log(data);
                }
            } else {
                console.log(`${nth}th character: ` + data.charAt(nth));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // write to file
    function write(content, filepath) {
        try {
            fs.writeFileSync(filepath, content);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
    }


    // read from file
    read('query.sql');

    // write to file
    const contentToWrite = 'hello world';
    write(contentToWrite, 'write_test.txt');

    // read file line by line
    async function processLineByLine() {
        const fileStream = fs.createReadStream('query.sql');

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.

        for await (const line of rl) {
            // Each line in input.txt will be successively available here as `line`.
            console.log(`Line from file: ${line}`);
        }
    }

    await processLineByLine();

    // read Nth character from file
    read('query.sql', 10);

    // write json to file
    const obj = {
        name: 'joe',
        age: 35,
        person1: {
            name: 'Tony',
            age: 50,
            person2: {
                name: 'Albert',
                age: 21,
                person3: {
                    name: 'Peter',
                    age: 23,
                },
            },
        },
    };
    const objSring = JSON.stringify(obj, null, 2);
    write(objSring, 'object.json')

    // read json from file
    read('object.json', undefined, true);

    // print files recursively
    function getFiles(dirPath, currentLevel, maxLevel) {
        if (currentLevel > maxLevel) {
            return;
        } else {
            fs.readdirSync(dirPath).forEach(function (file) {
                let filepath = path.join(dirPath, file);
                let stat = fs.statSync(filepath);
                if (stat.isDirectory()) {
                    getFiles(filepath, currentLevel + 1, maxLevel);
                } else {
                    console.log({
                        filepath: filepath
                    });
                }
            });
        }
    }
    getFiles('./', 0, 2);

    // print directory tree
    function getAllFiles(dirPath, depth = 0) {
        fs.readdirSync(dirPath).forEach(function (file) {
            let filepath = path.join(dirPath, file);
            let stat = fs.statSync(filepath);
            console.info(" ".repeat(depth) + file);
            if (stat.isDirectory()) {

                getAllFiles(filepath, depth + 1);
            }
        });
    }
    getAllFiles('./');

    // get data from open api and save to file
    // Make a request for a user with a given ID
    axios.get("https://excuser.herokuapp.com/v1/excuse")
        .then(function (response) {
            // handle success
            write(JSON.stringify(response.data[0]), "excuse.json");
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

};
readWrite();