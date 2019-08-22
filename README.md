# Game of Life
Conway's Game of Life remade in JavaScript library React.js, Python Flask web framework and many other utilities

## Installation Guide
This project is configured as a NPM (Node Packet Manager) project  

### Prerequisities for the project configuration:  
-- NodeJS with NPM - version 10.0+  
-- Python 3.6+

### Project Setup
If all prerequisities are correctly installed, proceed to setup the project itself.  
Firstly, you'll setup the Node part of the project -- React front end.
After cloning this repository, open a terminal and run:  
```
npm install
```  
This will install all Node libraries and dependencies required. It should be run only once.  
To ready the project for development, enter the following command:  
```
npm start
```  
This will start Webpack to pack all the source files in `src` folder and deliver them for flask to use.  
Note: Hot reload is broken for now, looking forward to fix it. __Do NOT use this for production.__ If you want to setup the server for production rather than development, run the following command:  
```
npm run build:prod
```  
This will instruct Webpack to optimize and pack all files for it.  
After that, you'll setup the Python part of the project -- Flask backend.
To install all Pip modules required, open another terminal and run the following command:
```
pip install -r requirements.txt
```  
And lastly, to activate back end, run:  
#### Windows  
```
python app.py
```  
#### Linux and Mac  
```
python3 app.py
```  
Note #1: Debug mode is enabled in app.py, disable it if you want to use the app for production  
Note #2: You can setup Flask to run via `flask run`, should be fully compatible, just mind the note #1  

## Additional Notes
This is just a small side-project which I use to learn about React and web development in general. Feel free to contribute to this project, give any suggestion etc.  
;)
