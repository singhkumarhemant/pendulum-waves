import * as THREE from "three";

class Pendulum {
	constructor(scene, options = {}) {
		this.scene = scene;
		this.z = options.z;
		this.phaseDiff = options.phaseDiff;
		this.position = options.position;
		this.startAngle = options.startAngle;
		this.length = options.length;
		this.sphereMaterialProps = options.sphereMaterialProps;

		this.angle = Math.PI;
		this.angleVelocity = 0;
		this.angleAcceleration = 0;
		this.origin = {
			x: 0,
			y: this.length,
		};
		this.current = {
			x: 0,
			y: 0,
		};

		this.create();
	}

	create() {
		const metalMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			metalness: 1,
			roughness: 0,
		});

		// the hook that holds the wire
		const hookGeometry = new THREE.TorusGeometry(0.1, 0.03, 32, 64);
		this.hook = new THREE.Mesh(hookGeometry, metalMaterial);
		this.hook.castShadow = true;
		this.hook.receiveShadow = true;

		// The wire that holds the sphere
		const wireGeometry = new THREE.CylinderGeometry(
			0.03,
			0.03,
			this.length,
			12
		);
		wireGeometry.translate(0, -this.length / 2, 0);
		this.wire = new THREE.Mesh(wireGeometry, metalMaterial);
		this.wire.castShadow = true;
		this.wire.receiveShadow = true;

		// The ring that surrounds the sphere
		const torusGeometry = new THREE.TorusGeometry(0.6, 0.1, 32, 64);
		this.torus = new THREE.Mesh(torusGeometry, metalMaterial);
		this.torus.castShadow = true;
		this.torus.receiveShadow = true;

		// The sphere
		const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		this.sphereMaterial = new THREE.MeshStandardMaterial(
			this.sphereMaterialProps
		);
		this.sphere = new THREE.Mesh(sphereGeometry, this.sphereMaterial);
		this.sphere.castShadow = true;
		this.sphere.receiveShadow = true;
	}

	addToScene() {
		// Add the meshes to the Scene
		this.scene.add(this.hook);
		this.scene.add(this.wire);
		this.scene.add(this.torus);
		this.scene.add(this.sphere);
	}

	removeFromScene() {
		this.scene.remove(this.wire);
		this.scene.remove(this.torus);
		this.scene.remove(this.sphere);
	}

	updateAngles() {
		this.angleAcceleration =
			2 * (0.001 + this.phaseDiff) * Math.sin(this.angle);
		this.angleVelocity += this.angleAcceleration;
		this.angle += this.angleVelocity;
	}

	updatePosition() {
		this.current.x =
			this.position.x +
			this.origin.x +
			this.length * Math.sin(this.angle);
		this.current.y =
			this.position.y +
			this.origin.y +
			this.length * Math.cos(this.angle);

		this.sphere.position.set(
			this.current.x,
			this.current.y,
			this.position.z + this.z
		);
		this.torus.position.set(
			this.current.x,
			this.current.y,
			this.position.z + this.z
		);
		this.wire.position.set(
			this.position.x,
			this.position.y + this.length,
			this.position.z + this.z
		);
		this.hook.position.set(
			this.position.x,
			this.position.y + this.length,
			this.position.z + this.z
		);

		this.wire.lookAt(this.sphere.position);
		this.wire.rotateX(-Math.PI / 2);
	}

	updateSphereMaterial(props) {
		this.sphereMaterial.color = new THREE.Color(props.color);
		this.sphereMaterial.emissive = new THREE.Color(props.emissive);
		this.sphereMaterial.emissiveIntensity = props.emissiveIntensity;
		this.sphereMaterial.metalness = props.metalness;
		this.sphereMaterial.roughness = props.roughness;
	}
}

export default Pendulum;
