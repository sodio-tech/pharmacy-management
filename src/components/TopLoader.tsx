"use client"

import NextTopLoader from 'nextjs-toploader'

export default function TopLoader() {
  return (
    <NextTopLoader
      showSpinner={false}
      color="#0f766e"
      height={3}
      easing="ease"
      speed={200}
      zIndex={9999}
    />
  )
}

