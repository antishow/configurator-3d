import {
	HemisphereLight,
	DirectionalLight,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader();

export const addSceneLights = (scene) => {
	const hemiLight = new HemisphereLight(0xffffff, 0x444444);
	hemiLight.position.set(0, 300, 0);
	scene.add(hemiLight);

	const dirLight = new DirectionalLight(0xffffff);
	dirLight.castShadow = true;
	dirLight.position.set(75, 300, -75);
	scene.add(dirLight);

	return scene;
};

const onLoadSceneProgress = (xhr) => {
	console.info(`${(xhr.loaded / xhr.total) * 100}% loaded`);
};

const onLoadSceneError = (error) => {
	console.error(error);
};

export const loadScene = (scene, onLoadScene) => {
	gltfLoader.load(scene, onLoadScene, onLoadSceneProgress, onLoadSceneError);
}
