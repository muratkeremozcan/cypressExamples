## Quick start with cypress

```
npm i
npm start
```
On another tab
```
npm run cypress:open
```


## FlagApi

A basic application to get information about countries via a RESTful API (Node.JS Version). 

**This version of the API provide a little more information on countries: Flags + a numerous of test. It is the base of the book I am currently writing about testing an API. I have also added few routes and documentation with Apidoc**

The original code was named restcountrie. The project is available on the github account of [Hengki Sihombin](https://github.com/hengkiardo/restcountries)


The original and complete project is available at [REST Countries](https://restcountries.eu/https://restcountries.eu/)


### Requirements

If Homebrew, Node are not installed. Here the shortest procedure to install all requirements on a Mac. Very brief but you got the essentials, if you have already installed these tools, you can jump to the point 1.


**Install Homebrew**<br />
[Check the website brew.sh](https://brew.sh/) or launch in the console the following command.

```
$ /usr/bin/ruby -e "$(curl -k -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**Install Node and NPM**<br />

```
$ brew update
$ brew doctor
$ export PATH="/usr/local/bin:$PATH"
$ brew install node
```
Source: <a href="https://changelog.com/posts/install-node-js-with-homebrew-on-os-x" target="_blank">https://changelog.com/posts/install-node-js-with-homebrew-on-os-x</a>


### The tools that may interest you

You have to install Postman client and possibly Newman. "Newman is a line runner collection for Postman". Postman exists for Mac and for Windows.


* [Postman](https://www.getpostman.com/apps) - For the tests' execution, indispensable.


Other possible tools that maybe useful:

* [JSONlint](https://jsonlint.com/) - For JSON validation
* [JSONschema.net](https://jsonschema.net/) - For the generation of JSON schema
* [JSON pathfinder](https://chrome.google.com/webstore/detail/json-pathfinder/cgpbbgjlljobcemhhimjknkldpinacpn) - To make it easier to select data in a JSON (Chrome extension only)



### Clone and Start the application

If you already have NPM install and known how to clone

```
$ cd /path-to-your-where-you-want-to-create-your-app/
$ git clone https://github.com/bflaven/FlagApi.git FlagApi-v2
$ cd FlagApi-v2
$ npm install
$ npm start

```

### Run the test
Do not forget to launch the API before. The tests are using resources in JSON available in the directory **/resources-test/**

```
$ cd /path-to-your-where-you-want-to-create-your-app/FlagApi-v2/
$ npm test

```

## API

#### Get all the countries!
```
http://localhost:3000/api/v2/
```


#### Get countries by Region
```
http://localhost:3000/api/v2/region/:region_name

```
example: http://localhost:3000/api/v2/region/asia



#### Get countries by Sub-region

```
http://localhost:3000/api/v2/subregion/:subregion_name

```
example: http://localhost:3000/api/v2/subregion/Southern Europe



#### Get country by Currency

```
http://localhost:3000/api/v2/currency/:current_code

```
example: http://localhost:3000/api/v2/currency/IDR


#### Get country by Calling Code

```
http://localhost:3000/api/v2/callingcode/:calling_code

```
example: http://localhost:3000/api/v2/callingcode/60


#### Get country by Flag

```

http://localhost:3000/api/v2/flag/:flag_label

```
example: http://localhost:3000/api/v2/flag/jp



#### Get country by Capital

```

http://localhost:3000/api/v2/capital/:capital_label

```
example: http://localhost:3000/api/v2/capital/Santiago

#### Get countries by Language

```

http://localhost:3000/api/v2/language/:nativelanguage_label

```
example: http://localhost:3000/api/v2/language/spa


#### Get countries by Top Level Domain (tld)


```

http://localhost:3000/api/v2/tld/:tld_label

```
example: http://localhost:3000/api/v2/tld/.br



#### Get countries by Area
```

http://localhost:3000/api/v2/area/:area_nb

```
example: http://localhost:3000/api/v2/area/17098242



