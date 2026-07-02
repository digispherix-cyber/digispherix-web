'use client'

import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = ['#df5cf8', '#6e1dc0', '#f8b4fd']

function LogoModel() {
  const { scene } = useGLTF('/models/digispherix-logo-3d.glb')
  const ref = useRef()
  const colored = useRef(false)

  useEffect(() => {
    if (colored.current) return
    colored.current = true

    let i = 0
    const seen = new Set()
    scene.traverse(child => {
      if (child.isMesh && child.material && !seen.has(child.material.uuid)) {
        seen.add(child.material.uuid)
        const mat = child.material.clone()
        mat.color = new THREE.Color(COLORS[i % COLORS.length])
        mat.roughness = 0.35
        mat.metalness = 0.05
        child.material = mat
        i++
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 2.2 / maxDim
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)
  }, [scene])

  return <primitive ref={ref} object={scene} />
}

export default function Logo3DCanvas() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const hint = isTouch
    ? 'Desliza para rotar · Pellizca para zoom'
    : 'Arrastra para rotar · Scroll para zoom'

  return (
    <div style={{ width: '100%', height: '420px', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 5]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#df5cf8" />
        <pointLight position={[0, 4, 2]} intensity={1.5} color="#f8b4fd" />

        <Suspense fallback={null}>
          <LogoModel />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          zoomSpeed={0.4}
        />
      </Canvas>
      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9d8fc2', marginTop: '-8px' }}>
        {hint}
      </p>
    </div>
  )
}
