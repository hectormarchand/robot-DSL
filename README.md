# Robot-DSL

This repository explain how to use ou Rob laguage with its extension .rob.

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

The go to localhost:3000 and you can develop, validate and execute .rob code

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

### 1. Use arduino-cli

### Use Arduino Client

1. Open your .ino file in the Arduino Client
2. Add all needed librairies (zips available in /src/language/compiler/lib)
3. plug the robot to your computer
4. Click *Croquis > Vérifier/Compiler*
5. Click *Croquis > Téléverser*
