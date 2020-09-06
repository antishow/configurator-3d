import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader();
var activeScene = null;

const onLoadSceneProgress = (xhr) => {
	console.info(`${(xhr.loaded / xhr.total) * 100}% loaded`);
};

const onLoadSceneError = (error) => {
	console.error(error);
};

export const loadScene = (scene, onLoadScene) => {
	gltfLoader.load(scene, (gltf) => {
		activeScene = gltf;
		return onLoadScene(gltf);
	}, onLoadSceneProgress, onLoadSceneError);
}

export const getActiveScene = () => {
	return activeScene;
}