import * as dat from 'dat.gui';
import {
	Scene,
	WebGLRenderer,
	sRGBEncoding,
	Object3D,
} from 'three';

import { loadScene } from './scene';
import { initCamera, moveCameraToPosition, pointCameraToRotation, refreshCamera } from './camera';

const element = document.getElementById('configurator');
const renderer = new WebGLRenderer({
	antialias: true,
	alpha: true,
});

const state = {
	grip: 'Grip',
	sight: 'Sight',
};

const scene = new Scene();
const gui = new dat.GUI();

var camera = null;

const doFrame = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(doFrame);
};

const populateCameraSelect = (select, cameras) => {
	select.innerHTML = '';
	for (var i in cameras) {
		const cameraContainer = cameras[i].parent;
		const opt = document.createElement('option');
		opt.value = cameraContainer.name;
		opt.innerText = cameraContainer.name;
		select.appendChild(opt);
	}
}

const onLoadScene = (gltf) => {
	scene.add(gltf.scene);

	camera.parent.position.copy(gltf.cameras[0].parent.position);
	camera.parent.rotation.copy(gltf.cameras[0].parent.rotation);
	camera.rotation.copy(gltf.cameras[0].rotation);

	const camSelect = document.getElementById('camera-select');
	populateCameraSelect(camSelect, gltf.cameras);

	camSelect.addEventListener('change', (e) => {
		const target = gltf.cameras[e.target.selectedIndex].parent;
		moveCameraToPosition(target.position);
		pointCameraToRotation(target.quaternion);
	});

	const groups = {};

	gltf.scene.traverse((obj) => {
		const data = obj.userData || {};

		if (obj.type.match(/light$/i) || data.castShadow) {
			obj.castShadow = true;
		}

		if (data.receiveShadow) {
			obj.receiveShadow = true;
		}

		if (data.group) {
			obj.group = data.group;
			obj.visible = state[obj.group] == obj.name;

			if (!groups[data.group]) {
				groups[data.group] = [obj.name];
			} else {
				groups[data.group].push(obj.name);
			}
		}
	});

	for (var group in groups) {
		let guiEl = gui
		.add(state, group)
		.options(groups[group])
		.onChange(() => {
			gltf.scene.traverse((obj) => {
				if (obj.group) {
					obj.visible = state[obj.group] == obj.name;
				}
			});
		}).domElement;

		guiEl.children[0].name = group;
	}

	requestAnimationFrame(doFrame);
}

const initialize = (element) => {
	camera = initCamera(element);

	const cameraOrientation = new Object3D();
	cameraOrientation.name = 'CameraOrientation';
	cameraOrientation.add(camera);

	scene.add(cameraOrientation);

	renderer.setSize(element.clientWidth, element.clientHeight);
	renderer.outputEncoding = sRGBEncoding;
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.domElement.classList.add('canvas');

	element.appendChild(renderer.domElement);
	loadScene('scene.glb', onLoadScene);

	window.addEventListener('resize', () => {
		renderer.setSize(element.clientWidth, element.clientHeight);
		refreshCamera();
	});

	document.addEventListener('focus', (e) => {
		console.log('Focused on ', e.target);
	}, true);
};

initialize(element);
