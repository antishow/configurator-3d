import anime from 'animejs/lib/anime.es.js';
import { Object3D, Quaternion, PerspectiveCamera } from 'three';

var element = null;
var camera = null;

const FIELD_OF_VIEW = 39.6;
const FAR_PLANE = 1000;
const NEAR_PLANE = 0.01;

export const initCamera = (_element) => {
	camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, NEAR_PLANE, FAR_PLANE);
	element = _element;

	refreshCamera();

	return camera;
}

export const refreshCamera = () => {
	camera.aspect = element.clientWidth / element.clientHeight;
	camera.fov = FIELD_OF_VIEW;
	camera.updateProjectionMatrix();
}

export const moveCameraToPosition = (position) => {
	return anime({
		targets: camera.parent.position,
		x: position.x,
		y: position.y,
		z: position.z,
		easing: 'linear',
	});
};

export const pointCameraToRotation = (quaternion) => {
	const startRotation = new Quaternion();
	startRotation.copy(camera.parent.quaternion);

	return anime({
		targets: camera.parent,
		update: (animation) => {
			Quaternion.slerp(
				startRotation,
				quaternion,
				camera.parent.quaternion,
				animation.progress / 100
			);
		}
	})
}

export const setMainCamera = (c) => {
	camera = c;
	return camera;
}

export const getMainCamera = () => camera;