import { Scene } from 'three';
import { loadScene } from './scene';
import { refreshCamera, getCamera } from './camera';
import { getRenderer } from './renderer';

const element = document.getElementById('configurator');

const scene = new Scene();
const renderer = getRenderer();
const camera = getCamera();

const refresh = () => {
	renderer.setSize(element.clientWidth, element.clientHeight);
	refreshCamera(renderer.domElement);
};

const onLoadScene = (gltf) => {
	scene.add(camera.parent);
	scene.add(gltf.scene);

	requestAnimationFrame(doFrame);
}

const initialize = (element) => {
	element.appendChild(renderer.domElement);
	loadScene('scene.glb', onLoadScene);

	window.addEventListener('resize', refresh);
	refresh();
};

const doFrame = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(doFrame);
};

initialize(element);
