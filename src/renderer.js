import { WebGLRenderer, sRGBEncoding } from 'three';

const renderer = new WebGLRenderer({
	antialias: true,
	alpha: true,
});

renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.domElement.classList.add('canvas');

export const getRenderer = () => renderer;
