import { onLoadScene as uiOnLoadScene, getState } from './ui';
import { setCameraAngle } from './camera';
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

		setCameraAngle(gltf.cameras[0]);

		const state = getState();

		gltf.scene.traverse((obj) => initSceneObject(obj, state));

		uiOnLoadScene(gltf);

		return onLoadScene(gltf);
	}, onLoadSceneProgress, onLoadSceneError);
}

const initSceneObject = (obj, state) => {
	const data = obj.userData || {};

	if (obj.type.match(/light$/i)) {
		obj.castShadow = true;
	}

	if (data.group) {
		obj.visible = state[data.group] == obj.name;
	}

	for (var key in data) {
		let val = data[key];
		if (['castShadow', 'receiveShadow'].includes(key)) {
			val = !!val;
		}

		obj[key] = val;
	}
}

export const getActiveScene = () => {
	return activeScene;
}