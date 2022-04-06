import { gsap } from 'gsap'

/**
 * Animate the shader and camera!
 * @param {object} world
 * @param {object} camera
 */
export default function animate(world, camera) {
  const glsl = world.material.items.shader.plane
  const perspectiveCamera = camera.instance

  const timeline = gsap.timeline({ repeat: -1 })

  timeline.to(glsl.uniforms.uElevation, {
    duration: 6,
    delay: 1,
    value: 0,
    ease: 'power1.inOut',
    repeat: 1,
    repeatDelay: 0.5,
    yoyo: true,
  })

  timeline.to(perspectiveCamera.position, {
    duration: 6,
    delay: 0.5,
    z: 0,
    ease: 'power1.inOut',
    repeat: 1,
    repeatDelay: 0.5,
    yoyo: true,
  })

  const cameraRotation = {
    tween: 0,
    end: 180 * (Math.PI / 180),
  }

  timeline.to(cameraRotation, {
    duration: 6,
    delay: 0.5,
    tween: cameraRotation.end,
    ease: 'power1.inOut',
    onUpdate() {
      perspectiveCamera.position.x = Math.sin(cameraRotation.tween)
      perspectiveCamera.position.z = 0.1 + Math.cos(cameraRotation.tween)
    },
  })

  timeline.to(glsl.uniforms.uTextureFrequency, {
    duration: 6,
    delay: 0.5,
    value: 50,
    ease: 'power1.inOut',
  })

  timeline.to(glsl.uniforms.uTextureFrequency, {
    duration: 6,
    delay: 0.5,
    value: 0.01,
    ease: 'power1.inOut',
  })

  timeline.to(glsl.uniforms.uTextureFrequency, {
    duration: 6,
    delay: 0.5,
    value: 8.15,
    ease: 'power1.inOut',
  })

  timeline.to(cameraRotation, {
    duration: 6,
    delay: 0.5,
    tween: 0,
    ease: 'power1.inOut',
    onUpdate() {
      perspectiveCamera.position.x = Math.sin(cameraRotation.tween)
      perspectiveCamera.position.z = 0.1 + Math.cos(cameraRotation.tween)
    },
    onComplete() {
      cameraRotation.tween = 0
    },
  })
}
