import { MonacoEditorLanguageClientWrapper } from './monaco-editor-wrapper/index.js';
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/robot-language.monarch.js";

buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

const wrapper = new MonacoEditorLanguageClientWrapper();
const editorConfig = wrapper.getEditorConfig();
editorConfig.setMainLanguageId('robot-language');

editorConfig.setMonarchTokensProvider(monarchSyntax);

let code = `def entry() {
    set_speed 10 cm
    square()
}

def square() {
    forward 1 m
    turn_left 90
    forward 1 m
    turn_left 90
    forward 1 m
    turn_left 90
    forward 1 m
    turn_left 90
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
    // To implement
});

const execute = (async () => {
    console.info('running current code...');

    const monacoEditor = document.getElementById("monaco-editor-root");
    console.log("editor :", monaco);

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
}

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



// const client = wrapper.getLanguageClient();
// if (!client) {
//     throw new Error('Unable to obtain language client!');
// }

// // listen for document change notifications
// client.onNotification('browser/DocumentChange', onDocumentChange);
// console.log(client);

// function onDocumentChange(resp) {
//     console.log(resp);
// }






