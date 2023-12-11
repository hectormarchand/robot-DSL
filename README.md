# Robot-DSL

This repository explain how to use ou Rob laguage with its extension .rob.

![](res/ecore.png)

## Rob Language Model
This is our Ecore Model

## How to interpret

#### 1. Install dependencies
```bash
npm install
```

#### 2. Build web
```bash
npm run build:web
```

#### 3. Run server
 ```bash
 npm run serve
 ```

Then go to localhost:3000 and you can develop, validate and execute .rob code

## How to compile

#### Create .rob file
Create a .rob and fill it with the algorithm you want. You'll find examples in examples/ directory.

#### Compile
 ```bash
 node ./bin/cli compile <path_to_your_file>
 ```
This will produce a file *output.ino* file int the output/ directory

## Televerse to the robot

In order to validate the .ino file and televerse it on the robot, you have to main options :

### 1. Compile command
The compile command above will compile the .rob code into .ino and automatically try to televerse it to the robot. Make sure you're connected to the robot and just run the command

### 2. Use Arduino Client

1. Open your .ino file in the Arduino Client
2. Add all needed librairies (zips available in /src/language/compiler/lib)
3. plug the robot to your computer
4. Click *Croquis > Vérifier/Compiler*
5. Click *Croquis > Téléverser*
