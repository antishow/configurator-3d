import anime from 'animejs/lib/anime.es.js';
import { Object3D, Quaternion, PerspectiveCamera } from 'three';

const FIELD_OF_VIEW = 39.6;
const FAR_PLANE = 1000;
const NEAR_PLANE = 0.01;

const camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, NEAR_PLANE, FAR_PLANE);
const cameraMan = new Object3D();

cameraMan.name = 'cameraOrientation';
cameraMan.add(camera);


export const setCameraAngle = (target) => {
	cameraMan.position.copy(target.parent.position);
	cameraMan.rotation.copy(target.parent.rotation);
	camera.rotation.copy(target.rotation);
	camera.position.copy(target.position);
}

export const moveToCameraAngle = (target) => {
	moveCameraToPosition(target.parent.position);
	pointCameraToRotation(target.parent.quaternion);
}

export const refreshCamera = (element) => {
	camera.aspect = element.clientWidth / element.clientHeight;
	camera.fov = FIELD_OF_VIEW;
	camera.updateProjectionMatrix();
}

export const moveCameraToPosition = (position) => {
	return anime({
		targets: cameraMan.position,
		x: position.x,
		y: position.y,
		z: position.z,
		easing: 'linear',
	});
};

export const pointCameraToRotation = (quaternion) => {
	const startRotation = new Quaternion();
	startRotation.copy(cameraMan.quaternion);

	return anime({
		targets: cameraMan,
		update: (animation) => {
			Quaternion.slerp(
				startRotation,
				quaternion,
				cameraMan.quaternion,
				animation.progress / 100
			);
		},
	});
}

export const getCamera = () => camera;
export const getCameraman = () => cameraMan;
