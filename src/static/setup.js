import { MonacoEditorLanguageClientWrapper } from './monaco-editor-wrapper/index.js';
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/robot-language.monarch.js";
import { sendCode, sendParseAndValidate } from './simulator/websocket.js';

buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

const wrapper = new MonacoEditorLanguageClientWrapper();
const editorConfig = wrapper.getEditorConfig();
editorConfig.setMainLanguageId('robot-language');

editorConfig.setMonarchTokensProvider(monarchSyntax);

let code = `def entry() {
    var nb_octogone = 1

    loop nb_octogone <= 8 {
        octogone()
        nb_octogone = nb_octogone + 1
    }    
}

def octogone() {
    var cote = 1

    loop cote <= 8 {
        var distance_parcourue = 0
        loop distance_parcourue < 500 {
            forward 1 m
            distance_parcourue = distance_parcourue + 1
        }
        turn_left 45
        cote = cote + 1
    }
    turn_right 45
}`

editorConfig.setMainCode(code);

editorConfig.theme = 'vs-dark';
editorConfig.useLanguageClient = true;
editorConfig.useWebSocket = false;

const typecheck = (async () => {
    console.info('typechecking current code...');

    // To implement (Bonus)

    if (errors.length > 0) {
        const modal = document.getElementById("errorModal");
        modal.style.display = "block";
    } else {
        const modal = document.getElementById("validModal");
        modal.style.display = "block";
    }
});

const parseAndValidate = (async () => {
    console.info('validating current code...');
    const codeToParse = wrapper.getEditor().getValue();
    sendParseAndValidate(codeToParse);
});

const execute = (async () => {
    console.info('running current code...');
    
    // get code to interpret
    const code = wrapper.getEditor().getValue();
    
    sendCode(code);

});

const setupSimulator = (scene) => {
    const wideSide = max(scene.size.x, scene.size.y);
    let factor = 1000 / wideSide;

    window.scene = scene;

    scene.entities.forEach((entity) => {
        if (entity.type === "Wall") {
            window.entities.push(new Wall(
                (entity.pos.x) * factor,
                (entity.pos.y) * factor,
                (entity.size.x) * factor,
                (entity.size.y) * factor
            ));
        }
        if (entity.type === "Block") {
            window.entities.push(new Wall(
                (entity.pos.x) * factor,
                (entity.pos.y) * factor,
                (entity.size.x) * factor,
                (entity.size.y) * factor
            ));
        }
    });

    window.p5robot = new Robot(
        factor,
        scene.robot.pos.x,
        scene.robot.pos.y,
        scene.robot.size.x * factor,
        scene.robot.size.y * factor,
        scene.robot.rad
    );

   // window.entities.push(new Line(500, 500, 550, 500));
}

window.setupSimulator = setupSimulator;
window.execute = execute;
window.typecheck = typecheck;
window.parseAndValidate = parseAndValidate;

var errorModal = document.getElementById("errorModal");
var validModal = document.getElementById("validModal");
var closeError = document.querySelector("#errorModal .close");
var closeValid = document.querySelector("#validModal .close");
closeError.onclick = function () {
    errorModal.style.display = "none";
}
closeValid.onclick = function () {
    validModal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == validModal) {
        validModal.style.display = "none";
    }
    if (event.target == errorModal) {
        errorModal.style.display = "none";
    }
}

const workerURL = new URL('./robot-language-server-worker.js', import.meta.url);
console.log(workerURL.href);

const lsWorker = new Worker(workerURL.href, {
    type: 'classic',
    name: 'RobotLanguage Language Server'
});
wrapper.setWorker(lsWorker);

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
const startingPromise = wrapper.startEditor(document.getElementById("monaco-editor-root"))
