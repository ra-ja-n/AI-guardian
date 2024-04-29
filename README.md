# Installation Guide


## 1. Run the following Docker command to run redis.

```bash
docker run --name redisKnack -d -p 6379:6379 redis
```

## 2. Download all the python code fom the following drive link:

```bash
https://drive.google.com/drive/folders/1qks16Pnkd4MqrRbLRy8chhKnt-25jVJj?usp=drive_link
```

## 3. Install Python

Ensure you have Python installed on your system. You can download and install Python from the [official Python website](https://www.python.org/downloads/) if you haven't already.

## 4. Install Required Libraries

Navigate to the project directory and install the necessary Python libraries using `pip` (Python's package manager). Run the following command in your terminal or command prompt:

```bash
pip install redis json pickle nltk sklearn flask docx PyPDF2 torch pandas transformers 
```


## 5. Run the Python code

Once all dependencies are installed, you can run the Python scripts or applications as per the project's documentation.


```bash
python.exe ran.py 
python.exe rule_engine.py
```

## 6. clone the following github repo

this repo contains all the client side and server side files

```bash
https://github.com/ayush3329/knacktohack-Final.git
```

## 7. starting the client side server

use this command to navigate to the Next folder
```bash
cd Next
```
use this command to install all dependencies 
```
npm install
```

use this command to start the client  
```
npm run dev
```

## 7. starting the socket server

use this command to navigate to the Next folder
```bash
cd socket_server
```
use this command to install all dependencies 
```
npm install
```

use this command to build the typeScript code 
```
tsc --watch
```

use this command to start the socket server
```
npm run socket
```


