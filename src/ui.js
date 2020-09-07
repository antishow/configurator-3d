import * as dat from 'dat.gui';
import { getActiveScene } from './scene';
import { moveToCameraAngle } from './camera';

const gui = new dat.GUI();
let blurTimeout = null;

const state = {
	grip: 'Grip',
	sight: 'Sight',
};

export const getState = () => Object.assign({}, state);

const getSceneGroups = (scene) => {
	const groups = {};

	scene.traverse((obj) => {
		const data = obj.userData || {};

		if (data.group) {
			if (!groups[data.group]) {
				groups[data.group] = [obj.name];
			} else {
				groups[data.group].push(obj.name);
			}
		}
	});

	return groups;
}

export const onLoadScene = (gltf) => {
	const groups = getSceneGroups(gltf.scene);

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
}

document.addEventListener(
	'focus',
	(e) => {
		const activeScene = getActiveScene();
		const groupCam = activeScene.cameras.find((c) => {
			return c.parent.userData.targetGroup == e.target.name;
		});

		if (groupCam) {
			clearTimeout(blurTimeout);
			moveToCameraAngle(groupCam);
		}
	},
	true
);

document.addEventListener(
	'blur',
	(e) => {
		blurTimeout = setTimeout(() => {
			const activeScene = getActiveScene();
			moveToCameraAngle(activeScene.cameras[0]);
		}, 500);
	},
	true
);