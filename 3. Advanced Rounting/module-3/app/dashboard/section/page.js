import React from 'react'
import Link from 'next/link'

const SectionPage = () => {
  return (
    <div>
        <h1>SectionPage</h1>
        <Link href={"/admin"} >Go to Admin</Link>
    </div>
  )
}

export default SectionPage