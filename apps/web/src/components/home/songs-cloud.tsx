'use client'
import dynamic from 'next/dynamic'

const IconCloudWithMedia = dynamic(() => import('./songs-cloud-with-media'), {
  ssr: false
})

export default function SongsCloud() {
  return <IconCloudWithMedia />
}
