import { gsap } from 'gsap'

/**
 * Animate the shader and camera!
 * @param {object} world
 * @param {object} camera
 */
export default function animate(world, camera) {
  const glsl = world.material.items.shader.plane
  const timeline = gsap.timeline()

  timeline.to(glsl.uniforms.uElevation, {
    duration: 3,
    delay: 1,
    value: 0,
    repeat: 1,
    repeatDelay: 0.5,
    yoyo: true,
  })

  timeline.to(camera.instance.position, {
    duration: 3,
    z: 0,
    repeat: 1,
    repeatDelay: 0.5,
    yoyo: true,
  })
}
